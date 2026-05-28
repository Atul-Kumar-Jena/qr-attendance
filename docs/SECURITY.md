# Security Model

## Trust Boundaries

- **Never trust the QR code alone.** The QR is a short-lived challenge token,
  not a credential. All validation happens server-side.
- **Never trust the client time.** Server time is authoritative for expiry.
- **Never trust the client's institution scope.** The API derives
  `institutionId` from the authenticated JWT, never from a request body field.

## Threat Model

| Threat                                    | Mitigation                              |
|-------------------------------------------|-----------------------------------------|
| Screenshot of QR sent to absent student   | Token expires in ≤10s, single-use nonce |
| QR token forwarded over chat              | Same as above + geofence check          |
| Forged QR token                           | HMAC-SHA256 / Ed25519 signature         |
| Replayed scan request                     | Nonce consumed atomically in Redis      |
| Reverse-engineered scan API used outside app | App attestation (Play Integrity / DeviceCheck) + request signing |
| Student logged in on a friend's phone     | Device binding on first login, admin-only reset |
| Mock-location app spoofing GPS            | Server-side mock-location flag check, accuracy threshold, fraud score |
| Brute force scan attempts                 | Per-student + per-IP rate limit         |
| Tenant A reading tenant B data            | Prisma extension forces institutionId filter on every query |
| Stolen JWT                                | Short access TTL (15min) + rotating refresh token bound to device |
| Stolen refresh token                      | Refresh rotation, family-id revocation on reuse |

## QR Token Format

```
header:  base64url({"alg":"HS256","typ":"AQR"})
payload: base64url({
  "iid": "<institutionId>",     // institution
  "cid": "<classId>",            // class
  "sid": "<sessionId>",          // active session
  "iat": 1715750000,             // issued at (server time)
  "exp": 1715750008,             // expiry (≤10s from iat)
  "nonce": "<128bit base64>",    // single-use, stored in Redis
  "ver": 1
})
signature: HMAC_SHA256(header.payload, QR_SIGNING_KEY)
```

Tokens are encoded into the QR as `aqr:v1:<header>.<payload>.<sig>`.

## Validation Pipeline (order matters — fail fast)

1. **Parse + signature** — reject if HMAC fails. *(no DB call)*
2. **Expiry** — reject if `now > exp`. *(no DB call)*
3. **Nonce check + consume** — Redis `SET <nonce> 1 NX EX <ttl>` returns nil if reused.
4. **Session OPEN** — Postgres lookup.
5. **Student auth** — JWT claim matches `studentId` and `institutionId == token.iid`.
6. **Device binding** — request's device fingerprint matches stored binding.
7. **App attestation** — verify Play Integrity / App Attest token against Google/Apple.
8. **Geofence** — Haversine distance from session geofence center ≤ radius. Reject if `mockLocation: true` flagged by client SDK.
9. **Duplicate check** — no existing PRESENT row for `(studentId, sessionId)`.
10. **Insert attendance + audit log**.

Any failure logs to `audit_logs` with a `reason_code`. Codes that indicate
intent (replay, mock-location, device mismatch, signature failure, geofence
miss) raise a `suspicious_activity_log` row too.

## Device Binding

On first login from the mobile app, the API stores:

```
device_bindings (
  studentId, deviceId, deviceFingerprint, platform, model, osVersion,
  appInstanceId, pushToken, boundAt, status
)
```

- Login from a different `deviceFingerprint` is rejected with `DEVICE_MISMATCH`.
- Reset requires an admin-approved request through the dashboard
  (`/admin/device-resets`). The reset bumps a `binding_generation` counter
  so old refresh tokens are invalidated.

## Request Signing

The mobile app signs every request with an app-issued symmetric key
derived per-install:

```
X-App-Signature: HMAC_SHA256(method + path + body + ts + nonce, appKey)
X-App-Timestamp: <unix>
X-App-Nonce: <random>
```

Server rejects if:

- `|now - ts| > 30s`
- Nonce already seen in last 60s (Redis)
- Signature mismatch

## App Attestation

- **Android** — Play Integrity API token attached to login + scan. Server
  verifies with Google Play Integrity backend; reject if `deviceIntegrity`
  is missing `MEETS_DEVICE_INTEGRITY` or `MEETS_BASIC_INTEGRITY`.
- **iOS** — DeviceCheck / App Attest assertion attached. Server validates
  with Apple's public keys.

Attestation results are cached per device for a short window so we don't
hit Google/Apple on every scan.

## Auth

- **Access tokens** — JWT, 15 min, HS256 with rotating key id.
- **Refresh tokens** — opaque, stored hashed in DB with `family_id` and
  `device_binding_id`. On refresh, a new pair is issued and the old token
  is marked `used`. If a token marked `used` is presented again, the whole
  family is revoked (token theft signal).
- **Sudo-admin / admin web** — same auth, plus optional TOTP MFA.

## Rate Limits

| Endpoint                | Limit                          |
|-------------------------|--------------------------------|
| `POST /v1/auth/login`   | 5 / minute / IP, 10 / hour / user |
| `POST /v1/attendance/scan` | 10 / minute / student      |
| `POST /v1/qr/refresh`   | 30 / minute / admin            |
| All other write routes  | 60 / minute / user             |

## Audit Trail

Every sensitive action writes an immutable row:

```
audit_logs (
  id, institutionId, actorUserId, actorRole,
  action,          -- LOGIN, QR_GENERATED, ATTENDANCE_MARKED,
                   -- DEVICE_RESET_APPROVED, SETTINGS_CHANGED, …
  targetType, targetId,
  ip, userAgent,
  metadata jsonb,
  createdAt
)
```

Logs are append-only at the DB level (revoke UPDATE/DELETE for the app role).

## Fraud Scoring

A weighted signal score per attempt:

| Signal                                | Weight |
|---------------------------------------|--------|
| Mock-location flag                    | +50    |
| Geofence miss > 2× radius             | +30    |
| Device fingerprint mismatch           | +40    |
| Same device seen for >1 student today | +35    |
| Same student trying from >1 device    | +35    |
| Token reuse                           | +50    |
| Impossible velocity from last scan    | +25    |
| Multiple failed scans in 5 min        | +10/ea |

Score ≥ 50 → `suspicious_activity_logs` row with the reason set; admin
sees it on the dashboard and can approve, reject, or escalate.

# Attendly Cloud Functions

Secure backend for the Attendly QR attendance system. All sensitive
operations — signing QR tokens, verifying scans, writing attendance records —
live here so they cannot be tampered with by clients.

Region: `us-central1`
Runtime: Node.js 20 (Firebase Functions v2 / 2nd gen)
Project: `attendly-the-solution`

---

## Prerequisites

- Node.js 20
- Firebase CLI: `npm i -g firebase-tools`
- Firebase project on the **Blaze (pay-as-you-go) plan** (required for 2nd-gen functions and outbound calls)

---

## One-time setup

```bash
# from repo root
firebase login
firebase use attendly-the-solution

# install function deps
cd functions
npm install

# generate a strong secret and store it in Secret Manager
firebase functions:secrets:set ATTENDLY_QR_HMAC_SECRET
# When prompted, paste a 32+ character random string. Suggested:
#   openssl rand -base64 48
```

The HMAC secret is read at function init. If it is missing the function will
throw a clear error on first invocation — deploy will appear to succeed but
every request will fail with `500 INTERNAL`. Always set the secret BEFORE
deploying.

---

## Local development

Emulator (does not need a real secret — set a local one in the shell):

```bash
export ATTENDLY_QR_HMAC_SECRET='dev-secret-32-bytes-min-aaaaaaaaaa'
cd functions
npm run build
npm run serve
```

The emulator prints a local URL like:
`http://localhost:5001/attendly-the-solution/us-central1/attendlyApi`

Point the web app at it with:
```bash
# in apps/web/.env.local
NEXT_PUBLIC_FUNCTIONS_BASE=http://localhost:5001/attendly-the-solution/us-central1/attendlyApi
```

---

## Tests

```bash
cd functions
npm test
```

The test suite (`src/tests/qr.test.ts`) covers the HMAC sign/verify
round-trip: valid token, tampered payload, `alg=none` forgery, expired,
not-yet-valid, and wrong typ/iss/aud claims. Tests use a fixed secret via
`process.env.ATTENDLY_QR_HMAC_SECRET`.

---

## Deploy

```bash
# Functions only
firebase deploy --only functions

# Firestore rules only
firebase deploy --only firestore:rules

# Everything
firebase deploy
```

---

## HTTP API

Base URL (production):
`https://us-central1-attendly-the-solution.cloudfunctions.net/attendlyApi`

All routes (except `/health`) require an `Authorization: Bearer <Firebase ID token>` header.

### `GET /health`
No auth. Returns `{ ok: true, service, region }`.

### `POST /sessions`
Roles allowed: developer, admin, institution, teacher.

```bash
curl -X POST "$BASE/sessions" \
  -H "Authorization: Bearer $ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "institutionId": "inst1",
    "classId": "CS-301-A",
    "subjectId": "OS",
    "teacherId": "uid-of-teacher",
    "centerLat": 12.9716,
    "centerLng": 77.5946,
    "radiusMeters": 80,
    "qrTtlSeconds": 15,
    "startsAt": 1716000000000,
    "expiresAt": 1716020000000
  }'
```
Validation: `radiusMeters ∈ [20, 300]`, `qrTtlSeconds ∈ [5, 30]`,
`startsAt < expiresAt`. Returns `{ ok: true, sessionId }`.

### `GET /sessions/:sessionId/qr`
Mint a fresh signed QR token. Allowed for the session's teacher/owner or
admin/institution/developer roles. Returns
`{ ok: true, qrToken, qrId, exp, ttlSec }`. Returns `410 Gone` if the session
is closed or past `expiresAt`.

```bash
curl "$BASE/sessions/$SID/qr" -H "Authorization: Bearer $ID_TOKEN"
```

### `POST /scan`
Student-side endpoint. The `studentId` MUST equal the authenticated uid.

```bash
curl -X POST "$BASE/scan" \
  -H "Authorization: Bearer $STUDENT_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "qrToken": "eyJhbGciOi...",
    "studentId": "uid-of-student",
    "deviceFingerprint": "DEV-7A2F-...",
    "studentLat": 12.9716,
    "studentLng": 77.5946,
    "accuracyMeters": 12,
    "clientTimestamp": 1716000123456
  }'
```

Verification pipeline (fails fast):
1. HMAC token signature/claims (`alg=none` explicitly rejected,
   `crypto.timingSafeEqual`).
2. Session must exist, `status === 'OPEN'`, within `[startsAt, expiresAt]`.
3. Token claims (institution, class) must match session.
4. Student must be a `classMembers` row for `classId == session.classId`.
5. Device fingerprint must match `studentDevices/{studentId}` (TOFU bind on
   first scan).
6. `accuracyMeters ≤ 50`.
7. Haversine distance ≤ `session.radiusMeters + 10m`.
8. Atomic duplicate check + record write via Firestore transaction at
   `attendanceSessions/{sid}/records/{studentId}`.

Every attempt (accept or reject) appends a `scanAttempts/{auto}` doc via
admin SDK.

Status codes:
- `200 { ok: true, distanceMeters }` — accepted
- `400 BAD_REQUEST` — malformed body
- `401 NO_AUTH` / `BAD_TOKEN` — missing/invalid Firebase ID token
- `403 FORBIDDEN | BAD_TOKEN | CLASS_MISMATCH | NOT_ENROLLED | DEVICE_MISMATCH | POOR_ACCURACY | OUT_OF_GEOFENCE | SESSION_CLOSED | SESSION_NOT_LIVE`
- `404 SESSION_NOT_FOUND`
- `409 DUPLICATE`
- `429 RATE_LIMITED` — in-memory per-IP limiter (~30/min)

---

## Firestore collections written

| Collection | Writer | Notes |
| --- | --- | --- |
| `attendanceSessions/{sid}` | createSession | Clients may also write today; can be tightened later. |
| `attendanceSessions/{sid}/records/{studentId}` | verifyScan (admin SDK only) | Rules block client writes. |
| `scanAttempts/{auto}` | verifyScan (admin SDK only) | Rules block client writes. Full audit of every attempt. |
| `studentDevices/{studentId}` | verifyScan (admin SDK only) | TOFU device binding. |
| `auditLogs/{auto}` | session/qrToken/scan | Best-effort, append-only. |

## Environment / secrets

- `ATTENDLY_QR_HMAC_SECRET` — required, ≥16 chars. Stored in Firebase Secret
  Manager; injected into the function at runtime via the v2 `secrets` option.

## Region

`us-central1` (set globally and on the `attendlyApi` export). Update both
`setGlobalOptions` and the `onRequest` options if you ever move regions.

---

## CORS

Allowed origins (set in both the Express middleware and the `onRequest` CORS
option):

- `https://atul-kumar-jena.github.io` (GitHub Pages production)
- `http://localhost:3000` (Next.js dev)

Add more by editing `ALLOWED_ORIGINS` in `src/index.ts`.

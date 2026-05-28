# Architecture

## High-Level

```
                ┌──────────────────────────────┐
                │   Public Website (Next.js)   │
                │   Landing • Pricing • Demo   │
                └──────────────┬───────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       │                       │                       │
┌──────▼────────┐    ┌─────────▼─────────┐   ┌─────────▼──────────┐
│  Admin Web    │    │   Mobile App      │   │  Public API        │
│  Dashboard    │    │   (RN, students)  │   │  (signup, demo)    │
│  (Next.js)    │    │                   │   │                    │
└──────┬────────┘    └─────────┬─────────┘   └─────────┬──────────┘
       │                       │                       │
       └───────────────────────┼───────────────────────┘
                               │ HTTPS, JWT, request signing
                  ┌────────────▼────────────┐
                  │   API Gateway / Nginx   │
                  │   Rate limiting · WAF   │
                  └────────────┬────────────┘
                               │
                  ┌────────────▼────────────┐
                  │  Node.js API (Express)  │
                  │  Auth · QR · Attendance │
                  │  Reports · Audit        │
                  └──┬──────────┬───────────┘
                     │          │
              ┌──────▼──┐   ┌───▼─────┐   ┌─────────┐
              │Postgres │   │ Redis   │   │ BullMQ  │
              │(Prisma) │   │(nonces, │   │workers  │
              │         │   │ ratelim)│   │(reports)│
              └─────────┘   └─────────┘   └─────────┘
```

## Multi-Tenancy

Every table that holds tenant data carries an `institution_id` FK. The API
middleware resolves the institution from one of:

1. JWT claim `inst` (for authenticated users)
2. `X-Institution-Code` header (for unauthenticated demo flows)
3. Subdomain (`<slug>.attendly.app`)

Every query is forced through a Prisma extension that injects
`where: { institutionId: ctx.institutionId }` so a tenant can never read
another's rows.

## Services

| Service           | Responsibility                                           |
|-------------------|----------------------------------------------------------|
| `auth`            | Login, refresh-token rotation, device binding            |
| `qr`              | Token mint, signature, nonce cache (Redis), expiry       |
| `attendance`      | Scan validation pipeline (signature → expiry → device → geofence → app attest → replay → duplicate) |
| `institutions`    | Tenant CRUD, geofence config, subscription state         |
| `users`           | Sudo-admin, admin/teacher, student CRUD                  |
| `sessions`        | Live class sessions, QR refresh loop, WebSocket fanout   |
| `reports`         | PDF / Excel / CSV generation (BullMQ background jobs)    |
| `audit`           | Append-only log of sensitive actions                     |

## QR Lifecycle

```
admin opens session ──► server creates session row ──► loop every N s:
                                                       mint token →
                                                       sign with HS256/Ed25519 →
                                                       SET nonce in Redis (TTL=2×rotation) →
                                                       push token to dashboard via WS

student scans QR ──► POST /attendance/scan
                       ├─ verify signature
                       ├─ verify expiry (server time)
                       ├─ check nonce exists + mark consumed (atomic)
                       ├─ check session is OPEN
                       ├─ check device binding matches
                       ├─ verify app attestation token
                       ├─ verify geofence (Haversine ≤ radius)
                       ├─ check no existing PRESENT row for (student, session)
                       └─ insert attendance + audit log
```

## Data Flow (attendance scan)

```
mobile app ── HTTPS POST /v1/attendance/scan ──► API
   body: { token, lat, lng, accuracy, deviceId, attestation }
   headers: Authorization, X-App-Signature, X-Nonce

API:
   1. requestSigning middleware  → reject if signature invalid
   2. rateLimit middleware       → 10 req/min/student
   3. auth middleware            → resolve student & institution
   4. attendance.controller.scan → run validation pipeline
   5. on PASS → INSERT attendance, audit "ATTENDANCE_MARKED"
      on FAIL → INSERT suspicious_activity_log if score>threshold,
                audit "ATTENDANCE_REJECTED" with reason code
   6. response: 200 / 4xx with non-sensitive reason
```

## Storage

- **Postgres** — source of truth, all tenant + audit data.
- **Redis** — QR nonces (set with TTL), refresh-token whitelist, rate-limit buckets, WS pub/sub for live QR.
- **S3 (or compatible)** — generated PDF/Excel report files, institution logos.

## Background Jobs (BullMQ)

| Queue              | Trigger                                  |
|--------------------|------------------------------------------|
| `reports`          | admin requests a date-range PDF/Excel    |
| `notifications`    | low-attendance alerts (push + email)     |
| `fraud-score`      | periodic recomputation of student risk   |
| `cleanup-nonces`   | safety net (Redis TTL is primary)        |

## Scaling

- API is **stateless** — horizontal scale behind a load balancer.
- WebSockets use Redis pub/sub adapter so any pod can fan-out QR updates.
- Postgres uses read replicas for reports; writes go to primary.
- Reports are generated in workers, never inline in HTTP requests.

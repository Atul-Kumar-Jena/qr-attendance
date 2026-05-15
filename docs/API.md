# API Reference

Base URL: `https://api.attendly.app/v1`

All requests require `Authorization: Bearer <accessToken>` unless noted.
Mobile app requests additionally require `X-App-Signature`, `X-App-Timestamp`, `X-App-Nonce`.

## Auth

### POST `/auth/login`
Login (admin web or mobile student).

```json
// request (student)
{
  "institutionCode": "DTU2025",
  "username": "20DTU0123",
  "password": "...",
  "device": {
    "id": "uuid",
    "fingerprint": "sha256...",
    "platform": "android",
    "model": "Pixel 8",
    "osVersion": "14"
  },
  "attestation": "<play-integrity-token>"
}
```

```json
// response
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { "id": "...", "role": "STUDENT", "institutionId": "..." },
  "deviceBound": true
}
```

Errors:
- `INVALID_CREDENTIALS`
- `DEVICE_MISMATCH` — student already bound to a different device
- `ATTESTATION_FAILED`
- `INSTITUTION_SUSPENDED`

### POST `/auth/refresh`
Rotates refresh token. Body: `{ "refreshToken": "..." }`.

### POST `/auth/logout`

## Institutions (sudo-admin / core)

- `GET /institutions/me` — current institution profile
- `PATCH /institutions/me` — update profile, geofence default, logo
- `POST /core/institutions` *(core only)* — create institution
- `POST /core/institutions/:id/suspend` *(core only)*

## Users

- `GET /users` — list users in institution (filterable by role)
- `POST /users` — create admin/teacher
- `POST /students` — create student
- `POST /students/import` — bulk CSV/Excel
- `POST /students/:id/device-reset` — admin approves device unbinding
- `PATCH /users/:id/suspend`

## Classes & Sessions

- `GET /classes` — parent/child classes, batches, sections
- `POST /classes`
- `POST /sessions` — create attendance session
  ```json
  { "classId":"...", "subjectId":"...", "qrRotationSec":7, "windowMin":15,
    "geofence":{ "lat":28.5, "lng":77.1, "radiusM":80 } }
  ```
- `POST /sessions/:id/start` — opens session, starts QR loop
- `POST /sessions/:id/end`
- `GET  /sessions/:id/live` — WS upgrade; pushes new QR every rotation
- `GET  /sessions/:id/attendance` — live list of marked students

## QR

- `POST /qr/refresh` — admin force-refresh token for a session
- `POST /qr/validate-preview` — admin debug endpoint, no DB writes

QR string format displayed to students: `aqr:v1:<header>.<payload>.<sig>`

## Attendance (mobile)

### POST `/attendance/scan`

```json
{
  "token": "aqr:v1:...",
  "location": { "lat":28.5012, "lng":77.1004, "accuracyM":8, "mock":false },
  "deviceId": "uuid",
  "attestation": "<token>"
}
```

Success:
```json
{ "status":"MARKED", "sessionId":"...", "markedAt":"2026-05-15T09:30:01Z" }
```

Errors (reason codes are deliberately coarse — details go to audit log):
- `TOKEN_INVALID` — bad signature, malformed, or unknown
- `TOKEN_EXPIRED`
- `TOKEN_REUSED`
- `SESSION_CLOSED`
- `DEVICE_MISMATCH`
- `GEOFENCE_FAILED`
- `ATTESTATION_FAILED`
- `ALREADY_MARKED`
- `SUSPICIOUS_REJECTED`

## Reports

- `POST /reports` — request report
  ```json
  { "type":"CLASS_MONTHLY", "classId":"...", "from":"2026-04-01", "to":"2026-04-30", "format":"pdf" }
  ```
  Response: `{ "jobId":"..." }`.
- `GET  /reports/:jobId` — `{ status:"DONE", downloadUrl:"https://..." }`
- `GET  /reports` — list past reports

## Audit & Suspicious

- `GET /audit` — paginated, filterable
- `GET /suspicious` — flagged scans, with admin actions (approve/reject)

## Webhooks (institutions)

- `attendance.marked`
- `session.started`
- `session.ended`
- `suspicious.flagged`
- `device.reset.requested`

Payload signed with per-institution webhook secret.

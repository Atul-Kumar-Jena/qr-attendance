# Attendly — QR Code Attendance Management SaaS

A production-grade multi-tenant SaaS platform for secure QR-based attendance for schools, colleges, universities, coaching centers and organizations.

> Dynamic signed QR tokens · Device binding · Geofencing · App attestation · Fraud detection · Audit trail

## Repository Layout

```
qr-attendance/
├── apps/
│   ├── web/        Next.js 14 — landing page + admin dashboard
│   ├── api/        Node.js + Express + Prisma — REST API
│   └── mobile/     React Native — student app skeleton
├── docs/           Architecture, security, API, deployment docs
└── README.md
```

## Quick Start

### Web (landing + dashboard)

```bash
cd apps/web
npm install
npm run dev          # http://localhost:3000
```

### API

```bash
cd apps/api
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev          # http://localhost:4000
```

### Mobile (skeleton)

```bash
cd apps/mobile
npm install
npm run ios          # or: npm run android
```

## Core Features

- **Multi-tenant SaaS** — every institution has fully isolated data (institution_id scoping at every layer).
- **Dynamic QR** — signed encrypted token rotated every few seconds, single-use, server-validated.
- **Device binding** — student account locked to one physical device after first login.
- **Geofencing** — scans validated against an institution-defined latitude/longitude/radius.
- **App attestation** — Play Integrity (Android) and DeviceCheck/App Attest (iOS).
- **Fraud detection** — multi-signal scoring with admin review flow.
- **Reports** — PDF / Excel / CSV with branding.
- **Audit logs** — every sensitive action traced.

## Docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system architecture and data flow
- [`docs/SECURITY.md`](docs/SECURITY.md) — security model, threat model, mitigations
- [`docs/API.md`](docs/API.md) — REST API surface
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — Docker, CI/CD, scaling

## License

MIT

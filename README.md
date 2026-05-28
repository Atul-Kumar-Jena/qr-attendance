# Attendly Flutter App

> Attendance, unforgeable.

QR-based attendance with device binding, geofencing, and hardware attestation.

## Setup

```bash
flutter pub get
flutter run
```

## Firebase
Connected to `attendly-the-solution` — same database as the web app.

## Structure
```
lib/
├── main.dart
├── router.dart
├── models/          # User, Session, Class
├── providers/       # Auth, Session, Theme
├── services/        # Firebase, Auth, Attendance, Session
├── theme/           # Colors, Typography, Theme
├── widgets/         # StatusPill, AppCard, AttendanceBar, Avatar...
└── screens/
    ├── auth/        # Login, OTP
    ├── onboarding/  # Name, Institution, Device Binding
    ├── student/     # Home, Classes, Scanner, Result, Profile
    ├── teacher/     # Dashboard, Create Session, Live QR, Scans, Reports
    └── developer/   # Console, Feature Flags, Tenants, Audit Log
```

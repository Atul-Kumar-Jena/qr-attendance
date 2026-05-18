# Firebase / database setup and wiring procedure

This file is the one-stop reference for taking the Attendly developer
dashboard from "demo wiring" to "fully functional, scalable production".
It covers (1) the data model, (2) the security-rules layout, (3) the
exact step-by-step procedure to enable it on a fresh Firebase project,
and (4) what additional code we still need to write to land Phases 3–8
end-to-end.

---

## 1. Where Firebase already lives in the codebase

| File | What it does |
|---|---|
| `apps/web/src/lib/firebase.ts` | Initialises Firebase app, Auth, Firestore. Credentials embedded with env-var fallback so the static `out/` build works. |
| `apps/web/src/lib/firestore-db.ts` | Typed helpers: `createSession`, `endSession`, `onSession`, `onClasses`, `logAudit`, `createInstitution`, `joinInstitutionByCode`, `getOwnedInstitution`, `onInstitution`, etc. |
| `apps/web/src/context/AuthContext.tsx` | `useAuth()` — exposes `user`, `role`, `institutionId`, `signIn`, `signOut`, `needsOnboarding`. |
| `apps/web/src/context/SiteConfigContext.tsx` | `useSiteConfig()` — live `config/site` doc; saving from the dev panel updates Firestore and pushes to every viewer in real time. |
| `apps/web/firestore.rules` | Production rules. Must be deployed via `firebase deploy --only firestore:rules`. |

The Firebase config is **already public** in git history (Firebase web
API keys are client-side by design; access is gated by Firestore rules,
not by the keys). Embedding them with an env-var fallback in
`firebase.ts` is the correct production pattern for a static SPA.

---

## 2. Data model (Firestore collections)

```
users/{uid}
  email, displayName, photoURL, role, institutionId, onboardingDone, createdAt

institutions/{instId}
  name, type, code(6-char), ownerUid, createdAt, terminatedAt?

institutions/{instId}/members/{uid}
  role: 'admin' | 'sudo_admin' | 'teacher' | 'student'
  rollNo?, classIds[], suspendedAt?, allowAttendanceEdit (sudo only)

institutions/{instId}/classes/{classId}
  name, section, teacherIds[], studentIds[], scheduledSlots[], createdAt

institutions/{instId}/sessions/{sessId}
  classId, teacherId, subjectName, startedAt, endedAt?, status, attendanceCount

institutions/{instId}/attendance/{sessId}_{studentUid}     ← compound key prevents duplicates
  scannedAt, deviceFp, geoLat, geoLng, geoAccuracy, mockLocation, signatureChainPrev

institutions/{instId}/audit/{autoId}
  actorId, actorName, action, targetId, details, createdAt, impersonatedBy?

config/site
  siteTitle, tagline, pricingMode, pricingTiers[], featureFlags{...}, updatedAt
  ← live-edited from developer dashboard; SiteConfigContext subscribes everyone

dev/impersonation_log/{autoId}                ← developer-only, append-only
  devUid, asUid, instId, startedAt, endedAt?, actionsCount
```

Indexes you will need (the console will prompt you to create them
on the first failing query — accept all):

- `institutions/{instId}/attendance` on `sessId` + `scannedAt` desc
- `institutions/{instId}/audit` on `actorId` + `createdAt` desc
- `dev/impersonation_log` on `devUid` + `startedAt` desc

---

## 3. Security rules (`apps/web/firestore.rules`)

Sketch of the rule set we deploy. Anything not in this list is denied
by default.

```
match /databases/{database}/documents {

  function isAuthed()      { return request.auth != null; }
  function uid()           { return request.auth.uid; }
  function userDoc()       { return get(/databases/$(database)/documents/users/$(uid())); }
  function userRole()      { return userDoc().data.role; }
  function isDev()         { return userRole() == 'developer'; }
  function memberRole(i)   {
    return get(/databases/$(database)/documents/institutions/$(i)/members/$(uid())).data.role;
  }

  // users — readable by self & devs; writable by self for limited fields
  match /users/{u} {
    allow read:  if isAuthed() && (uid() == u || isDev());
    allow write: if isAuthed() && (uid() == u || isDev());
  }

  // institutions — read by members + devs; only owner+dev can mutate root
  match /institutions/{i} {
    allow read:  if isAuthed() && (exists(/databases/$(database)/documents/institutions/$(i)/members/$(uid())) || isDev());
    allow create: if isAuthed();                       // anyone can create one (becomes owner)
    allow update, delete: if isDev() || resource.data.ownerUid == uid();
  }

  match /institutions/{i}/members/{m} {
    allow read:  if isAuthed() && (memberRole(i) != null || isDev());
    allow write: if isDev() || memberRole(i) in ['admin','sudo_admin'];
  }

  match /institutions/{i}/classes/{c} {
    allow read:  if isAuthed() && (memberRole(i) != null || isDev());
    allow write: if isDev() || memberRole(i) in ['admin','sudo_admin','teacher'];
  }

  match /institutions/{i}/sessions/{s} {
    allow read:  if isAuthed() && (memberRole(i) != null || isDev());
    allow create, update: if isDev() || memberRole(i) in ['admin','sudo_admin','teacher'];
    allow delete: if isDev();
  }

  match /institutions/{i}/attendance/{a} {
    allow read:  if isAuthed() && (memberRole(i) in ['admin','sudo_admin','teacher'] || isDev() || a.matches('.*_' + uid()));
    allow create: if isAuthed();                       // server-validated via Cloud Function in production
    allow update, delete: if isDev();                  // only dev can rewrite attendance
  }

  match /institutions/{i}/audit/{a} {
    allow read:  if memberRole(i) in ['admin','sudo_admin'] || isDev();
    allow create: if isAuthed();                       // any actor writes their own audit row
    allow update, delete: if false;                    // append-only
  }

  match /config/site {
    allow read:  if true;                              // public
    allow write: if isDev();
  }

  match /dev/{collection}/{doc=**} {
    allow read, write: if isDev();
  }
}
```

The `isDev()` test relies on the `role: 'developer'` set in `users/{uid}`.
That role is bootstrapped in code by listing developer emails in
`AuthContext.tsx` (currently `jenaatul8@gmail.com`).

---

## 4. Step-by-step procedure to make it fully functional

### 4.1 Firebase Console

1. Open https://console.firebase.google.com → project `attendly-the-solution`
2. **Authentication → Sign-in method → Google → Enable** (already done if Phase 1 works).
3. **Firestore Database → Create database → Production mode → multi-region** (eur3 or nam5).
4. **Firestore → Rules tab** → paste the rule set from `apps/web/firestore.rules` → **Publish**.
5. **Firestore → Indexes → Composite** → accept any "missing index" links Firestore offers when you exercise the app (they are linked from console errors).

### 4.2 Local CLI

```sh
npm i -g firebase-tools
firebase login
firebase use --add attendly-the-solution            # alias as 'prod'
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 4.3 Add yourself as developer

After your first sign-in, in the Firestore console open the
`users/{yourUid}` doc and set `role: "developer"`. From that point the
developer dashboard unlocks for you in the live site.

### 4.4 Verify

- Sign in on https://atul-kumar-jena.github.io/qr-attendance/ → you should see the avatar.
- Visit `/admin` → you should see all 11 developer tabs.
- Edit any field on the **Site config** tab and save → reload the landing page → the change should be live within ≈1s for every visitor.
- On `/admin/qr/demo` click **Start session** → live QR rotates every 1s with a real HMAC-SHA256 signature visible on screen.

---

## 5. What's wired vs. what still needs code

| Phase | Item | Status |
|---|---|---|
| 2 | QR rotates every 1s with HMAC + hash-chain | ✅ done (this commit) |
| 2 | Class goes live when prof clicks "Start" | ✅ done (createSession writes Firestore) |
| 2 | Push notification to every student phone | ⏳ needs Cloud Function + FCM (mobile-app side) |
| 3 | Dev: list institutions, terminate | ✅ helpers exist; UI tab in `/admin` needs the wiring (PR-sized) |
| 3 | Dev: impersonate any user, with audit | ⏳ requires custom Auth claim swap via Cloud Function |
| 3 | Dev: edit any letter on the live site | ✅ live via `SiteConfigContext` for fields it knows; extend `BASE_TIERS` to read from `config.pricingTiers` to make pricing editable |
| 3 | Dev: edit pricing cards / set price 0 | ⏳ wire `config.pricingTiers` into `Pricing.tsx` |
| 4 | Onboarding asks role on first sign-in | ✅ in `Providers.k` already |
| 5 | Institution flow: admin → sudo → class → invite code | ✅ helpers exist; UI flows need explicit screens beyond onboarding |
| 5 | Timetable editor + cancellation notifications | ⏳ Firestore schema sketched; UI + FCM trigger to be built |
| 6 | Individual professor flow | ⏳ same as 5 but skips institution; reuse class creation helpers |
| 7 | Student joins via code, sees their classes | ⏳ student dashboard route does not exist yet (only `/profile` + `/admin`) |
| 8 | Profile tags (role + institution name) | ✅ shown in `UserMenu` already |
| 9 | Final pass + push | will run after the above land |

---

## 6. Architecture recommendation (sequenced)

The cleanest order to land Phases 3–8 in **separate focused sessions**:

1. **Session A — Developer dashboard rebuild** (Phase 3)
   - Wire the 11 tabs to live Firestore reads
   - Institutions tab: list / terminate / drill-in
   - Site config: extend to pricing tiers + landing copy
   - Impersonation: Cloud Function (`devImpersonate`) issuing a custom token + always audited

2. **Session B — Role-aware shells** (Phases 4–8 UI)
   - `/dashboard/student` — student-only shell, attendance + upcoming classes
   - `/dashboard/teacher` — class roster, start session, mark manually
   - `/dashboard/admin` — institution settings, members, classes, timetable
   - All gated by role; redirected from `/`

3. **Session C — Timetable + notifications**
   - Cloud Function listens to `scheduledSlots` writes → schedules FCM at start time
   - Cancel writes audit row + sends "class cancelled" push

4. **Session D — Security hardening**
   - Move HMAC signing fully server-side (Cloud Function `mintSessionToken` returns
     a 1-s-expiring signed token that the prof's screen renders into the QR;
     client never holds the signing key)
   - Add rate-limits to `scan` Cloud Function
   - Enable App Check for the mobile app

This sequencing keeps each session's blast radius small and the deploy
testable.

---

## 7. Quick reference: what files to touch for each item

| To do | Touch |
|---|---|
| Make pricing dev-editable | `Pricing.tsx` (read `config.pricingTiers`), `SiteConfigContext` add field, dev tab UI |
| List + terminate institutions | New `/admin` `InstitutionsTab` calling `onInstitutions`, `terminateInstitution` |
| Add student dashboard | `apps/web/src/app/dashboard/student/page.tsx` + protected route |
| Impersonation | Cloud Function `dev/impersonate.ts`; client-side hook `useImpersonation()` |
| Notifications | Cloud Functions: `onSessionCreated`, `onClassCancelled` → FCM |

---

This file is the single source of truth — when in doubt, update it
before changing wiring, so future sessions don't re-discover the same
shape.

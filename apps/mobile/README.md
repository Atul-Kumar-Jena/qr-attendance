# Attendly Mobile

React Native (Expo) student app.

- `src/services/api.ts` — signed HTTP client, login, scan, refresh.
- `src/screens/ScannerScreen.tsx` — camera + geolocation + scan flow.
- `src/screens/HistoryScreen.tsx` — (todo) per-subject attendance history.
- `src/screens/LoginScreen.tsx` — (todo) institution-code + creds login.

## Native modules to wire for production

| Concern             | Package                                              |
|---------------------|------------------------------------------------------|
| Play Integrity      | `react-native-play-integrity`                        |
| App Attest          | `react-native-ios-app-attest`                        |
| Strong device id    | `expo-application` + native ANDROID_ID / IDFV combo  |
| Mock-location flag  | `expo-location` returns `mocked` on Android          |
| Secure storage      | `expo-secure-store`                                  |
| Push (FCM)          | `expo-notifications`                                 |

## Build flags

- `EXPO_PUBLIC_API_URL` — server base URL
- `EXPO_PUBLIC_APP_KEY` — per-build request-signing key

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { scan } from '../services/api';

export function ScannerScreen() {
  const [perm, requestPerm] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => { if (!perm?.granted) requestPerm(); }, [perm, requestPerm]);

  if (!perm?.granted) {
    return <View style={s.center}><Text>Camera permission required</Text></View>;
  }

  const handle = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      const result = await scan({
        token: data,
        location: {
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
          accuracyM: Math.round(loc.coords.accuracy ?? 0),
          mock: (loc as unknown as { mocked?: boolean }).mocked === true,
        },
      });
      if (result.status === 'MARKED') {
        Alert.alert('Attendance marked', `Session ${result.sessionId}`);
      } else {
        Alert.alert('Rejected', friendly(result.code));
      }
    } catch (e: unknown) {
      Alert.alert('Error', (e as Error).message);
    } finally {
      setTimeout(() => setScanned(false), 2000);
    }
  };

  return (
    <View style={s.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handle}
      />
      <View style={s.overlay} pointerEvents="none">
        <Text style={s.title}>Scan the class QR</Text>
        <View style={s.frame} />
        <Text style={s.hint}>Hold steady · token rotates every 7s</Text>
      </View>
    </View>
  );
}

function friendly(code: string) {
  switch (code) {
    case 'TOKEN_EXPIRED': return 'QR expired. A new one is on screen — try again.';
    case 'TOKEN_REUSED': return 'This QR has already been used.';
    case 'DEVICE_MISMATCH': return 'This device is not bound to your account.';
    case 'GEOFENCE_FAILED': return 'You are outside the classroom area.';
    case 'ALREADY_MARKED': return 'You are already marked for this session.';
    case 'MOCK_LOCATION': return 'Mock-location detected. Disable it and try again.';
    default: return 'Could not mark attendance.';
  }
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', marginBottom: 24, fontSize: 18 },
  frame: { width: 260, height: 260, borderColor: '#FF6B3D', borderWidth: 2, borderRadius: 16 },
  hint: { color: 'rgba(255,255,255,0.6)', marginTop: 24, fontSize: 12 },
});

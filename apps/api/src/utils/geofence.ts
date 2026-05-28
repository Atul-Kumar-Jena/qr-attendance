/**
 * Haversine distance in meters between two lat/lng points.
 * Earth radius 6_371_000 m.
 */
export function haversineMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export interface GeofenceCheck {
  inside: boolean;
  distanceM: number;
}

export function checkGeofence(
  scan: { lat: number; lng: number },
  fence: { lat: number; lng: number; radiusM: number },
): GeofenceCheck {
  const d = haversineMeters(scan.lat, scan.lng, fence.lat, fence.lng);
  return { inside: d <= fence.radiusM, distanceM: Math.round(d) };
}

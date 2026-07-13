/**
 * Great-circle distance between two WGS-84 coordinates using the Haversine
 * formula. Returns meters. Accurate to ~0.5% (good enough for ≤300 m
 * classroom geofences).
 */

const EARTH_RADIUS_M = 6_371_000;

function isValidLat(lat: number): boolean {
  return Number.isFinite(lat) && lat >= -90 && lat <= 90;
}

function isValidLon(lon: number): boolean {
  return Number.isFinite(lon) && lon >= -180 && lon <= 180;
}

export function validateCoords(lat: number, lon: number, label = 'coord'): void {
  if (!isValidLat(lat)) throw new Error(`${label}: latitude out of range [-90, 90]`);
  if (!isValidLon(lon)) throw new Error(`${label}: longitude out of range [-180, 180]`);
}

const toRad = (deg: number): number => (deg * Math.PI) / 180;

export type DistanceResult = {
  meters: number;
};

export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): DistanceResult {
  validateCoords(lat1, lon1, 'point1');
  validateCoords(lat2, lon2, 'point2');

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return { meters: EARTH_RADIUS_M * c };
}

import geohash from 'ngeohash';

/**
 * Calculates a geohash for a given latitude and longitude.
 * Precision of 5 provides an area of roughly 4.9km x 4.9km.
 */
export function getGeohash(lat: number, lon: number, precision = 5): string {
  return geohash.encode(lat, lon, precision);
}

/**
 * Calculates the 9 geohashes representing a given point and its 8 immediate neighbors.
 * Returns an array of geohash strings.
 */
export function getGeohashNeighbors(lat: number, lon: number, precision = 5): string[] {
  const centerHash = getGeohash(lat, lon, precision);
  const neighbors = geohash.neighbors(centerHash);
  return [centerHash, ...neighbors];
}

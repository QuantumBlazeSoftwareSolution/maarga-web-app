import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, isNull } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { stationTable } from '../lib/db/schema/station';
import { districtEnumItems } from '../lib/db/schema/enum';

// Load environment variables
dotenv.config({ path: '.env.development' });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

/**
 * Normalizes API response district names to our Enum
 */
const normalizeDistrict = (
  name: string,
): (typeof districtEnumItems)[number] | null => {
  if (!name) return null;
  // Sri Lankan districts from API often end with " District" or have "DS Division" (which we want to ignore for the main district)
  const cleanName = name
    .replace(/ district/i, '')
    .replace(/ ds division/i, '')
    .trim();

  // Manual mappings for common mismatches
  const manualMapping: Record<string, (typeof districtEnumItems)[number]> = {
    Monaragala: 'Moneragala',
    Kurunǣgala: 'Kurunegala',
    'Nuwara-Eliya': 'Nuwara Eliya',
    'Matara-District': 'Matara',
    'Galle-District': 'Galle',
  };

  if (manualMapping[cleanName]) return manualMapping[cleanName];

  const match = districtEnumItems.find(
    (d) => d.toLowerCase() === cleanName.toLowerCase(),
  );
  return match || null;
};

async function enrichDistricts() {
  console.log('🚀 Starting District Enrichment...');

  // 1. Fetch stations without a district
  const stations = await db
    .select({
      id: stationTable.id,
      name: stationTable.name,
      latitude: stationTable.latitude,
      longitude: stationTable.longitude,
    })
    .from(stationTable)
    .where(isNull(stationTable.district));

  console.log(`📊 Found ${stations.length} stations needing enrichment.`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < stations.length; i++) {
    const s = stations[i];
    console.log(`[${i + 1}/${stations.length}] Processing: ${s.name}...`);

    try {
      // 2. Call Nominatim Reverse Geocoding API
      // We must use a User-Agent to avoid 403 / blocking
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${s.latitude}&lon=${s.longitude}&zoom=10`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'MaargaWebApp-EnrichmentBot/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(`   🔍 Raw Address:`, JSON.stringify(data.address));

      // Nominatim hierarchy in Sri Lanka:
      // address.state_district is usually the canonical District name.
      // address.county is often the DS Division (which we use if state_district is missing).
      const rawDistrict =
        data.address?.state_district ||
        data.address?.county ||
        data.address?.district ||
        data.address?.city_district;
      const district = normalizeDistrict(rawDistrict);

      if (district) {
        await db
          .update(stationTable)
          .set({ district })
          .where(eq(stationTable.id, s.id));
        console.log(`   ✅ Mapped to: ${district}`);
        successCount++;
      } else {
        console.warn(`   ⚠️  Could not map raw district: "${rawDistrict}"`);
        failCount++;
      }
    } catch (error) {
      console.error(`   ❌ Error:`, error);
      failCount++;
    }

    // 3. Respect Rate Limit (1.5s delay)
    if (i < stations.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  console.log('\n✨ Enrichment Task Complete!');
  console.log(`✅ Successfully updated: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  process.exit(0);
}

enrichDistricts().catch((err) => {
  console.error('Fatal Error:', err);
  process.exit(1);
});

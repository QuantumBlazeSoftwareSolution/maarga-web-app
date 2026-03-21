'use server';

import { db } from '@/src/lib/db';
import { itemsTable } from '@/src/lib/db/schema/items';
import { eq } from 'drizzle-orm';

const COMMON_ITEMS = [
  // Fuel Types
  { name: '92 Octane Petrol', description: 'Standard 92 Octane Petrol (Lanka Petrol 92)', itemType: 'fuel' as const },
  { name: '95 Octane Petrol', description: 'Premium 95 Octane Petrol (Euro 4 Standard)', itemType: 'fuel' as const },
  { name: 'Auto Diesel', description: 'Standard Auto Diesel for transport and machinery', itemType: 'fuel' as const },
  { name: 'Super Diesel', description: 'Premium Super Diesel (Euro 4 Standard)', itemType: 'fuel' as const },
  { name: 'Lanka Kerosene', description: 'Standard Kerosene for domestic and industrial use', itemType: 'fuel' as const },
  
  // Gas Types
  { name: 'LP Gas (12.5kg)', description: 'Standard Domestic LP Gas Cylinder (Litro/Laugfs)', itemType: 'gas' as const },
  { name: 'LP Gas (5kg)', description: 'Small Domestic LP Gas Cylinder', itemType: 'gas' as const },
  { name: 'LP Gas (2.3kg)', description: 'Portable LP Gas Cylinder', itemType: 'gas' as const },

  // EV Types
  { name: 'DC Fast Charging', description: 'High-speed DC Level 3 EV Charging', itemType: 'ev' as const },
  { name: 'AC Type 2 Charging', description: 'Standard AC Level 2 EV Charging', itemType: 'ev' as const },
];

/**
 * Seeds the items table with common fuel, gas, and EV types.
 * Prevents duplicates by checking for existing names.
 */
export async function seedCommonItems() {
  try {
    let createdCount = 0;
    
    for (const item of COMMON_ITEMS) {
      const existing = await db.select()
        .from(itemsTable)
        .where(eq(itemsTable.name, item.name))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(itemsTable).values(item);
        createdCount++;
      }
    }

    return { 
      success: true, 
      message: `Seed complete. ${createdCount} new items added.`,
      count: createdCount 
    };
  } catch (error) {
    console.error('[SEED ERROR]', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error during seeding' 
    };
  }
}

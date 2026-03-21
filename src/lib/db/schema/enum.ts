import { pgEnum } from 'drizzle-orm/pg-core';

// Availability status for station items
export const availabilityEnumItems = ['available', 'low', 'out'] as const;
export const availabilityEnum = pgEnum('availability', availabilityEnumItems);

// Queue
export const queueEnumItems = ['no_queue', 'short', 'medium', 'long'] as const;
export const queueEnum = pgEnum('queue_status', queueEnumItems);

// item type
export const itemTypeEnumItems = ['fuel', 'gas', 'ev'] as const;
export const itemTypeEnum = pgEnum('item_type', itemTypeEnumItems);

// otp status
export const userStatusEnumItems = ['pending', 'active', 'inactive'] as const;
export const userStatusEnum = pgEnum('user_status', userStatusEnumItems);

// admin roles
export const adminRoleEnumItems = ['super_admin', 'admin'] as const;
export const adminRoleEnum = pgEnum('admin_role', adminRoleEnumItems);
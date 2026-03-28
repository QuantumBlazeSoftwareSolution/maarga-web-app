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

// station types
export const stationTypeEnumItems = ['fuel', 'gas', 'ev'] as const;
export const stationTypeEnum = pgEnum('station_type', stationTypeEnumItems);

// report status
export const reportStatusEnumItems = [
  'pending',
  'approved',
  'suspended',
] as const;
export const reportStatusEnum = pgEnum('report_status', reportStatusEnumItems);

// support status
export const supportStatusEnumItems = [
  'pending',
  'open',
  'resolved',
  'closed',
] as const;
export const supportStatusEnum = pgEnum(
  'support_status',
  supportStatusEnumItems,
);

export const districtEnumItems = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Matale',
  'Nuwara Eliya',
  'Galle',
  'Matara',
  'Hambantota',
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Vavuniya',
  'Mullaitivu',
  'Batticaloa',
  'Ampara',
  'Trincomalee',
  'Kurunegala',
  'Puttalam',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Moneragala',
  'Ratnapura',
  'Kegalle',
] as const;
export const districtEnum = pgEnum('district', districtEnumItems);

export const supportTopicValueEnumItems = [
  'delete-account',
  'remove-data',
  'privacy-concern',
  'account-issue',
  'app-feedback',
  'other',
] as const;
export const supportTopicValueEnum = pgEnum(
  'support_topic_value',
  supportTopicValueEnumItems,
);

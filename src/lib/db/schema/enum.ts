import { pgEnum } from 'drizzle-orm/pg-core';

// Availability status for station items
export const availabilityEnumItems = ['available', 'low', 'out'] as const;
export type Availability = (typeof availabilityEnumItems)[number];
export const availabilityEnum = pgEnum('availability', availabilityEnumItems);

// Queue
export const queueEnumItems = ['no_queue', 'short', 'medium', 'long'] as const;
export const queueEnum = pgEnum('queue_status', queueEnumItems);

// item type
export const itemTypeEnumItems = ['fuel', 'gas', 'ev'] as const;
export type ItemType = (typeof itemTypeEnumItems)[number];
export const itemTypeEnum = pgEnum('item_type', itemTypeEnumItems);

// otp status
export const userStatusEnumItems = ['pending', 'active', 'inactive'] as const;
export const userStatusEnum = pgEnum('user_status', userStatusEnumItems);

// admin roles
export const adminRoleEnumItems = ['super_admin', 'admin'] as const;
export const adminRoleEnum = pgEnum('admin_role', adminRoleEnumItems);

// station types
export const stationTypeEnumItems = ['fuel', 'gas', 'ev'] as const;
export type StationType = (typeof stationTypeEnumItems)[number];
export const stationTypeEnum = pgEnum('station_type', stationTypeEnumItems);

// report status
export const reportStatusEnumItems = [
  'pending',
  'approved',
  'suspended',
] as const;
export type ReportStatus = (typeof reportStatusEnumItems)[number];
export const reportStatusEnum = pgEnum('report_status', reportStatusEnumItems);

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
export type District = (typeof districtEnumItems)[number];
export const districtEnum = pgEnum('district', districtEnumItems);

export const stationStatusEnumItems = [
  'pending',
  'approved',
  'suspended',
] as const;
export type StationStatus = (typeof stationStatusEnumItems)[number];
export const stationStatusEnum = pgEnum('status', stationStatusEnumItems);

export const approvalLevelEnumItems = [
  'pending',
  'initialized',
  'approved',
  'rejected',
] as const;
export type ApprovalLevel = (typeof approvalLevelEnumItems)[number];
export const approvalLevelEnum = pgEnum('level', approvalLevelEnumItems);

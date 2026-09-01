import {
  User as DBUser,
  BrandProfile as DBBrandProfile,
  ClipperProfile as DBClipperProfile,
  Campaign as DBCampaign,
  CampaignAsset as DBCampaignAsset,
  Claim as DBClaim,
  Submission as DBSubmission,
  TrackedLink as DBTrackedLink,
  TrackingSnapshot as DBTrackingSnapshot,
  Transaction as DBTransaction,
  Payout as DBPayout,
  AuditLog as DBAuditLog,
} from '../lib/db/schema';

// Export type aliases from Drizzle inferred types
export type User = DBUser;
export type BrandProfile = DBBrandProfile;
export type ClipperProfile = DBClipperProfile;
export type Campaign = DBCampaign;
export type CampaignAsset = DBCampaignAsset;
export type Claim = DBClaim;
export type Submission = DBSubmission;
export type TrackedLink = DBTrackedLink;
export type TrackingSnapshot = DBTrackingSnapshot;
export type Transaction = DBTransaction;
export type Payout = DBPayout;
export type AuditLog = DBAuditLog;

// Enums / Statuses mapped to TypeScript literal types
export type Role = 'BRAND' | 'CLIPPER' | 'ADMIN';
export type KybStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type KycStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type TaxFormStatus = 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED';
export type PayoutType = 'PER_POST' | 'CPM' | 'HYBRID';
export type EscrowStatus = 'UNFUNDED' | 'FUNDED' | 'PARTIALLY_RELEASED' | 'FULLY_RELEASED' | 'REFUNDED';
export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
export type AssetStatus = 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED';
export type ClaimStatus = 'CLAIMED' | 'EXPIRED' | 'SUBMITTED' | 'COMPLETED' | 'CANCELLED';
export type SubmissionStatus = 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'PUBLISHED' | 'PAID';
export type TrackedLinkStatus = 'PENDING_VERIFICATION' | 'VERIFIED' | 'TRACKING' | 'COMPLETED' | 'FAILED';
export type TransactionType = 'DEPOSIT' | 'HOLD' | 'RELEASE' | 'COMMISSION' | 'REFUND';
export type TransactionStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type PayoutStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

// Utility types
export type WithId<T> = T & { id: string };
export type Timestamped<T> = T & { createdAt: Date | null; updatedAt: Date | null };

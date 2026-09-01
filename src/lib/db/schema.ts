import {
  pgTable,
  uuid,
  text,
  varchar,
  boolean,
  timestamp,
  integer,
  jsonb,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- ENUMS ---
export const roleEnum = pgEnum('role', ['BRAND', 'CLIPPER', 'ADMIN']);
export const kybStatusEnum = pgEnum('kyb_status', ['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED']);
export const kycStatusEnum = pgEnum('kyc_status', ['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED']);
export const taxFormStatusEnum = pgEnum('tax_form_status', ['NOT_SUBMITTED', 'PENDING', 'APPROVED']);
export const payoutTypeEnum = pgEnum('payout_type', ['PER_POST', 'CPM', 'HYBRID']);
export const escrowStatusEnum = pgEnum('escrow_status', ['UNFUNDED', 'FUNDED', 'PARTIALLY_RELEASED', 'FULLY_RELEASED', 'REFUNDED']);
export const campaignStatusEnum = pgEnum('campaign_status', ['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED']);
export const assetStatusEnum = pgEnum('asset_status', ['UPLOADING', 'PROCESSING', 'READY', 'FAILED']);
export const claimStatusEnum = pgEnum('claim_status', ['CLAIMED', 'EXPIRED', 'SUBMITTED', 'COMPLETED', 'CANCELLED']);
export const submissionStatusEnum = pgEnum('submission_status', ['PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED', 'PAID']);
export const trackedLinkStatusEnum = pgEnum('tracked_link_status', ['PENDING_VERIFICATION', 'VERIFIED', 'TRACKING', 'COMPLETED', 'FAILED']);
export const transactionTypeEnum = pgEnum('transaction_type', ['DEPOSIT', 'HOLD', 'RELEASE', 'COMMISSION', 'REFUND']);
export const transactionStatusEnum = pgEnum('transaction_status', ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']);
export const payoutStatusEnum = pgEnum('payout_status', ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']);

// --- TABLES ---

/**
 * Users table storing basic auth and profile information
 */
export const users = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  role: roleEnum('role').notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  passwordHash: text('password_hash'),
  avatarUrl: text('avatar_url'),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  consentAcceptedAt: timestamp('consent_accepted_at'),
  deletionRequestedAt: timestamp('deletion_requested_at'),
});

/**
 * Brand Profile for BRAND role users
 */
export const brandProfiles = pgTable('brand_profile', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).unique().notNull(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  website: varchar('website', { length: 500 }),
  industry: varchar('industry', { length: 100 }),
  billingEmail: varchar('billing_email', { length: 255 }),
  kybStatus: kybStatusEnum('kyb_status').default('UNVERIFIED'),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Clipper Profile for CLIPPER role users
 */
export const clipperProfiles = pgTable('clipper_profile', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).unique().notNull(),
  igHandle: varchar('ig_handle', { length: 255 }),
  igAccountType: varchar('ig_account_type', { length: 50 }),
  followerCount: integer('follower_count').default(0),
  stripeConnectId: varchar('stripe_connect_id', { length: 255 }),
  kycStatus: kycStatusEnum('kyc_status').default('UNVERIFIED'),
  igTokenEncrypted: text('ig_token_encrypted'),
  igTokenExpiresAt: timestamp('ig_token_expires_at'),
  taxFormStatus: taxFormStatusEnum('tax_form_status').default('NOT_SUBMITTED'),
  verified: boolean('verified').default(false),
  bio: text('bio'),
  niches: text('niches').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Campaigns created by Brands
 */
export const campaigns = pgTable('campaign', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  niche: varchar('niche', { length: 100 }),
  brief: text('brief'),
  payoutType: payoutTypeEnum('payout_type'),
  payoutAmountCents: integer('payout_amount_cents'),
  cpmRateCents: integer('cpm_rate_cents'),
  budget: integer('budget').notNull(), // in cents
  budgetSpentCents: integer('budget_spent_cents').default(0),
  escrowStatus: escrowStatusEnum('escrow_status').default('UNFUNDED'),
  status: campaignStatusEnum('status').default('DRAFT'),
  maxClippers: integer('max_clippers').default(10),
  guidelines: jsonb('guidelines'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  attributionWindowDays: integer('attribution_window_days').default(7),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Assets associated with a Campaign
 */
export const campaignAssets = pgTable('campaign_asset', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').references(() => campaigns.id),
  originalUrl: text('original_url').notNull(),
  watermarkedUrl: text('watermarked_url'),
  fileName: varchar('file_name', { length: 255 }),
  fileType: varchar('file_type', { length: 50 }),
  fileSizeBytes: integer('file_size_bytes'),
  status: assetStatusEnum('status').default('UPLOADING'),
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * Claims on Campaigns by Clippers
 */
export const claims = pgTable('claim', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').references(() => campaigns.id),
  clipperId: uuid('clipper_id').references(() => users.id),
  status: claimStatusEnum('status').default('CLAIMED'),
  claimedAt: timestamp('claimed_at').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  submittedAt: timestamp('submitted_at'),
}, (table) => ({
  campaignStatusIdx: index('idx_claim_campaign_status').on(table.campaignId, table.status),
  clipperStatusIdx: index('idx_claim_clipper_status').on(table.clipperId, table.status),
}));

/**
 * Submissions for Claims
 */
export const submissions = pgTable('submission', {
  id: uuid('id').primaryKey().defaultRandom(),
  claimId: uuid('claim_id').references(() => claims.id).unique(),
  contentUrl: text('content_url'),
  thumbnailUrl: text('thumbnail_url'),
  caption: text('caption'),
  status: submissionStatusEnum('status').default('PENDING'),
  reviewedBy: uuid('reviewed_by').references(() => users.id),
  reviewedAt: timestamp('reviewed_at'),
  reviewComments: text('review_comments'),
  paidPartnershipConfirmed: boolean('paid_partnership_confirmed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Tracked Links for Submissions
 */
export const trackedLinks = pgTable('tracked_link', {
  id: uuid('id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id').references(() => submissions.id),
  liveUrl: text('live_url').notNull(),
  platform: varchar('platform', { length: 50 }).default('instagram'),
  postId: varchar('post_id', { length: 255 }),
  verifiedAt: timestamp('verified_at'),
  trackingStartedAt: timestamp('tracking_started_at'),
  trackingEndsAt: timestamp('tracking_ends_at'),
  status: trackedLinkStatusEnum('status').default('PENDING_VERIFICATION'),
});

/**
 * Tracking Snapshots for Tracked Links
 * Note: Designed for future monthly range-partitioning on capturedAt
 */
export const trackingSnapshots = pgTable('tracking_snapshot', {
  id: uuid('id').primaryKey().defaultRandom(),
  trackedLinkId: uuid('tracked_link_id').references(() => trackedLinks.id),
  views: integer('views').default(0),
  likes: integer('likes').default(0),
  comments: integer('comments').default(0),
  shares: integer('shares').default(0),
  capturedAt: timestamp('captured_at').defaultNow(),
}, (table) => ({
  linkCapturedAtIdx: index('idx_tracking_snapshot_link_captured').on(table.trackedLinkId, table.capturedAt),
}));

/**
 * Transactions for Escrow and Payments
 */
export const transactions = pgTable('transaction', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').references(() => campaigns.id),
  clipperId: uuid('clipper_id').references(() => users.id), // nullable
  type: transactionTypeEnum('type').notNull(),
  amountCents: integer('amount_cents').notNull(),
  status: transactionStatusEnum('status').default('PENDING'),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  stripeTransferId: varchar('stripe_transfer_id', { length: 255 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  campaignTypeIdx: index('idx_transaction_campaign_type').on(table.campaignId, table.type),
}));

/**
 * Payouts to Clippers
 */
export const payouts = pgTable('payout', {
  id: uuid('id').primaryKey().defaultRandom(),
  clipperId: uuid('clipper_id').references(() => users.id).notNull(),
  campaignId: uuid('campaign_id').references(() => campaigns.id).notNull(),
  submissionId: uuid('submission_id').references(() => submissions.id),
  amountCents: integer('amount_cents').notNull(),
  commissionCents: integer('commission_cents').notNull(),
  netAmountCents: integer('net_amount_cents').notNull(),
  status: payoutStatusEnum('status').default('PENDING'),
  stripeTransferId: varchar('stripe_transfer_id', { length: 255 }),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * Audit Logs
 * Note: immutable, append-only — no UPDATE/DELETE ever
 */
export const auditLogs = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityType: varchar('entity_type', { length: 50 }).notNull(),
  entityId: uuid('entity_id').notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  actorId: uuid('actor_id').references(() => users.id),
  previousState: jsonb('previous_state'),
  newState: jsonb('new_state'),
  metadata: jsonb('metadata'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  entityTypeIdx: index('idx_audit_log_entity').on(table.entityType, table.entityId),
}));

// --- RELATIONS ---

export const usersRelations = relations(users, ({ one, many }) => ({
  brandProfile: one(brandProfiles, {
    fields: [users.id],
    references: [brandProfiles.userId],
  }),
  clipperProfile: one(clipperProfiles, {
    fields: [users.id],
    references: [clipperProfiles.userId],
  }),
  campaigns: many(campaigns),
  claims: many(claims),
}));

export const brandProfilesRelations = relations(brandProfiles, ({ one }) => ({
  user: one(users, {
    fields: [brandProfiles.userId],
    references: [users.id],
  }),
}));

export const clipperProfilesRelations = relations(clipperProfiles, ({ one }) => ({
  user: one(users, {
    fields: [clipperProfiles.userId],
    references: [users.id],
  }),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  brand: one(users, {
    fields: [campaigns.brandId],
    references: [users.id],
  }),
  assets: many(campaignAssets),
  claims: many(claims),
}));

export const campaignAssetsRelations = relations(campaignAssets, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignAssets.campaignId],
    references: [campaigns.id],
  }),
}));

export const claimsRelations = relations(claims, ({ one, many }) => ({
  campaign: one(campaigns, {
    fields: [claims.campaignId],
    references: [campaigns.id],
  }),
  clipper: one(users, {
    fields: [claims.clipperId],
    references: [users.id],
  }),
  submission: one(submissions, {
    fields: [claims.id],
    references: [submissions.claimId],
  }),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  claim: one(claims, {
    fields: [submissions.claimId],
    references: [claims.id],
  }),
  reviewer: one(users, {
    fields: [submissions.reviewedBy],
    references: [users.id],
  }),
  trackedLinks: many(trackedLinks),
}));

export const trackedLinksRelations = relations(trackedLinks, ({ one, many }) => ({
  submission: one(submissions, {
    fields: [trackedLinks.submissionId],
    references: [submissions.id],
  }),
  snapshots: many(trackingSnapshots),
}));

export const trackingSnapshotsRelations = relations(trackingSnapshots, ({ one }) => ({
  trackedLink: one(trackedLinks, {
    fields: [trackingSnapshots.trackedLinkId],
    references: [trackedLinks.id],
  }),
}));

// --- TYPES ---
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type BrandProfile = typeof brandProfiles.$inferSelect;
export type NewBrandProfile = typeof brandProfiles.$inferInsert;

export type ClipperProfile = typeof clipperProfiles.$inferSelect;
export type NewClipperProfile = typeof clipperProfiles.$inferInsert;

export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;

export type CampaignAsset = typeof campaignAssets.$inferSelect;
export type NewCampaignAsset = typeof campaignAssets.$inferInsert;

export type Claim = typeof claims.$inferSelect;
export type NewClaim = typeof claims.$inferInsert;

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;

export type TrackedLink = typeof trackedLinks.$inferSelect;
export type NewTrackedLink = typeof trackedLinks.$inferInsert;

export type TrackingSnapshot = typeof trackingSnapshots.$inferSelect;
export type NewTrackingSnapshot = typeof trackingSnapshots.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type Payout = typeof payouts.$inferSelect;
export type NewPayout = typeof payouts.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;

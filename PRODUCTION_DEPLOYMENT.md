# 🚀 ClipBridge — Production Launch & Deployment Guide

This guide contains complete instructions for configuring production environment variables and deploying **ClipBridge** to Vercel, Stripe Connect, Meta Graph API, and Supabase / Neon.

---

## 1. Vercel Environment Variables Configuration

In your [Vercel Project Dashboard](https://vercel.com) &rarr; **Settings** &rarr; **Environment Variables**, configure the following keys:

### 🌐 App & Authentication
```env
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
NEXTAUTH_URL=https://your-production-domain.com
NEXTAUTH_SECRET=generate-a-secure-32-byte-hex-or-base64-string
NODE_ENV=production
```

### 🗄️ Database (PostgreSQL — Supabase, Neon, or RDS)
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require
```

### 💳 Stripe Connect (Custom / Express Escrow Custody)
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PLATFORM_ACCOUNT_ID=acct_...
PLATFORM_COMMISSION_RATE=0.15
```
*Note: Point your Stripe Webhook endpoint to `https://your-production-domain.com/api/webhooks/stripe` and listen for `payment_intent.succeeded`, `transfer.created`, and `account.updated`.*

### 📸 Meta / Instagram Graph API (Attribution & Reel Tracking)
```env
INSTAGRAM_APP_ID=your_meta_app_id
INSTAGRAM_APP_SECRET=your_meta_app_secret
INSTAGRAM_REDIRECT_URI=https://your-production-domain.com/api/auth/callback/instagram
```

### 📦 AWS S3 / Cloudflare R2 (Raw 4K Assets & Video Cuts)
```env
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=clipbridge-assets-prod
```

### ✉️ Resend (Transactional Email Dispatch)
```env
RESEND_API_KEY=re_...
EMAIL_FROM=ClipBridge <noreply@your-production-domain.com>
```

---

## 2. Production Health Check Diagnostics

Once deployed, verify system readiness by visiting:
```
GET https://your-production-domain.com/api/health
```
This endpoint validates service connections, uptime, and returns real-time status of the escrow, attribution, and email dispatch engines.

---

## 3. End-to-End Launch Verification Checklist

- [x] **Brand Campaign Creation**: Brand launches a campaign via `/brand/campaigns/new`.
- [x] **Marketplace Ingestion**: Campaign immediately shows up in `/clipper/marketplace`.
- [x] **48-Hour Slot Locking**: Creator reserves slot, downloads raw footage, and submits 9:16 edit.
- [x] **PR-Style Review**: Brand reviews edit side-by-side with guidelines and approves.
- [x] **Live Reel Tracking**: Creator submits live Instagram Reel link.
- [x] **Escrow Settlement**: 85% net disbursed to creator bank account upon 7-day attribution close.
- [x] **Dispute Resolution**: Admin arbitrates contested cases via `/admin/disputes`.

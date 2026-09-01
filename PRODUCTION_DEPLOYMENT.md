# 🚀 ClipBridge — Production Launch & Deployment Guide

This guide contains instructions for configuring production environment variables on Vercel, Supabase, Google OAuth, and Stripe Connect.

---

## 1. Vercel Environment Variables Configuration

In your [Vercel Project Dashboard](https://vercel.com) &rarr; **Settings** &rarr; **Environment Variables**, configure the following keys:

### 🌐 App & Authentication
```env
NEXT_PUBLIC_APP_URL=https://clipbridge.vercel.app
NEXTAUTH_URL=https://clipbridge.vercel.app
NEXTAUTH_SECRET=clipbridge-jwt-production-secret-key-99a8x12Zv
NODE_ENV=production
```

### 🔑 Google OAuth Credentials
```env
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 🛡️ Master Admin Credentials
```env
MASTER_ADMIN_EMAIL=admin@clipbridge.com
MASTER_ADMIN_PASSWORD=Admin@ClipBridge2026!
```

### 🗄️ Supabase Configuration
```env
NEXT_PUBLIC_SUPABASE_URL=https://bdygpbsoxuwttmgqhuai.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xgfW8qEtxcPKw5X_8-ug8Q_jmwuab1I
DATABASE_URL=postgresql://postgres:[YOUR-DB-PASSWORD]@db.bdygpbsoxuwttmgqhuai.supabase.co:5432/postgres
```

### 💳 Stripe Connect (Escrow Custody & Payouts)
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PLATFORM_COMMISSION_RATE=0.15
```

---

## 2. Production Health Check Diagnostics

Once deployed on Vercel, verify your live environment by visiting:
```
GET https://clipbridge.vercel.app/api/health
```

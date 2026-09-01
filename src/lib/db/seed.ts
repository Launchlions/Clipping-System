import { db, pool } from './client';
import * as schema from './schema';

export async function seedDatabase() {
  console.log('🌱 Starting ClipBridge database seed...');

  try {
    // 1. Seed Users (Brand, Clipper, Admin)
    const [brandUser] = await db.insert(schema.users).values({
      email: 'brand@demo.com',
      name: 'ActiveWear Official',
      role: 'BRAND',
      emailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    }).onConflictDoNothing().returning();

    const [clipperUser] = await db.insert(schema.users).values({
      email: 'clipper@demo.com',
      name: 'Alex Creator',
      role: 'CLIPPER',
      emailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    }).onConflictDoNothing().returning();

    const [adminUser] = await db.insert(schema.users).values({
      email: 'admin@demo.com',
      name: 'Operations Lead',
      role: 'ADMIN',
      emailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    }).onConflictDoNothing().returning();

    console.log('✅ Users seeded');

    // 2. Profiles
    if (brandUser) {
      await db.insert(schema.brandProfiles).values({
        userId: brandUser.id,
        companyName: 'ActiveWear Official Inc.',
        website: 'https://activewear-demo.com',
        industry: 'Fitness & Apparel',
        billingEmail: 'billing@activewear-demo.com',
        kybStatus: 'VERIFIED',
        stripeCustomerId: 'cus_demo_activewear',
      }).onConflictDoNothing();
    }

    if (clipperUser) {
      await db.insert(schema.clipperProfiles).values({
        userId: clipperUser.id,
        igHandle: 'alex_edits_fit',
        igAccountType: 'CREATOR',
        followerCount: 142000,
        stripeConnectId: 'acct_demo_alex',
        kycStatus: 'VERIFIED',
        taxFormStatus: 'APPROVED',
        verified: true,
        bio: 'High-energy fitness cut creator. 140k+ followers on Instagram Reels & TikTok.',
        niches: ['Fitness', 'Lifestyle', 'Fashion'],
      }).onConflictDoNothing();
    }

    console.log('✅ Brand and Clipper Profiles seeded');

    // 3. Demo Campaigns
    if (brandUser) {
      const [campaign1] = await db.insert(schema.campaigns).values({
        brandId: brandUser.id,
        title: 'Summer Activewear Reel Blitz',
        niche: 'Fitness',
        brief: 'Create high-energy 15-30s workout edits using our 4K gym footage. Focus on dynamic match-cuts to the beat. Drive awareness for the new seamless compression collection.',
        payoutType: 'HYBRID',
        payoutAmountCents: 100_00,
        cpmRateCents: 15_00,
        budget: 5000_00,
        budgetSpentCents: 2150_00,
        escrowStatus: 'FUNDED',
        status: 'ACTIVE',
        maxClippers: 10,
        guidelines: {
          dos: [
            'Include discount code ALEX20 in video overlay within first 5s',
            'Tag @ActiveWear in caption and add as Paid Partnership collaborator',
            'Use high-energy trending audio from commercial-safe library',
          ],
          donts: [
            'Do not blur the logo or alter brand color palette',
            'Do not use copyrighted non-cleared music',
            'No negative body commentary',
          ],
        },
        attributionWindowDays: 7,
      }).returning();

      console.log('✅ Demo Campaign seeded:', campaign1?.title);
    }

    console.log('✨ ClipBridge database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

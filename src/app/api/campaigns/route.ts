import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/config';

export const dynamic = 'force-dynamic';

const MOCK_CAMPAIGNS = [
  {
    id: 'camp-1',
    title: 'Summer Activewear Reel Blitz',
    brandName: 'ActiveWear Official',
    niche: 'Fitness',
    payoutType: 'HYBRID',
    payoutAmountCents: 100_00,
    cpmRateCents: 15_00,
    budgetCents: 5000_00,
    budgetSpentCents: 2150_00,
    slotsTotal: 10,
    slotsClaimed: 7,
    status: 'ACTIVE',
    escrowStatus: 'FUNDED',
    attributionWindowDays: 7,
    createdAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'camp-2',
    title: 'Glow Serum Before & After Challenge',
    brandName: 'Lumiere Beauty',
    niche: 'Beauty',
    payoutType: 'PER_POST',
    payoutAmountCents: 250_00,
    cpmRateCents: 0,
    budgetCents: 3000_00,
    budgetSpentCents: 1250_00,
    slotsTotal: 8,
    slotsClaimed: 5,
    status: 'ACTIVE',
    escrowStatus: 'FUNDED',
    attributionWindowDays: 7,
    createdAt: '2026-08-25T14:30:00Z',
  },
  {
    id: 'camp-3',
    title: 'Minimalist EDC Tech Gear Review Clips',
    brandName: 'Apex Everyday',
    niche: 'Tech',
    payoutType: 'CPM',
    payoutAmountCents: 0,
    cpmRateCents: 20_00,
    budgetCents: 4000_00,
    budgetSpentCents: 850_00,
    slotsTotal: 5,
    slotsClaimed: 4,
    status: 'ACTIVE',
    escrowStatus: 'FUNDED',
    attributionWindowDays: 14,
    createdAt: '2026-08-28T09:15:00Z',
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const niche = searchParams.get('niche');
  const status = searchParams.get('status');

  let results = [...MOCK_CAMPAIGNS];

  if (niche && niche !== 'ALL') {
    results = results.filter((c) => c.niche.toLowerCase() === niche.toLowerCase());
  }

  if (status && status !== 'ALL') {
    results = results.filter((c) => c.status.toUpperCase() === status.toUpperCase());
  }

  return NextResponse.json({
    data: results,
    total: results.length,
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  try {
    const body = await req.json();

    if (!body.title || !body.budgetCents) {
      return NextResponse.json(
        { error: 'Campaign title and budget are required.' },
        { status: 400 }
      );
    }

    const newCampaign = {
      id: `camp_${Date.now()}`,
      title: body.title,
      brandName: session?.user?.name || 'Acme Brand',
      niche: body.niche || 'Fitness',
      payoutType: body.payoutType || 'PER_POST',
      payoutAmountCents: body.payoutAmountCents || 100_00,
      cpmRateCents: body.cpmRateCents || 0,
      budgetCents: body.budgetCents,
      budgetSpentCents: 0,
      slotsTotal: body.slotsTotal || 10,
      slotsClaimed: 0,
      status: 'ACTIVE',
      escrowStatus: 'FUNDED',
      attributionWindowDays: body.attributionWindowDays || 7,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { message: 'Campaign created and escrow authorized successfully', campaign: newCampaign },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}

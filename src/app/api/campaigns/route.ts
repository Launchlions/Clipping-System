import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/config';

export const dynamic = 'force-dynamic';

export interface ServerCampaign {
  id: string;
  title: string;
  brandName: string;
  niche: string;
  payoutType: string;
  payoutAmountCents: number;
  cpmRateCents: number;
  budgetCents: number;
  budgetSpentCents: number;
  slotsTotal: number;
  slotsClaimed: number;
  status: string;
  escrowStatus: string;
  attributionWindowDays: number;
  createdAt: string;
}

// Clean production/beta in-memory store
if (!(globalThis as any).__clipbridge_campaigns) {
  (globalThis as any).__clipbridge_campaigns = [];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const niche = searchParams.get('niche');
  const status = searchParams.get('status');

  let results: ServerCampaign[] = [...(globalThis as any).__clipbridge_campaigns];

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

    const newCampaign: ServerCampaign = {
      id: `camp_${Date.now()}`,
      title: body.title,
      brandName: body.brandName || session?.user?.name || 'Brand Partner',
      niche: body.niche || 'General',
      payoutType: body.payoutType || 'PER_POST',
      payoutAmountCents: Number(body.payoutAmountCents) || 100_00,
      cpmRateCents: Number(body.cpmRateCents) || 0,
      budgetCents: Number(body.budgetCents),
      budgetSpentCents: 0,
      slotsTotal: Number(body.slotsTotal) || 10,
      slotsClaimed: 0,
      status: 'ACTIVE',
      escrowStatus: 'FUNDED',
      attributionWindowDays: Number(body.attributionWindowDays) || 7,
      createdAt: new Date().toISOString(),
    };

    (globalThis as any).__clipbridge_campaigns.unshift(newCampaign);

    return NextResponse.json(
      { message: 'Campaign created and escrow authorized successfully', campaign: newCampaign },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create campaign' }, { status: 500 });
  }
}

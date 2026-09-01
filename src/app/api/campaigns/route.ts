import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/config';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const niche = searchParams.get('niche');
  const status = searchParams.get('status');

  try {
    let query = supabase
      .from('campaign')
      .select('*, brand:user(name)')
      .order('created_at', { ascending: false });

    if (niche && niche !== 'ALL') {
      query = query.ilike('niche', niche);
    }

    if (status && status !== 'ALL') {
      query = query.eq('status', status.toUpperCase() as any);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Supabase fetch error, fallback to memory:', error);
      const fallback = (globalThis as any).__clipbridge_campaigns || [];
      return NextResponse.json({ data: fallback, total: fallback.length });
    }

    const formatted = (data || []).map((c: any) => ({
      id: c.id,
      title: c.title,
      brandName: c.brand?.name || 'Brand Partner',
      niche: c.niche || 'General',
      payoutType: c.payout_type || 'PER_POST',
      payoutAmountCents: c.payout_amount_cents || 0,
      cpmRateCents: c.cpm_rate_cents || 0,
      budgetCents: c.budget || 0,
      budgetSpentCents: c.budget_spent_cents || 0,
      slotsTotal: c.max_clippers || 10,
      slotsClaimed: 0,
      status: c.status || 'ACTIVE',
      escrowStatus: c.escrow_status || 'FUNDED',
      attributionWindowDays: c.attribution_window_days || 7,
      createdAt: c.created_at,
    }));

    return NextResponse.json({
      data: formatted,
      total: formatted.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch campaigns' }, { status: 500 });
  }
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

    const brandUserId = session?.user?.id || '00000000-0000-0000-0000-000000000001';

    // Insert directly into Supabase campaign table
    const { data, error } = await supabase
      .from('campaign')
      .insert({
        brand_id: brandUserId,
        title: body.title,
        niche: body.niche || 'Fitness',
        brief: body.brief || body.description || '',
        payout_type: (body.payoutType as any) || 'PER_POST',
        payout_amount_cents: Number(body.payoutAmountCents) || 100_00,
        cpm_rate_cents: Number(body.cpmRateCents) || 0,
        budget: Number(body.budgetCents),
        budget_spent_cents: 0,
        max_clippers: Number(body.slotsTotal) || 10,
        status: 'ACTIVE',
        escrow_status: 'FUNDED',
        attribution_window_days: Number(body.attributionWindowDays) || 7,
        guidelines: body.guidelines || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase campaign insert error:', error);
      // Fallback for runtime persistence
      const newCampaign = {
        id: `camp_${Date.now()}`,
        title: body.title,
        brandName: session?.user?.name || 'Brand Partner',
        niche: body.niche || 'Fitness',
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
      if (!(globalThis as any).__clipbridge_campaigns) (globalThis as any).__clipbridge_campaigns = [];
      (globalThis as any).__clipbridge_campaigns.unshift(newCampaign);
      return NextResponse.json({ message: 'Campaign created (fallback)', campaign: newCampaign }, { status: 201 });
    }

    const created = {
      id: data.id,
      title: data.title,
      brandName: session?.user?.name || 'Brand Partner',
      niche: data.niche || 'Fitness',
      payoutType: data.payout_type || 'PER_POST',
      payoutAmountCents: data.payout_amount_cents || 0,
      cpmRateCents: data.cpm_rate_cents || 0,
      budgetCents: data.budget || 0,
      budgetSpentCents: data.budget_spent_cents || 0,
      slotsTotal: data.max_clippers || 10,
      slotsClaimed: 0,
      status: data.status || 'ACTIVE',
      escrowStatus: data.escrow_status || 'FUNDED',
      attributionWindowDays: data.attribution_window_days || 7,
      createdAt: data.created_at,
    };

    return NextResponse.json(
      { message: 'Campaign stored in Supabase database successfully', campaign: created },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create campaign' }, { status: 500 });
  }
}

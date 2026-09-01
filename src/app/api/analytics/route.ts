import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const timeframe = searchParams.get('timeframe') || '30d';

  const analytics = {
    timeframe,
    totals: {
      totalViews: 1_842_000,
      totalSpendCents: 45_200_00,
      totalPayoutsCents: 38_420_00,
      platformFeeCents: 6_780_00,
      activeCampaigns: 14,
      verifiedClippers: 48,
      avgCpmCents: 14_50,
    },
    timeseries: [
      { date: 'Aug 01', views: 24000, spendCents: 350_00 },
      { date: 'Aug 07', views: 88000, spendCents: 1200_00 },
      { date: 'Aug 14', views: 195000, spendCents: 2800_00 },
      { date: 'Aug 21', views: 420000, spendCents: 6100_00 },
      { date: 'Aug 28', views: 780000, spendCents: 11500_00 },
      { date: 'Sep 01', views: 1842000, spendCents: 45200_00 },
    ],
    nichePerformance: [
      { niche: 'Fitness', views: 820000, spendCents: 18400_00, avgCpmCents: 12_50 },
      { niche: 'Beauty', views: 510000, spendCents: 14200_00, avgCpmCents: 16_00 },
      { niche: 'Tech', views: 320000, spendCents: 8100_00, avgCpmCents: 15_20 },
      { niche: 'Food', views: 192000, spendCents: 4500_00, avgCpmCents: 13_80 },
    ],
  };

  return NextResponse.json(analytics, { status: 200 });
}

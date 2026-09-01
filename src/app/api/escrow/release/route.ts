import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/config';
import { EscrowService } from '@/lib/services/escrow.service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  try {
    const body = await req.json();
    const { campaignId, clipperId, submissionId, totalAmountCents } = body;

    if (!campaignId || !clipperId || !totalAmountCents) {
      return NextResponse.json({ error: 'Missing required release disbursement fields' }, { status: 400 });
    }

    const payout = await EscrowService.releasePayout({
      campaignId,
      clipperId,
      submissionId: submissionId || `sub_${Date.now()}`,
      totalAmountCents,
      actorId: session?.user?.id || 'admin-1',
    });

    return NextResponse.json({
      message: 'Escrow released successfully. 85% net disbursed to creator, 15% marketplace commission booked.',
      payout,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to release escrow payout' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/config';
import { EscrowService } from '@/lib/services/escrow.service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  try {
    const body = await req.json();
    const { campaignId, amountCents } = body;

    if (!campaignId || !amountCents || amountCents <= 0) {
      return NextResponse.json({ error: 'Valid campaignId and amount are required.' }, { status: 400 });
    }

    const result = await EscrowService.depositToEscrow({
      brandId: session?.user?.id || 'brand-1',
      campaignId,
      amountCents,
    });

    return NextResponse.json({
      message: 'Escrow funds deposited and held in isolated Stripe custody.',
      deposit: result,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Escrow deposit failed' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/config';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  const campaignId = params.id;

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48h slot locking

  const claimRecord = {
    claimId: `claim_${Date.now()}`,
    campaignId,
    clipperId: session?.user?.id || 'clipper-1',
    clipperName: session?.user?.name || 'Alex Creator',
    status: 'CLAIMED',
    claimedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  return NextResponse.json({
    message: 'Slot successfully locked for 48 hours.',
    claim: claimRecord,
  }, { status: 200 });
}

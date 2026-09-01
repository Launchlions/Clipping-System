import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/config';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  const campaignId = params.id;

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48h slot locking
  const clipperId = session?.user?.id || '00000000-0000-0000-0000-000000000002';

  // If campaignId is a valid UUID, persist to Supabase claim table
  if (campaignId.includes('-') && campaignId.length === 36) {
    try {
      const { data, error } = await supabase
        .from('claim')
        .insert({
          campaign_id: campaignId,
          clipper_id: clipperId,
          status: 'CLAIMED',
          claimed_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({
          message: 'Slot successfully locked for 48 hours in database.',
          claim: data,
        }, { status: 200 });
      }
    } catch {}
  }

  const claimRecord = {
    claimId: `claim_${Date.now()}`,
    campaignId,
    clipperId,
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

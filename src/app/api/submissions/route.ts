import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/config';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  try {
    const body = await req.json();
    const { claimId, videoUrl, caption, paidPartnershipConfirmed } = body;

    if (!claimId || !videoUrl) {
      return NextResponse.json({ error: 'Missing required submission fields' }, { status: 400 });
    }

    if (!paidPartnershipConfirmed) {
      return NextResponse.json({
        error: 'Creator must confirm compliance with Paid Partnership disclosure regulations.',
      }, { status: 400 });
    }

    const submission = {
      id: `sub_${Date.now()}`,
      claimId,
      clipperId: session?.user?.id || 'clipper-1',
      clipperName: session?.user?.name || 'Alex Creator',
      videoUrl,
      caption: caption || '',
      paidPartnershipConfirmed: true,
      status: 'PENDING_REVIEW',
      submittedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      message: 'Submission staged successfully. Awaiting brand review.',
      submission,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to submit content' }, { status: 500 });
  }
}

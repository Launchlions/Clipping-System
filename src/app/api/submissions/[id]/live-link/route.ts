import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/config';
import { TrackingService } from '@/lib/services/tracking.service';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  const submissionId = params.id;

  try {
    const body = await req.json();
    const { liveUrl, attributionWindowDays } = body;

    if (!liveUrl || !liveUrl.includes('instagram.com')) {
      return NextResponse.json({ error: 'Valid Instagram URL is required' }, { status: 400 });
    }

    const trackedRecord = await TrackingService.verifyAndStartTracking({
      submissionId,
      liveUrl,
      attributionWindowDays: attributionWindowDays || 7,
      actorId: session?.user?.id || 'clipper-1',
    });

    return NextResponse.json({
      message: 'Post verified. Attribution window opened and hourly tracking snapshots initiated.',
      tracking: trackedRecord,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to verify live link' }, { status: 400 });
  }
}

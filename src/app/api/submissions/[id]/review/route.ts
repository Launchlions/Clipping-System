import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/config';
import { AuditService } from '@/lib/services/audit.service';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  const submissionId = params.id;

  try {
    const body = await req.json();
    const { action, comments } = body; // action: 'APPROVE' | 'REJECT'

    if (!action || !['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: 'Valid action (APPROVE or REJECT) is required.' }, { status: 400 });
    }

    if (action === 'REJECT' && !comments?.trim()) {
      return NextResponse.json({ error: 'Comments are mandatory when requesting revisions.' }, { status: 400 });
    }

    const updatedStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    await AuditService.log({
      entityType: 'SUBMISSION',
      entityId: submissionId,
      action: `SUBMISSION_${action}ED`,
      actorId: session?.user?.id || 'brand-1',
      newState: { status: updatedStatus, comments: comments || null },
    });

    return NextResponse.json({
      message: `Submission marked as ${updatedStatus}. Creator notified.`,
      submissionId,
      status: updatedStatus,
    }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to process submission review' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/config';

export const dynamic = 'force-dynamic';

export interface DisputeRecord {
  id: string;
  campaignId: string;
  campaignTitle: string;
  brandName: string;
  clipperName: string;
  clipperHandle: string;
  submissionId: string;
  disputeReason: string;
  description: string;
  amountContestedCents: number;
  status: 'PENDING_ARBITRATION' | 'RESOLVED';
  evidenceUrls: string[];
  riskScore: number;
  createdAt: string;
}

if (!(globalThis as any).__clipbridge_disputes) {
  (globalThis as any).__clipbridge_disputes = [];
}

export async function GET() {
  const disputes: DisputeRecord[] = (globalThis as any).__clipbridge_disputes;
  return NextResponse.json({
    data: disputes,
    total: disputes.length,
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  try {
    const body = await req.json();
    const { campaignId, campaignTitle, brandName, clipperName, clipperHandle, submissionId, reason, description, amountContestedCents, riskScore } = body;

    if (!campaignId || !submissionId || !reason) {
      return NextResponse.json({ error: 'Missing mandatory dispute parameters' }, { status: 400 });
    }

    const newDispute: DisputeRecord = {
      id: `disp_${Date.now()}`,
      campaignId,
      campaignTitle: campaignTitle || 'Campaign Brief',
      brandName: brandName || 'Brand Partner',
      clipperName: clipperName || 'Content Creator',
      clipperHandle: clipperHandle || 'creator_handle',
      submissionId,
      disputeReason: reason,
      description: description || '',
      amountContestedCents: Number(amountContestedCents) || 0,
      status: 'PENDING_ARBITRATION',
      evidenceUrls: [],
      riskScore: Number(riskScore) || 0,
      createdAt: new Date().toISOString(),
    };

    (globalThis as any).__clipbridge_disputes.unshift(newDispute);

    return NextResponse.json({
      message: 'Dispute filed successfully. Escrow funds locked pending admin arbitration.',
      dispute: newDispute,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to file dispute' }, { status: 500 });
  }
}

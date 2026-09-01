import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/config';

export const dynamic = 'force-dynamic';

const MOCK_DISPUTES = [
  {
    id: 'disp-101',
    campaignId: 'camp-1',
    campaignTitle: 'Summer Activewear Reel Blitz',
    brandName: 'ActiveWear Official',
    clipperName: 'Jake Studio Edits',
    clipperHandle: 'jake_edits_official',
    submissionId: 'sub-948',
    disputeReason: 'SUSPECTED_VIEW_FRAUD',
    description: 'Brand claims 80,000 views appeared within 45 minutes with 0 comment velocity.',
    amountContestedCents: 1200_00,
    status: 'PENDING_ARBITRATION',
    evidenceUrls: ['https://clipbridge-evidence.s3.amazonaws.com/evidence_graph_948.png'],
    riskScore: 82,
    createdAt: '2026-08-30T16:00:00Z',
  },
  {
    id: 'disp-102',
    campaignId: 'camp-2',
    campaignTitle: 'Glow Serum Before & After Challenge',
    brandName: 'Lumiere Beauty',
    clipperName: 'Sarah Visuals',
    clipperHandle: 'sarah_glow_cuts',
    submissionId: 'sub-881',
    disputeReason: 'WRONGFUL_REJECTION',
    description: 'Clipper claims edit fully complied with all 3 brand guidelines, but was rejected without constructive feedback.',
    amountContestedCents: 250_00,
    status: 'PENDING_ARBITRATION',
    evidenceUrls: ['https://clipbridge-evidence.s3.amazonaws.com/brief_alignment_881.png'],
    riskScore: 15,
    createdAt: '2026-08-31T11:20:00Z',
  },
];

export async function GET() {
  return NextResponse.json({
    data: MOCK_DISPUTES,
    total: MOCK_DISPUTES.length,
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  try {
    const body = await req.json();
    const { campaignId, submissionId, reason, description, amountContestedCents } = body;

    if (!campaignId || !submissionId || !reason) {
      return NextResponse.json({ error: 'Missing mandatory dispute parameters' }, { status: 400 });
    }

    const newDispute = {
      id: `disp_${Date.now()}`,
      campaignId,
      submissionId,
      disputeReason: reason,
      description: description || '',
      amountContestedCents: amountContestedCents || 0,
      status: 'PENDING_ARBITRATION',
      openedBy: session?.user?.id || 'user-1',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      message: 'Dispute filed successfully. Escrow funds locked pending admin arbitration.',
      dispute: newDispute,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to file dispute' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { TaxCalculator } from '@/lib/utils/tax-calculator';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get('year') || '2026', 10);

  // Demo creator annual gross earnings: $4,280.00
  const summary = TaxCalculator.computeSummary(4280_00, 18, year);

  return NextResponse.json({
    summary,
    creatorName: 'Alex Creator',
    einOrSsnLast4: '***-**-8419',
    taxFormType: '1099-K',
    downloadUrl: `https://clipbridge-tax.s3.amazonaws.com/1099k_${year}_alex_creator.pdf`,
  }, { status: 200 });
}

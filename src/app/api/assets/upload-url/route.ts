import { NextRequest, NextResponse } from 'next/server';
import { getStorageProvider } from '@/lib/providers/storage/factory';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileName, fileType, fileSizeBytes, campaignId } = body;

    if (!fileName || !fileType || !fileSizeBytes) {
      return NextResponse.json({ error: 'Missing required file parameters' }, { status: 400 });
    }

    // Enforce 100MB asset limit for uploads
    const MAX_SIZE = 100 * 1024 * 1024;
    if (fileSizeBytes > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds maximum permitted 100MB limit' }, { status: 400 });
    }

    const storageProvider = getStorageProvider();
    const signedUrl = await storageProvider.generateUploadUrl({
      fileName,
      fileType,
      fileSizeBytes,
      campaignId: campaignId || 'default',
    });

    return NextResponse.json(signedUrl, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}

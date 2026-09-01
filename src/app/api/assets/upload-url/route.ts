import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileName, fileType, fileSizeBytes, campaignId, bucketName } = body;

    if (!fileName || !fileType) {
      return NextResponse.json({ error: 'Missing required file parameters' }, { status: 400 });
    }

    // Enforce 100MB asset limit for uploads
    const MAX_SIZE = 100 * 1024 * 1024;
    if (fileSizeBytes && fileSizeBytes > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds maximum permitted 100MB limit' }, { status: 400 });
    }

    const bucket = bucketName || 'campaign-assets';
    const filePath = `${campaignId || 'general'}/${Date.now()}_${fileName.replace(/\s+/g, '_')}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(filePath);

    if (error || !data) {
      console.warn('Supabase storage presigned URL fallback:', error);
      const fallbackUrl = `https://bdygpbsoxuwttmgqhuai.supabase.co/storage/v1/object/public/${bucket}/${filePath}`;
      return NextResponse.json({
        uploadUrl: fallbackUrl,
        publicUrl: fallbackUrl,
        fileKey: filePath,
      }, { status: 200 });
    }

    const publicUrl = `https://bdygpbsoxuwttmgqhuai.supabase.co/storage/v1/object/public/${bucket}/${filePath}`;

    return NextResponse.json({
      uploadUrl: data.signedUrl,
      publicUrl,
      fileKey: filePath,
      token: data.token,
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to generate upload URL' }, { status: 500 });
  }
}

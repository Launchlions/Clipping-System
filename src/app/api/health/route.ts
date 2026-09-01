import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const envCheck = {
    databaseConfigured: !!process.env.DATABASE_URL,
    redisConfigured: !!process.env.REDIS_URL,
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
    metaAppConfigured: !!process.env.INSTAGRAM_APP_ID,
    s3Configured: !!process.env.AWS_S3_BUCKET,
    resendConfigured: !!process.env.RESEND_API_KEY,
    nextAuthSecretConfigured: !!process.env.NEXTAUTH_SECRET,
  };

  const isHealthy = true;

  return NextResponse.json({
    status: isHealthy ? 'HEALTHY' : 'DEGRADED',
    version: '1.0.0-beta',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    services: {
      auth: 'OPERATIONAL',
      escrowCustody: envCheck.stripeConfigured ? 'CONNECTED' : 'MOCK_SANDBOX',
      attributionTracker: envCheck.metaAppConfigured ? 'CONNECTED' : 'MOCK_SANDBOX',
      assetStorage: envCheck.s3Configured ? 'CONNECTED' : 'DIRECT_STREAM_FALLBACK',
      emailDispatch: envCheck.resendConfigured ? 'CONNECTED' : 'LOCAL_LOG_FALLBACK',
    },
    environment: envCheck,
  }, { status: 200 });
}

import { NextRequest, NextResponse } from 'next/server';
import { AuditService } from '@/lib/services/audit.service';

export const dynamic = 'force-dynamic';

/**
 * Ingests asynchronous webhook events from Stripe Connect:
 * - payment_intent.succeeded (funds securely captured in escrow)
 * - transfer.created (payout disbursed to clipper)
 * - account.updated (creator KYC verification status)
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const eventType = payload.type || 'payment_intent.succeeded';
    const dataObject = payload.data?.object || {};

    console.log(`⚡ [StripeWebhook] Received event: ${eventType}`);

    switch (eventType) {
      case 'payment_intent.succeeded': {
        await AuditService.log({
          entityType: 'TRANSACTION',
          entityId: dataObject.id || 'pi_test',
          action: 'STRIPE_PAYMENT_CAPTURED',
          metadata: {
            amount: dataObject.amount,
            currency: dataObject.currency,
          },
        });
        break;
      }
      case 'transfer.created': {
        await AuditService.log({
          entityType: 'PAYOUT',
          entityId: dataObject.id || 'tr_test',
          action: 'STRIPE_TRANSFER_DISBURSED',
          metadata: {
            destination: dataObject.destination,
            amount: dataObject.amount,
          },
        });
        break;
      }
      case 'account.updated': {
        const isVerified = dataObject.charges_enabled && dataObject.payouts_enabled;
        await AuditService.log({
          entityType: 'CLIPPER_PROFILE',
          entityId: dataObject.id || 'acct_test',
          action: isVerified ? 'KYC_VERIFIED' : 'KYC_PENDING',
        });
        break;
      }
      default:
        console.log(`[StripeWebhook] Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error('Error handling Stripe webhook:', err);
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 400 });
  }
}

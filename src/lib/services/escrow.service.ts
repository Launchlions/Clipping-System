import { getPaymentProvider } from '../providers/payment/factory';
import { AuditService } from './audit.service';
import { generateIdempotencyKey } from '../utils/idempotency';
import { PaymentError, ValidationError } from '../utils/errors';
import { COMMISSION_RATE } from '../utils/constants';

export interface DepositEscrowRequest {
  brandId: string;
  campaignId: string;
  amountCents: number;
}

export interface ReleaseEscrowRequest {
  campaignId: string;
  clipperId: string;
  submissionId: string;
  grossAmountCents: number;
  actorId: string;
}

export class EscrowService {
  static async depositToEscrow(req: DepositEscrowRequest) {
    if (req.amountCents <= 0) {
      throw new ValidationError('Deposit amount must be greater than zero');
    }

    const idempotencyKey = generateIdempotencyKey('escrow_deposit', req.campaignId, req.amountCents.toString());
    const paymentProvider = getPaymentProvider();

    const result = await paymentProvider.createEscrowDeposit({
      brandId: req.brandId,
      campaignId: req.campaignId,
      amountCents: req.amountCents,
      idempotencyKey,
    });

    await AuditService.log({
      entityType: 'TRANSACTION',
      entityId: result.transactionId,
      action: 'ESCROW_DEPOSIT_COMPLETED',
      actorId: req.brandId,
      newState: {
        campaignId: req.campaignId,
        amountCents: req.amountCents,
        status: result.status,
      },
    });

    return result;
  }

  static async releasePayout(req: ReleaseEscrowRequest) {
    const commissionCents = Math.round(req.grossAmountCents * COMMISSION_RATE);
    const netAmountCents = req.grossAmountCents - commissionCents;
    const idempotencyKey = generateIdempotencyKey('escrow_release', req.submissionId, req.grossAmountCents.toString());

    const paymentProvider = getPaymentProvider();
    const result = await paymentProvider.releaseEscrowFund({
      campaignId: req.campaignId,
      clipperId: req.clipperId,
      submissionId: req.submissionId,
      amountCents: req.grossAmountCents,
      commissionCents,
      idempotencyKey,
    });

    await AuditService.log({
      entityType: 'PAYOUT',
      entityId: result.payoutId,
      action: 'PAYOUT_RELEASED',
      actorId: req.actorId,
      newState: {
        campaignId: req.campaignId,
        clipperId: req.clipperId,
        submissionId: req.submissionId,
        grossAmountCents: req.grossAmountCents,
        commissionCents,
        netAmountCents,
        transferId: result.transferId,
      },
    });

    return {
      ...result,
      grossAmountCents: req.grossAmountCents,
      commissionCents,
      netAmountCents,
    };
  }
}

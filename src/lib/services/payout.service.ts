import { getPaymentProvider } from '../providers/payment/factory';
import { EscrowService } from './escrow.service';
import { AuthorizationError, ValidationError } from '../utils/errors';

export interface ProcessPayoutRequest {
  campaignId: string;
  clipperId: string;
  submissionId: string;
  viewsAchieved: number;
  payoutType: 'PER_POST' | 'CPM' | 'HYBRID';
  payoutAmountCents?: number;
  cpmRateCents?: number;
  actorId: string;
}

export class PayoutService {
  static calculateGrossPayout(req: ProcessPayoutRequest): number {
    if (req.payoutType === 'PER_POST') {
      return req.payoutAmountCents || 0;
    }
    if (req.payoutType === 'CPM') {
      const cpm = req.cpmRateCents || 0;
      return Math.round((req.viewsAchieved / 1000) * cpm);
    }
    if (req.payoutType === 'HYBRID') {
      const base = req.payoutAmountCents || 0;
      const cpmBonus = Math.round((req.viewsAchieved / 1000) * (req.cpmRateCents || 0));
      return base + cpmBonus;
    }
    return 0;
  }

  static async processVerifiedPayout(req: ProcessPayoutRequest) {
    const paymentProvider = getPaymentProvider();
    
    // 1. Mandatory KYC check before payout release
    const kycStatus = await paymentProvider.getKycStatus(req.clipperId);
    if (kycStatus !== 'VERIFIED') {
      throw new AuthorizationError('Clipper identity verification (KYC) must be complete before payout can be released.');
    }

    // 2. Calculate payout
    const grossAmountCents = this.calculateGrossPayout(req);
    if (grossAmountCents <= 0) {
      throw new ValidationError('Calculated payout amount is 0');
    }

    // 3. Release escrow through EscrowService (handles commission + audit trail)
    return await EscrowService.releasePayout({
      campaignId: req.campaignId,
      clipperId: req.clipperId,
      submissionId: req.submissionId,
      grossAmountCents,
      actorId: req.actorId,
    });
  }
}

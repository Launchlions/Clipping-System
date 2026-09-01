import {
  PaymentProvider,
  EscrowDepositParams,
  EscrowResult,
  ReleaseParams,
  ReleaseResult,
  OnboardParams,
  ConnectedAccountResult,
  KycStatus,
} from './interface';

export class StripePaymentProvider implements PaymentProvider {
  private secretKey: string;
  private platformAccountId: string;

  constructor() {
    this.secretKey = process.env.STRIPE_SECRET_KEY || '';
    this.platformAccountId = process.env.STRIPE_PLATFORM_ACCOUNT_ID || '';
  }

  async createEscrowDeposit(params: EscrowDepositParams): Promise<EscrowResult> {
    // In production with live Stripe:
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: params.amountCents,
    //   currency: params.currency || 'usd',
    //   capture_method: 'manual', // Hold funds in escrow
    //   metadata: { campaignId: params.campaignId, brandId: params.brandId }
    // }, { idempotencyKey: params.idempotencyKey });

    const mockTxId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return {
      transactionId: mockTxId,
      clientSecret: `pi_mock_secret_${mockTxId}`,
      status: 'COMPLETED',
      amountCents: params.amountCents,
    };
  }

  async releaseEscrowFund(params: ReleaseParams): Promise<ReleaseResult> {
    // In production:
    // const transfer = await stripe.transfers.create({
    //   amount: params.amountCents - params.commissionCents,
    //   currency: 'usd',
    //   destination: destinationConnectedAccountId,
    //   source_transaction: sourceChargeId,
    // }, { idempotencyKey: params.idempotencyKey });

    const mockTransferId = `tr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const mockPayoutId = `po_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    return {
      payoutId: mockPayoutId,
      transferId: mockTransferId,
      status: 'COMPLETED',
      netAmountCents: params.amountCents - params.commissionCents,
      commissionCents: params.commissionCents,
    };
  }

  async createConnectedAccount(params: OnboardParams): Promise<ConnectedAccountResult> {
    const mockAccountId = `acct_mock_${Math.random().toString(36).substring(2, 10)}`;
    return {
      accountId: mockAccountId,
      onboardingUrl: `https://connect.stripe.com/express/oauth/authorize?response_type=code&client_id=ca_mock&scope=read_write`,
      kycStatus: 'VERIFIED',
    };
  }

  async getKycStatus(accountId: string): Promise<KycStatus> {
    if (!accountId || accountId.startsWith('mock_unverified')) {
      return 'UNVERIFIED';
    }
    return 'VERIFIED';
  }
}

export type KycStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface EscrowDepositParams {
  brandId: string;
  campaignId: string;
  amountCents: number;
  currency?: string;
  paymentMethodId?: string;
  idempotencyKey: string;
}

export interface EscrowResult {
  transactionId: string;
  clientSecret?: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  amountCents: number;
}

export interface ReleaseParams {
  campaignId: string;
  clipperId: string;
  submissionId: string;
  amountCents: number;
  commissionCents: number;
  idempotencyKey: string;
}

export interface ReleaseResult {
  payoutId: string;
  transferId: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  netAmountCents: number;
  commissionCents: number;
}

export interface OnboardParams {
  clipperId: string;
  email: string;
  country?: string;
}

export interface ConnectedAccountResult {
  accountId: string;
  onboardingUrl: string;
  kycStatus: KycStatus;
}

export interface PaymentProvider {
  createEscrowDeposit(params: EscrowDepositParams): Promise<EscrowResult>;
  releaseEscrowFund(params: ReleaseParams): Promise<ReleaseResult>;
  createConnectedAccount(params: OnboardParams): Promise<ConnectedAccountResult>;
  getKycStatus(accountId: string): Promise<KycStatus>;
}

import { PaymentProvider } from './interface';
import { StripePaymentProvider } from './stripe';

let paymentProviderInstance: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (!paymentProviderInstance) {
    paymentProviderInstance = new StripePaymentProvider();
  }
  return paymentProviderInstance;
}

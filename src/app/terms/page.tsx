import Link from 'next/link';
import { ArrowLeft, Scale, ShieldCheck, DollarSign } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | ClipBridge',
  description: 'ClipBridge Terms of Service governing escrow custody, creator payouts, 15% marketplace fee, and content IP rights.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-base text-text-primary selection:bg-brand-accent/20">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-base/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to ClipBridge
          </Link>
          <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
            Last Updated: September 2, 2026
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12 space-y-8 leading-relaxed">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary mb-3">
            <Scale className="h-3.5 w-3.5 text-brand-accent" />
            <span>Marketplace Terms &bull; Escrow Agreement &bull; IP Licensing</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            ClipBridge Terms of Service
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of the ClipBridge marketplace, escrow services, and software platform provided by ClipBridge Protocol Inc.
          </p>
        </div>

        <hr className="border-border" />

        {/* 1. Acceptance of Terms */}
        <section className="space-y-3 text-xs sm:text-sm text-text-secondary">
          <h2 className="text-base font-semibold text-text-primary">1. Acceptance of Terms</h2>
          <p>
            By creating an account, pre-funding campaign escrow, claiming creator slots, or submitting video content, you agree to be bound by these Terms. If you do not agree, do not use the ClipBridge platform.
          </p>
        </section>

        {/* 2. Marketplace & Escrow Custody Mechanics */}
        <section className="space-y-3 text-xs sm:text-sm text-text-secondary">
          <h2 className="text-base font-semibold text-text-primary">2. Escrow Custody &amp; Financial Settlement</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-text-muted">
            <li><strong>Pre-funded Escrow:</strong> Brands must deposit 100% of the campaign budget prior to public slot availability. Funds are held in isolated custodial balances powered by Stripe Connect.</li>
            <li><strong>48-Hour Slot Locking:</strong> Creators reserve production slots for 48 hours. If a video edit is not submitted within 48 hours, the slot expires and is returned to the public marketplace.</li>
            <li><strong>7-Day Attribution Settlement:</strong> Payout releases are calculated based on verified organic views polled from official Meta Graph API endpoints during the 7-day window following approved publication.</li>
            <li><strong>Marketplace Fee:</strong> ClipBridge charges a transparent flat 15% platform commission deducted automatically from gross creator payouts upon successful completion.</li>
          </ul>
        </section>

        {/* 3. Intellectual Property Rights & Licensing */}
        <section className="space-y-3 text-xs sm:text-sm text-text-secondary">
          <h2 className="text-base font-semibold text-text-primary">3. Intellectual Property &amp; Content Licensing</h2>
          <p>
            Brands retain all rights and ownership in raw footage, trademarks, and branding assets uploaded to ClipBridge. Creators grant Brands a worldwide, non-exclusive, royalty-free license to use, distribute, and amplify approved 9:16 cuts submitted through the platform.
          </p>
        </section>

        {/* 4. FTC Compliance & Paid Partnership Disclosures */}
        <section className="space-y-3 text-xs sm:text-sm text-text-secondary">
          <h2 className="text-base font-semibold text-text-primary">4. Regulatory &amp; FTC Paid Partnership Disclosures</h2>
          <p>
            Creators must strictly follow Federal Trade Commission (FTC) guidelines and Meta policies by enabling the official Instagram Paid Partnership tag (#ad, #paidpartnership) on all live posts. Failure to disclose brand sponsorship may result in submission rejection and forfeiture of escrow payout.
          </p>
        </section>

        {/* 5. Anti-Fraud & Bot Velocity Enforcement */}
        <section className="space-y-3 text-xs sm:text-sm text-text-secondary">
          <h2 className="text-base font-semibold text-text-primary">5. Anti-Fraud &amp; Prohibition of Artificial Traffic</h2>
          <p>
            Purchasing bot views, fake likes, automated comment spam, or engaging in coordinated artificial traffic surges is strictly prohibited. Submissions flagged by Bot Velocity Telemetry will be immediately frozen pending admin dispute arbitration.
          </p>
        </section>

        {/* 6. Dispute Arbitration */}
        <section className="space-y-3 text-xs sm:text-sm text-text-secondary">
          <h2 className="text-base font-semibold text-text-primary">6. Dispute Arbitration &amp; Rulings</h2>
          <p>
            In the event of contested submissions or wrongful rejections, ClipBridge operations team serves as the neutral binding arbitrator. Rulings may disburse funds to creators, refund escrow to brands, or execute split settlements.
          </p>
        </section>

        {/* 7. Contact */}
        <section className="space-y-2 text-xs sm:text-sm text-text-secondary border-t border-border pt-6">
          <h2 className="text-base font-semibold text-text-primary">7. Contact Information</h2>
          <p className="font-mono text-xs text-text-primary">
            Legal &amp; Compliance Team &bull; legal@clipbridge.com<br />
            ClipBridge Protocol Inc. &bull; 100 Montgomery St, Suite 1400, San Francisco, CA 94104
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-8 text-xs text-text-muted text-center">
        <p>&copy; 2026 ClipBridge Protocol Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Privacy Policy | ClipBridge',
  description: 'ClipBridge Privacy Policy regarding data collection, Google OAuth, Meta Graph API attribution, and escrow security.',
};

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="h-3.5 w-3.5 text-brand-accent" />
            <span>GDPR &bull; CCPA &bull; Meta &bull; Google OAuth Compliance</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            ClipBridge Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            This Privacy Policy explains how ClipBridge Protocol Inc. (&quot;ClipBridge&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, processes, and protects your personal information when you use our website, marketplace, APIs, and creator infrastructure services.
          </p>
        </div>

        <hr className="border-border" />

        {/* 1. Information We Collect */}
        <section className="space-y-3 text-xs sm:text-sm text-text-secondary">
          <h2 className="text-base font-semibold text-text-primary">1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, information collected automatically through your use of the platform, and information obtained from third-party integrations (such as Google OAuth, Meta Graph API, and Stripe Connect).
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-text-muted">
            <li><strong>Account Information:</strong> Name, email address, company profile, Instagram creator handle, and authentication credentials.</li>
            <li><strong>Google User Data:</strong> When you authenticate via Google OAuth, we receive your basic profile information (name, email address, avatar image) strictly to create and authenticate your account. We never read your private emails, Google Drive files, or contacts.</li>
            <li><strong>Payment &amp; Financial Information:</strong> Tax identification (W-9 / Form 1099-K), bank account payout tokens, and transaction ledger details processed securely via Stripe Connect. ClipBridge never stores raw credit card numbers.</li>
            <li><strong>Social Media Attribution Metrics:</strong> Public Instagram Reel view counts, like ratios, comment velocity, and Paid Partnership tags queried through official Meta Graph API endpoints.</li>
          </ul>
        </section>

        {/* 2. How We Use Your Information */}
        <section className="space-y-3 text-xs sm:text-sm text-text-secondary">
          <h2 className="text-base font-semibold text-text-primary">2. How We Use Your Information</h2>
          <p>
            We utilize collected data solely for operating, securing, and facilitating the creator marketplace:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-text-muted">
            <li>To match Brands with relevant Creator fan-page clippers.</li>
            <li>To lock 48-hour campaign slot reservations and verify video submissions.</li>
            <li>To poll official Instagram Reel view counts and calculate algorithmic CPM escrow disbursements.</li>
            <li>To execute Bot Velocity and fraud telemetry to prevent view-botting and artificial traffic surges.</li>
            <li>To generate annual IRS Form 1099-K tax reporting summaries.</li>
          </ul>
        </section>

        {/* 3. Google API Services User Data Policy */}
        <section className="space-y-3 text-xs sm:text-sm text-text-secondary rounded-lg border border-border bg-surface p-5">
          <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
            <Lock className="h-4 w-4 text-brand-accent" />
            3. Google API Services Limited Use Disclosure
          </h2>
          <p>
            ClipBridge&apos;s use and transfer to any other app of information received from Google APIs will adhere to the{' '}
            <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer" className="text-brand-accent hover:underline font-medium">
              Google API Services User Data Policy
            </a>, including the Limited Use requirements.
          </p>
          <p className="text-xs text-text-muted">
            We do not sell Google user data to third parties, use Google user data for targeted advertising, or permit human access to private user data except with explicit consent or where required by law.
          </p>
        </section>

        {/* 4. Data Sharing & Third Parties */}
        <section className="space-y-3 text-xs sm:text-sm text-text-secondary">
          <h2 className="text-base font-semibold text-text-primary">4. Data Sharing and Third-Party Processors</h2>
          <p>
            We never sell, rent, or trade your personal data. We only share data with essential technical service providers who adhere to strict data privacy standards:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-text-muted">
            <li><strong>Stripe, Inc.:</strong> Payment processing, escrow custody, and identity verification.</li>
            <li><strong>Supabase / AWS:</strong> Encrypted database storage and 4K asset hosting.</li>
            <li><strong>Meta Platforms, Inc.:</strong> Instagram Graph API public metric attribution verification.</li>
          </ul>
        </section>

        {/* 5. Data Retention & Deletion */}
        <section className="space-y-3 text-xs sm:text-sm text-text-secondary">
          <h2 className="text-base font-semibold text-text-primary">5. Data Retention &amp; User Rights (GDPR / CCPA)</h2>
          <p>
            You have the right to access, rectify, export, or permanently delete your personal information at any time. You can request complete account deletion directly from your Account Settings or by emailing our privacy team.
          </p>
        </section>

        {/* 6. Contact Information */}
        <section className="space-y-2 text-xs sm:text-sm text-text-secondary border-t border-border pt-6">
          <h2 className="text-base font-semibold text-text-primary">6. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy or wish to exercise your privacy rights, please contact our Data Protection Officer:
          </p>
          <p className="font-mono text-xs text-text-primary">
            Email: privacy@clipbridge.com &bull; support@clipbridge.com<br />
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

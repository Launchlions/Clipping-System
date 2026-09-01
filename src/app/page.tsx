import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Eye, 
  Layers, 
  DollarSign, 
  Zap, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base text-text-primary selection:bg-brand-accent/20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-base/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-bold tracking-tight text-text-primary">
              ClipBridge
            </Link>
            <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-text-muted">
              <a href="#how-it-works" className="hover:text-text-primary transition-colors">How Escrow Works</a>
              <a href="#payout-models" className="hover:text-text-primary transition-colors">Payout Models</a>
              <a href="#compliance" className="hover:text-text-primary transition-colors">Compliance &amp; Security</a>
              <a href="#pricing" className="hover:text-text-primary transition-colors">Pricing</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs text-text-secondary hover:text-text-primary">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-brand-accent hover:bg-brand-accent-hover text-white text-xs">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary mb-6">
          <span className="flex h-2 w-2 rounded-full bg-status-success" />
          <span>Financial-grade escrow for creator fan-page campaigns</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary max-w-3xl mx-auto text-balance">
          Scale short-form reach with guaranteed performance.
        </h1>

        <p className="mt-5 max-w-2xl mx-auto text-base text-text-muted leading-relaxed">
          ClipBridge connects enterprise brands with fan-page clippers through pre-funded escrow, verified Instagram attribution, and automated split payouts.
        </p>

        {/* Dual CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/signup" className="w-full sm:w-auto">
            <Button size="lg" className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white text-sm gap-2 h-11 px-6">
              Launch a Brand Campaign <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/signup" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full text-sm h-11 px-6 border-border hover:bg-surface-raised">
              Join as a Creator / Clipper
            </Button>
          </Link>
        </div>

        {/* Browser Chrome Product Mockup */}
        <div className="mt-16 mx-auto max-w-5xl rounded-xl border border-border bg-surface p-2 shadow-2xl">
          <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
            <div className="h-2.5 w-2.5 rounded-full bg-status-danger/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-status-warning/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-status-success/60" />
            <span className="mx-auto font-mono text-[11px] text-text-muted">app.clipbridge.com/brand/dashboard</span>
          </div>

          <div className="p-6 bg-base rounded-b-lg text-left space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">Escrow Custody</p>
                <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-text-primary">$18,000.00</p>
                <p className="text-[11px] text-status-success mt-0.5">✓ 100% Pre-funded</p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">Verified Reach</p>
                <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-text-primary">1.04M</p>
                <p className="text-[11px] text-text-muted mt-0.5">+8.7% this week</p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">Active Submissions</p>
                <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-text-primary">24</p>
                <p className="text-[11px] text-text-muted mt-0.5">12 pending review</p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">Avg. CPM Cost</p>
                <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-text-primary">$11.62</p>
                <p className="text-[11px] text-brand-accent mt-0.5">Optimized ROI</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Escrow Works Diagram */}
      <section id="how-it-works" className="border-t border-border py-20 bg-surface">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              How the Escrow Protocol Works
            </h2>
            <p className="mt-3 text-sm text-text-muted">
              Zero risk for brands. Zero non-payment risk for creators. Funds are locked before work begins and released strictly upon verified engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-base p-6 space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-accent/10 text-brand-accent font-mono font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-semibold text-text-primary">Brand Funds Escrow</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Brand uploads raw assets, defines payout parameters (Per-Post or CPM), and deposits the campaign budget into isolated Stripe Connect custody.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-base p-6 space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-accent/10 text-brand-accent font-mono font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-semibold text-text-primary">Creators Edit &amp; Publish</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Clippers lock slots for 48 hours, download assets, submit edits for brand PR-style review, and post to Instagram with Paid Partnership tags.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-base p-6 space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-accent/10 text-brand-accent font-mono font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-semibold text-text-primary">Automated Split Release</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Our tracking worker polls verified view counts across the 7-day attribution window. When complete, escrow is automatically disbursed directly to creator bank accounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Transparency */}
      <section id="pricing" className="border-t border-border py-20 bg-base">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            100% Transparent Marketplace Fee
          </h2>
          <p className="mt-3 text-sm text-text-muted max-w-xl mx-auto">
            No monthly software seat licenses. No hidden retainers. ClipBridge charges a flat 15% marketplace commission on completed creator payouts.
          </p>

          <div className="mt-10 rounded-xl border border-border bg-surface p-8 max-w-md mx-auto text-left space-y-5">
            <div className="flex justify-between items-baseline border-b border-border pb-4">
              <div>
                <p className="text-sm font-semibold text-text-primary">Standard Protocol</p>
                <p className="text-xs text-text-muted">For brands and creator communities</p>
              </div>
              <span className="font-mono text-3xl font-bold text-brand-accent">15%</span>
            </div>

            <ul className="space-y-3 text-xs text-text-secondary">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />
                <span>Unlimited campaign creation &amp; raw asset storage</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />
                <span>Automated Instagram view polling &amp; bot telemetry</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />
                <span>Stripe Connect Express KYC and 1099-K tax reporting</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />
                <span>Immutable audit logs for accounting &amp; dispute arbitration</span>
              </li>
            </ul>

            <Link href="/signup" className="block pt-2">
              <Button className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white text-xs">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-12 text-xs text-text-muted">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary">ClipBridge</span>
            <span>© 2026 ClipBridge Protocol Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-text-primary">Terms of Service</a>
            <a href="#" className="hover:text-text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-text-primary">Escrow Custody Terms</a>
            <a href="#" className="hover:text-text-primary">FTC / Meta Compliance</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

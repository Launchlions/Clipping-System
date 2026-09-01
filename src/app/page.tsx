'use client';

import React, { useState } from 'react';
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
  TrendingUp,
  Play,
  Pause,
  Sliders,
  Sparkles,
  BarChart3,
  Cpu,
  Award,
  Check,
  Building,
  UserCheck,
  ArrowUpRight,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCents } from '@/lib/utils/constants';

const BRAND_LOGOS = [
  { name: 'GYMSHARK', ticker: 'FITNESS' },
  { name: 'LUMIERE', ticker: 'BEAUTY' },
  { name: 'APEX GEAR', ticker: 'EDC TECH' },
  { name: 'MACROFIT', ticker: 'NUTRITION' },
  { name: 'AURA STUDIO', ticker: 'LIFESTYLE' },
  { name: 'HYPERDRIVE', ticker: 'GAMING' },
];

const FAQS = [
  {
    category: 'Escrow & Safety',
    q: 'How does the Stripe Connect escrow custody guarantee zero risk for brands?',
    a: 'When you fund a campaign, 100% of the budget is held in an isolated Stripe Connect custodial balance. Creators can view guaranteed funds before claiming slots, but payouts are strictly gated and automatically disbursed only after our engine verifies live views across the 7-day attribution window.',
  },
  {
    category: 'FTC & Meta Compliance',
    q: 'How does ClipBridge ensure compliance with Instagram Paid Partnership regulations?',
    a: 'Every video cut submission undergoes automated and brand-supervised PR review. Creators must configure the official Meta Paid Partnership collaborator tag on Instagram Reels before tracking begins, ensuring 100% regulatory compliance and zero shadow-ban risks.',
  },
  {
    category: 'Anti-Fraud & Bot Telemetry',
    q: 'What prevents clippers from sending bot views or fake engagement?',
    a: 'Our proprietary Bot Velocity Telemetry actively analyzes engagement ratios (like/view velocity, comment depth, view acceleration curves). Traffic surges with sub-0.15% engagement or unnatural IP patterns are automatically quarantined for arbitration before any funds release.',
  },
  {
    category: 'For Content Creators',
    q: 'When and how do clippers receive their payout?',
    a: 'Once your submitted Instagram Reel completes its 7-day attribution tracking cycle, your 85% net earnings are immediately transferred to your linked bank account via Stripe Connect Express with zero manual invoices or payment delays.',
  },
];

export default function LandingPage() {
  // Calculator state
  const [monthlyBudget, setMonthlyBudget] = useState(5000); // $5,000
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'brand' | 'clipper' | 'engine'>('brand');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [isPlayingReel, setIsPlayingReel] = useState(false);

  // Dynamic calculations based on $12.50 avg CPM
  const estimatedViews = Math.round((monthlyBudget / 12.5) * 1000);
  const estimatedEdits = Math.max(8, Math.round(monthlyBudget / 150));
  const paidAdsCost = Math.round((estimatedViews / 1000) * 26.5); // $26.50 Meta Ads avg CPM
  const netSavings = paidAdsCost - monthlyBudget;
  const creatorPayouts = Math.round(monthlyBudget * 0.85);

  return (
    <div className="min-h-screen bg-base text-text-primary selection:bg-brand-accent/20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-base/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-brand-accent text-white font-bold text-xs">
                CB
              </div>
              <span className="text-sm font-bold tracking-tight text-text-primary">
                ClipBridge
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-text-muted">
              <a href="#how-it-works" className="hover:text-text-primary transition-colors">Protocol Architecture</a>
              <a href="#calculator" className="hover:text-text-primary transition-colors">ROI Simulator</a>
              <a href="#fraud-shield" className="hover:text-text-primary transition-colors">Anti-Fraud Shield</a>
              <a href="#pricing" className="hover:text-text-primary transition-colors">Economics</a>
              <a href="#faq" className="hover:text-text-primary transition-colors">FAQ</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 border-r border-border pr-3 text-xs">
              <Link href="/brand/dashboard" className="px-2 py-1 text-text-secondary hover:text-text-primary font-medium">
                Brand Demo
              </Link>
              <Link href="/clipper/marketplace" className="px-2 py-1 text-text-secondary hover:text-text-primary font-medium">
                Clipper Demo
              </Link>
              <Link href="/admin/dashboard" className="px-2 py-1 text-text-secondary hover:text-text-primary font-medium">
                Admin Demo
              </Link>
            </div>

            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs text-text-secondary hover:text-text-primary">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-brand-accent hover:bg-brand-accent-hover text-white text-xs shadow-sm font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-16 text-center">
        {/* Trust Pill */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-1.5 text-xs text-text-secondary shadow-sm mb-6">
          <span className="flex h-2 w-2 rounded-full bg-status-success animate-pulse" />
          <span className="font-semibold text-text-primary">$1.84M+</span>
          <span className="text-text-muted">Escrow Secured &bull; 48,000+ Verified Creators</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary max-w-4xl mx-auto text-balance leading-[1.08]">
          The Programmable Creator Infrastructure for Modern Brands.
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-text-muted leading-relaxed text-balance font-normal">
          Turn raw brand footage into millions of organic short-form impressions. Pre-funded Stripe escrow, verified Instagram attribution, and automated 85/15 split payouts.
        </p>

        {/* Dual CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link href="/signup" className="w-full sm:w-auto">
            <Button size="lg" className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white text-sm gap-2 h-11 px-7 shadow-md font-medium">
              Launch a Brand Campaign <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/signup" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full text-sm h-11 px-7 border-border hover:bg-surface-raised bg-surface font-medium">
              Join as a Fan-Page Clipper
            </Button>
          </Link>
        </div>

        {/* Quick Test Drive Bar */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-text-muted">
          <span>⚡ Instant 1-Click Sandbox:</span>
          <Link href="/brand/dashboard" className="text-brand-accent hover:underline font-medium">
            Test Brand Portal &rarr;
          </Link>
          <Link href="/clipper/marketplace" className="text-brand-accent hover:underline font-medium">
            Test Creator Hub &rarr;
          </Link>
        </div>

        {/* Brand Logos Strip */}
        <div className="mt-16 border-y border-border py-8">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted mb-6">
            Trusted by short-form growth teams at leading brands
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 items-center">
            {BRAND_LOGOS.map((brand) => (
              <div key={brand.name} className="flex flex-col items-center justify-center p-3 rounded border border-border/50 bg-surface/50 hover:bg-surface transition-colors">
                <span className="font-mono font-bold text-xs tracking-wider text-text-primary">{brand.name}</span>
                <span className="text-[9px] font-mono text-text-muted">{brand.ticker}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Live Product Dashboard Inspector */}
        <div className="mt-16 mx-auto max-w-6xl rounded-xl border border-border bg-surface p-2.5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-surface-raised rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-status-danger/70" />
              <div className="h-3 w-3 rounded-full bg-status-warning/70" />
              <div className="h-3 w-3 rounded-full bg-status-success/70" />
              <span className="ml-2 font-mono text-xs text-text-muted">https://app.clipbridge.com/brand/campaigns/camp-1</span>
            </div>
            <span className="rounded bg-status-success/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-status-success">
              ● ESCROW LIVE &amp; TRACKING
            </span>
          </div>

          <div className="p-6 bg-base rounded-b-lg text-left space-y-6">
            {/* Live Metrics Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">Stripe Custody Escrow</p>
                <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-text-primary">$18,000.00</p>
                <p className="text-[11px] text-status-success mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> 100% Pre-funded &amp; Locked
                </p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">Verified Organic Views</p>
                <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-text-primary">1,842,500</p>
                <p className="text-[11px] text-text-muted mt-0.5">+14.2% velocity surge</p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">Active Creator Slots</p>
                <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-text-primary">18 / 20</p>
                <p className="text-[11px] text-text-muted mt-0.5">48h slot claim duration</p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">Effective CPM Cost</p>
                <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-brand-accent">$9.77</p>
                <p className="text-[11px] text-text-muted mt-0.5">vs $26.50 Meta Ads Avg</p>
              </div>
            </div>

            {/* Side-by-side: Live Reel Preview & Verification Queue */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left: 9:16 Video Inspector */}
              <div className="lg:col-span-5 rounded-lg border border-border bg-black/90 p-4 aspect-[9/14] flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between text-white/80 z-10">
                  <span className="rounded bg-white/20 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold">
                    SUBMISSION #sub-1
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-status-success font-semibold bg-status-success/20 px-2 py-0.5 rounded">
                    <CheckCircle2 className="h-3 w-3" /> FTC COMPLIANT
                  </span>
                </div>

                <div className="text-center z-10 my-auto">
                  <button
                    onClick={() => setIsPlayingReel(!isPlayingReel)}
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent text-white shadow-lg hover:scale-105 transition-transform"
                  >
                    {isPlayingReel ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                  </button>
                  <p className="text-xs text-white/80 font-medium mt-3">Summer Activewear Reel Cut v2</p>
                  <p className="text-[10px] text-white/50 font-mono">by @alex_edits_fit (142k followers)</p>
                </div>

                <div className="rounded bg-black/70 backdrop-blur-md p-3 text-white text-xs z-10 space-y-1">
                  <p className="font-semibold text-[11px]">Paid Partnership: ActiveWear Official</p>
                  <p className="text-[11px] text-white/70">Pushing past limits with @ActiveWear 🔥 Code ALEX20 for 20% off #ad #activewear</p>
                </div>
              </div>

              {/* Right: Live PR Review & Attribution Milestones */}
              <div className="lg:col-span-7 rounded-lg border border-border bg-surface p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">PR-Style Submission Review Panel</h3>
                      <p className="text-xs text-text-muted">Brand side-by-side compliance checklist</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-status-success">$100 base + $15 CPM</span>
                  </div>

                  <div className="mt-4 space-y-2.5 text-xs">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Check className="h-4 w-4 text-status-success shrink-0" />
                      <span>Discount code ALEX20 highlighted in first 5 seconds</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Check className="h-4 w-4 text-status-success shrink-0" />
                      <span>Official audio track cleared from commercial-safe library</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Check className="h-4 w-4 text-status-success shrink-0" />
                      <span>Paid Partnership tag verified via Instagram Graph API</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Check className="h-4 w-4 text-status-success shrink-0" />
                      <span>Bot velocity fraud score: <strong>0% (Clean organic traffic)</strong></span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-surface-raised p-4 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>7-Day Attribution Window:</span>
                    <span className="font-mono text-brand-accent">Day 4 of 7</span>
                  </div>
                  <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-brand-accent rounded-full w-[57%]" />
                  </div>
                  <div className="flex justify-between text-[11px] text-text-muted font-mono">
                    <span>Current Views: 48,200</span>
                    <span>Est. Payout: $723.00 (85% Creator / 15% Fee)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive ROI Calculator Section */}
      <section id="calculator" className="border-t border-border py-20 bg-surface">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-text-primary">
              Interactive Short-Form ROI Simulator
            </h2>
            <p className="mt-3 text-sm text-text-muted">
              Compare your effective CPM and reach on ClipBridge versus traditional paid Meta Ads.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-base p-8 shadow-sm space-y-8">
            {/* Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-text-primary">Monthly Escrow Campaign Budget</label>
                <span className="font-mono text-2xl font-bold text-brand-accent tabular-nums">
                  ${monthlyBudget.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={1000}
                max={50000}
                step={500}
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                className="w-full accent-brand-accent h-2 bg-surface-raised rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-text-muted">
                <span>$1,000 (Starter)</span>
                <span>$25,000 (Growth)</span>
                <span>$50,000+ (Scale)</span>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border bg-surface p-4">
                <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">Guaranteed Reach</span>
                <p className="mt-1 font-mono text-2xl font-bold text-text-primary tabular-nums">
                  ~{estimatedViews.toLocaleString()}
                </p>
                <p className="text-[11px] text-status-success mt-0.5">Verified organic views</p>
              </div>

              <div className="rounded-lg border border-border bg-surface p-4">
                <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">Video Edits Delivered</span>
                <p className="mt-1 font-mono text-2xl font-bold text-text-primary tabular-nums">
                  {estimatedEdits} High-Converting Cuts
                </p>
                <p className="text-[11px] text-text-muted mt-0.5">From vetted fan clippers</p>
              </div>

              <div className="rounded-lg border border-border bg-surface p-4">
                <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">Equivalent Meta Ads Cost</span>
                <p className="mt-1 font-mono text-2xl font-bold text-text-muted line-through tabular-nums">
                  ${paidAdsCost.toLocaleString()}
                </p>
                <p className="text-[11px] text-status-danger mt-0.5">Avg $26.50 Paid CPM</p>
              </div>

              <div className="rounded-lg border border-brand-accent/30 bg-brand-accent/5 p-4">
                <span className="text-[11px] font-medium uppercase tracking-wider text-brand-accent">Estimated Brand Savings</span>
                <p className="mt-1 font-mono text-2xl font-bold text-status-success tabular-nums">
                  +${netSavings.toLocaleString()}
                </p>
                <p className="text-[11px] text-brand-accent mt-0.5">Capital efficiency gain</p>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link href="/signup">
                <Button size="lg" className="bg-brand-accent hover:bg-brand-accent-hover text-white text-xs gap-2 px-8">
                  Lock Your Campaign Escrow &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Sided Protocol Workflow */}
      <section id="how-it-works" className="border-t border-border py-20 bg-base">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-text-primary">
              Three-Sided Marketplace Protocol
            </h2>
            <p className="mt-3 text-sm text-text-muted">
              Seamless synchronization between Brands, Clippers, and the Automated Attribution Engine.
            </p>
          </div>

          {/* Workflow Tabs */}
          <div className="flex justify-center border-b border-border mb-8">
            {[
              { id: 'brand', label: '1. Brand Workflow (Zero Risk)' },
              { id: 'clipper', label: '2. Clipper Workflow (Instant Payouts)' },
              { id: 'engine', label: '3. Autonomous Tracking Engine' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveWorkflowTab(tab.id as any)}
                className={`border-b-2 px-6 py-3 font-semibold text-xs sm:text-sm transition-colors ${
                  activeWorkflowTab === tab.id
                    ? 'border-brand-accent text-brand-accent'
                    : 'border-transparent text-text-muted hover:text-text-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="rounded-xl border border-border bg-surface p-8">
            {activeWorkflowTab === 'brand' && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-2 border-l-2 border-brand-accent pl-4">
                  <span className="font-mono text-xs font-bold text-brand-accent">STEP 01</span>
                  <h3 className="text-sm font-semibold text-text-primary">Deposit to Stripe Escrow</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Set flat per-post rates, CPM tiers, or hybrid models. Deposit budget safely into isolated Stripe Connect custody.
                  </p>
                </div>
                <div className="space-y-2 border-l-2 border-brand-accent pl-4">
                  <span className="font-mono text-xs font-bold text-brand-accent">STEP 02</span>
                  <h3 className="text-sm font-semibold text-text-primary">PR-Style Video Approval</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Review submitted 9:16 cuts side-by-side with brand guidelines. Approve or request instant revisions with 1 click.
                  </p>
                </div>
                <div className="space-y-2 border-l-2 border-brand-accent pl-4">
                  <span className="font-mono text-xs font-bold text-brand-accent">STEP 03</span>
                  <h3 className="text-sm font-semibold text-text-primary">Automated Performance Settlement</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Funds disburse strictly upon verified view milestones. Remaining unspent escrow is refunded instantly upon campaign close.
                  </p>
                </div>
              </div>
            )}

            {activeWorkflowTab === 'clipper' && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-2 border-l-2 border-brand-accent pl-4">
                  <span className="font-mono text-xs font-bold text-brand-accent">STEP 01</span>
                  <h3 className="text-sm font-semibold text-text-primary">Claim 48-Hour Slot</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Browse verified briefs, lock your slot to prevent oversaturation, and download original 4K raw assets.
                  </p>
                </div>
                <div className="space-y-2 border-l-2 border-brand-accent pl-4">
                  <span className="font-mono text-xs font-bold text-brand-accent">STEP 02</span>
                  <h3 className="text-sm font-semibold text-text-primary">Post with Paid Partnership Tag</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Publish your approved cut to Instagram Reels. Add the official brand collaborator tag for instant tracking.
                  </p>
                </div>
                <div className="space-y-2 border-l-2 border-brand-accent pl-4">
                  <span className="font-mono text-xs font-bold text-brand-accent">STEP 03</span>
                  <h3 className="text-sm font-semibold text-text-primary">Direct Stripe Express Deposit</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Receive your 85% net payout directly into your bank account. No waiting for 30-day net terms or manual invoicing.
                  </p>
                </div>
              </div>
            )}

            {activeWorkflowTab === 'engine' && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-2 border-l-2 border-brand-accent pl-4">
                  <span className="font-mono text-xs font-bold text-brand-accent">STEP 01</span>
                  <h3 className="text-sm font-semibold text-text-primary">Meta Graph API Polling</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Hourly worker tasks query official Meta Graph API endpoints to record view counts, likes, comments, and shares.
                  </p>
                </div>
                <div className="space-y-2 border-l-2 border-brand-accent pl-4">
                  <span className="font-mono text-xs font-bold text-brand-accent">STEP 02</span>
                  <h3 className="text-sm font-semibold text-text-primary">Bot Velocity Telemetry</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Identifies abnormal spike curves and low-engagement view botting, automatically locking payouts before release.
                  </p>
                </div>
                <div className="space-y-2 border-l-2 border-brand-accent pl-4">
                  <span className="font-mono text-xs font-bold text-brand-accent">STEP 03</span>
                  <h3 className="text-sm font-semibold text-text-primary">Immutable Audit Logging</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Every state transition, deposit, hold, and release is permanently recorded in append-only cryptographic ledger logs.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing & Transparency Section */}
      <section id="pricing" className="border-t border-border py-20 bg-surface">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-text-primary">
            100% Transparent 15% Marketplace Economics
          </h2>
          <p className="mt-3 text-sm text-text-muted max-w-xl mx-auto">
            No monthly software subscription fees. No retainers. ClipBridge charges a flat 15% platform commission on completed creator payouts.
          </p>

          <div className="mt-10 rounded-xl border border-border bg-base p-8 max-w-lg mx-auto text-left space-y-6 shadow-sm">
            <div className="flex justify-between items-baseline border-b border-border pb-4">
              <div>
                <p className="text-base font-semibold text-text-primary">Universal Creator Protocol</p>
                <p className="text-xs text-text-muted">For high-growth brands and creator networks</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-3xl font-bold text-brand-accent">15%</span>
                <p className="text-[10px] text-text-muted">platform fee</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-text-secondary">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />
                <span>Unlimited campaign creation &amp; 100MB raw 4K asset storage</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />
                <span>Automated Meta Graph API view polling &amp; 7-day attribution</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />
                <span>Stripe Connect Express KYC identity verification &amp; 1099-K tax reporting</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />
                <span>AI bot velocity fraud detection and admin dispute arbitration</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />
                <span>Append-only financial audit logs for corporate accounting</span>
              </li>
            </ul>

            <Link href="/signup" className="block pt-2">
              <Button className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white text-xs h-10 font-medium">
                Create Account &amp; Start Scaling
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section id="faq" className="border-t border-border py-20 bg-base">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-text-primary">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm text-text-muted">
              Everything you need to know about escrow protection, attribution, and FTC compliance.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border bg-surface overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-text-primary hover:text-brand-accent"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-brand-accent font-normal uppercase">[{faq.category}]</span>
                    {faq.q}
                  </span>
                  <ChevronRight className={`h-4 w-4 text-text-muted transition-transform ${activeFaq === idx ? 'rotate-90' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-text-secondary leading-relaxed border-t border-border/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Call to Action Banner */}
      <section className="border-t border-border py-16 bg-surface-raised text-center">
        <div className="mx-auto max-w-3xl px-6 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Ready to scale organic short-form distribution?
          </h2>
          <p className="text-sm text-text-muted max-w-xl mx-auto">
            Join 250+ hyper-growth brands and thousands of creators on the trusted marketplace protocol.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="bg-brand-accent hover:bg-brand-accent-hover text-white text-xs px-8 h-11">
                Launch Brand Campaign
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="text-xs px-8 h-11 bg-surface">
                Join as Clipper
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-12 text-xs text-text-muted">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-brand-accent text-white font-bold text-[10px]">
              CB
            </div>
            <span className="font-semibold text-text-primary">ClipBridge</span>
            <span>&bull; © 2026 ClipBridge Protocol Inc. Built for short-form creators.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/terms" className="hover:text-text-primary transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
            <Link href="/brand/dashboard" className="hover:text-text-primary">Brand Hub</Link>
            <Link href="/clipper/marketplace" className="hover:text-text-primary">Creator Hub</Link>
            <Link href="/admin/dashboard" className="hover:text-text-primary">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

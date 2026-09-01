'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Megaphone, 
  DollarSign, 
  FileText, 
  UploadCloud, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Calculator,
  Plus,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/shared/metric-card';
import { COMMISSION_RATE } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

import { useToast } from '@/components/ui/toast';
import { useCampaigns } from '@/lib/hooks/use-campaigns';

type PayoutType = 'PER_POST' | 'CPM' | 'HYBRID';

const NICHES = ['Fashion', 'Beauty', 'Fitness', 'Tech', 'Food', 'Gaming', 'Lifestyle', 'Finance', 'Entertainment'];

export default function NewCampaignWizard() {
  const router = useRouter();
  const { toast } = useToast();
  const { createCampaign } = useCampaigns();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Basics
  const [title, setTitle] = useState('');
  const [niche, setNiche] = useState('Fashion');
  const [brief, setBrief] = useState('');
  const [maxClippers, setMaxClippers] = useState(10);
  const [attributionDays, setAttributionDays] = useState(7);

  // Step 2: Payout Structure
  const [payoutType, setPayoutType] = useState<PayoutType>('PER_POST');
  const [flatPayoutAmount, setFlatPayoutAmount] = useState(150); // $150
  const [cpmRate, setCpmRate] = useState(15); // $15 per 1,000 views
  const [simulatedViews, setSimulatedViews] = useState(25000);

  // Step 3: Guidelines
  const [dos, setDos] = useState(['Include official brand hashtag in first 3 lines', 'Highlight discount code in first 5 seconds']);
  const [donts, setDonts] = useState(['Do not use copyrighted non-cleared background music', 'Do not mention competing brands']);
  const [newDo, setNewDo] = useState('');
  const [newDont, setNewDont] = useState('');

  // Step 4: Assets
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; type: string }[]>([
    { name: 'raw_footage_4k_scene1.mp4', size: '42.5 MB', type: 'video/mp4' },
    { name: 'brand_logo_transparent.png', size: '1.2 MB', type: 'image/png' },
  ]);

  // Step 5: Budget
  const [budget, setBudget] = useState(5000); // $5,000 total escrow deposit

  // Calculator logic
  const calculateEstimatedEarnings = () => {
    if (payoutType === 'PER_POST') return flatPayoutAmount;
    if (payoutType === 'CPM') return (simulatedViews / 1000) * cpmRate;
    return flatPayoutAmount + (simulatedViews / 1000) * cpmRate;
  };

  const addDo = () => {
    if (newDo.trim()) {
      setDos([...dos, newDo.trim()]);
      setNewDo('');
    }
  };

  const addDont = () => {
    if (newDont.trim()) {
      setDonts([...donts, newDont.trim()]);
      setNewDont('');
    }
  };

  const handleLaunch = async () => {
    try {
      setLoading(true);
      await createCampaign({
        title: title || 'New Campaign Brief',
        niche,
        payoutType,
        payoutAmountCents: flatPayoutAmount * 100,
        cpmRateCents: cpmRate * 100,
        budgetCents: budget * 100,
        slotsTotal: maxClippers,
        attributionWindowDays: attributionDays,
      });

      toast({
        type: 'success',
        title: 'Campaign Live & Funded',
        description: `$${budget.toLocaleString()} escrow authorized. Creators can now view and claim slots.`,
      });

      router.push('/brand/campaigns');
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Launch Failed',
        description: err.message || 'Could not create campaign.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-text-primary">Create New Campaign</h1>
        <p className="text-sm text-text-muted">Define your brief, asset pool, escrow deposit, and payout terms.</p>
      </div>

      {/* Stepper Progress */}
      <div className="grid grid-cols-6 gap-2 border-b border-border pb-4">
        {[
          { step: 1, label: 'Basics' },
          { step: 2, label: 'Payout' },
          { step: 3, label: 'Guidelines' },
          { step: 4, label: 'Assets' },
          { step: 5, label: 'Escrow' },
          { step: 6, label: 'Launch' },
        ].map((s) => (
          <div key={s.step} className="flex flex-col gap-1.5">
            <div
              className={cn(
                'h-1 rounded-full transition-colors',
                s.step <= currentStep ? 'bg-brand-accent' : 'bg-surface-raised'
              )}
            />
            <span className={cn('text-[11px] font-medium', s.step === currentStep ? 'text-brand-accent' : 'text-text-muted')}>
              {s.step}. {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Basics */}
      {currentStep === 1 && (
        <div className="space-y-5 rounded-lg border border-border bg-surface p-6">
          <h2 className="text-base font-semibold text-text-primary">Campaign Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-text-secondary">Campaign Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer Activewear Reel Blitz"
                className="mt-1 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-sm text-text-primary focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-text-secondary">Niche / Category</label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-sm text-text-primary focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {NICHES.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-text-secondary">Max Creator Slots</label>
                <input
                  type="number"
                  value={maxClippers}
                  onChange={(e) => setMaxClippers(Number(e.target.value))}
                  min={1}
                  max={100}
                  className="mt-1 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-sm text-text-primary focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-secondary">Creative Brief & Goals</label>
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                rows={4}
                placeholder="Describe what clips should communicate, product key features, and desired editing style..."
                className="mt-1 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-sm text-text-primary focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Payout Structure with Live Calculator */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-surface p-6 space-y-4">
            <h2 className="text-base font-semibold text-text-primary">Payout Model</h2>
            
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { id: 'PER_POST', label: 'Pay Per Approved Post', desc: 'Fixed fee paid on verified publish' },
                { id: 'CPM', label: 'Performance CPM', desc: 'Paid per 1,000 verified views' },
                { id: 'HYBRID', label: 'Hybrid (Base + CPM)', desc: 'Base flat fee + performance bonus' },
              ].map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setPayoutType(model.id as PayoutType)}
                  className={cn(
                    'flex flex-col items-start rounded-lg border p-4 text-left transition-all',
                    payoutType === model.id
                      ? 'border-brand-accent bg-brand-accent/5'
                      : 'border-border hover:border-text-muted'
                  )}
                >
                  <span className="text-sm font-semibold text-text-primary">{model.label}</span>
                  <span className="mt-1 text-xs text-text-muted">{model.desc}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
              {(payoutType === 'PER_POST' || payoutType === 'HYBRID') && (
                <div>
                  <label className="text-xs font-medium text-text-secondary">Base Payout per Post ($)</label>
                  <input
                    type="number"
                    value={flatPayoutAmount}
                    onChange={(e) => setFlatPayoutAmount(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 font-mono text-sm text-text-primary tabular-nums focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              )}

              {(payoutType === 'CPM' || payoutType === 'HYBRID') && (
                <div>
                  <label className="text-xs font-medium text-text-secondary">CPM Rate ($ per 1K views)</label>
                  <input
                    type="number"
                    value={cpmRate}
                    onChange={(e) => setCpmRate(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 font-mono text-sm text-text-primary tabular-nums focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Live Payout Calculator Preview */}
          <div className="rounded-lg border border-brand-accent/30 bg-brand-accent/5 p-5 space-y-4">
            <div className="flex items-center gap-2 text-brand-accent">
              <Calculator className="h-4 w-4" />
              <h3 className="text-xs font-semibold uppercase tracking-wider">Live Creator Earning Simulator</h3>
            </div>

            <div>
              <div className="flex justify-between text-xs text-text-secondary mb-1">
                <span>Simulated Reach (Attribution Window)</span>
                <span className="font-mono tabular-nums font-semibold">{simulatedViews.toLocaleString()} views</span>
              </div>
              <input
                type="range"
                min="1000"
                max="250000"
                step="5000"
                value={simulatedViews}
                onChange={(e) => setSimulatedViews(Number(e.target.value))}
                className="w-full accent-brand-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-brand-accent/20">
              <div>
                <p className="text-[11px] text-text-muted">Estimated Creator Earning</p>
                <p className="font-mono text-lg font-bold text-text-primary tabular-nums">
                  ${calculateEstimatedEarnings().toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-text-muted">Platform Fee ({COMMISSION_RATE * 100}%)</p>
                <p className="font-mono text-lg font-bold text-text-secondary tabular-nums">
                  ${(calculateEstimatedEarnings() * COMMISSION_RATE).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Content Guidelines */}
      {currentStep === 3 && (
        <div className="space-y-6 rounded-lg border border-border bg-surface p-6">
          <h2 className="text-base font-semibold text-text-primary">Content Guidelines (Do&apos;s &amp; Don&apos;ts)</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-status-success uppercase tracking-wider">Mandatory Requirements (Do&apos;s)</label>
              <div className="mt-2 space-y-2">
                {dos.map((d, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-md border border-border bg-surface-raised px-3 py-1.5 text-xs text-text-primary">
                    <span>{d}</span>
                    <button type="button" onClick={() => setDos(dos.filter((_, i) => i !== idx))} className="text-text-muted hover:text-status-danger">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDo}
                    onChange={(e) => setNewDo(e.target.value)}
                    placeholder="Add a required guideline..."
                    className="flex-1 rounded-md border border-input-border bg-input-bg px-3 py-1.5 text-xs text-text-primary focus:border-brand-accent focus:outline-none"
                  />
                  <Button size="sm" variant="secondary" onClick={addDo}>
                    <Plus className="h-3.5 w-3.5" /> Add
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border-subtle">
              <label className="text-xs font-semibold text-status-danger uppercase tracking-wider">Prohibited Actions (Don&apos;ts)</label>
              <div className="mt-2 space-y-2">
                {donts.map((d, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-md border border-border bg-surface-raised px-3 py-1.5 text-xs text-text-primary">
                    <span>{d}</span>
                    <button type="button" onClick={() => setDonts(donts.filter((_, i) => i !== idx))} className="text-text-muted hover:text-status-danger">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDont}
                    onChange={(e) => setNewDont(e.target.value)}
                    placeholder="Add a prohibited item..."
                    className="flex-1 rounded-md border border-input-border bg-input-bg px-3 py-1.5 text-xs text-text-primary focus:border-brand-accent focus:outline-none"
                  />
                  <Button size="sm" variant="secondary" onClick={addDont}>
                    <Plus className="h-3.5 w-3.5" /> Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Asset Upload */}
      {currentStep === 4 && (
        <div className="space-y-6 rounded-lg border border-border bg-surface p-6">
          <h2 className="text-base font-semibold text-text-primary">Raw Footage &amp; Brand Assets</h2>
          
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-surface-raised/30 hover:bg-surface-raised/60 transition-colors cursor-pointer">
            <UploadCloud className="mx-auto h-10 w-10 text-brand-accent" />
            <p className="mt-2 text-sm font-medium text-text-primary">Drag and drop raw footage, logo PNGs, and audio stems</p>
            <p className="mt-1 text-xs text-text-muted">Direct S3 presigned upload (Up to 5GB per asset)</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Uploaded Asset Pool ({uploadedFiles.length})</p>
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-md border border-border bg-surface-raised px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-accent" />
                  <span className="font-medium text-text-primary">{file.name}</span>
                  <span className="text-text-muted">({file.size})</span>
                </div>
                <span className="text-[10px] rounded bg-status-success/10 text-status-success px-1.5 py-0.5 font-medium">Ready</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Escrow Budget Deposit */}
      {currentStep === 5 && (
        <div className="space-y-6 rounded-lg border border-border bg-surface p-6">
          <h2 className="text-base font-semibold text-text-primary">Escrow Fund Deposit</h2>
          <p className="text-xs text-text-muted">Funds are held securely via Stripe Connect and only released upon verified performance.</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-text-secondary">Campaign Budget ($)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                min={500}
                step={500}
                className="mt-1 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 font-mono text-sm text-text-primary tabular-nums focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="rounded-lg border border-border bg-surface-raised p-4 space-y-2">
              <div className="flex justify-between text-xs text-text-secondary">
                <span>Escrow Hold Amount:</span>
                <span className="font-mono font-semibold">${budget.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-xs text-text-secondary">
                <span>Estimated Slots Covered:</span>
                <span className="font-mono">{maxClippers} creators</span>
              </div>
              <div className="flex justify-between text-xs text-text-secondary">
                <span>Payment Custody:</span>
                <span className="text-status-success font-medium flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Stripe Connect Marketplace Escrow
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 6: Review & Launch */}
      {currentStep === 6 && (
        <div className="space-y-6 rounded-lg border border-border bg-surface p-6">
          <h2 className="text-base font-semibold text-text-primary">Review &amp; Authorize Escrow</h2>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MetricCard title="Escrow Deposit" value={`$${budget.toLocaleString()}.00`} subtitle="Held in escrow" />
            <MetricCard title="Payout Model" value={payoutType} subtitle={payoutType === 'PER_POST' ? `$${flatPayoutAmount}/post` : `$${cpmRate} CPM`} />
            <MetricCard title="Creator Capacity" value={`${maxClippers}`} subtitle="Slots available" />
          </div>

          <div className="rounded-md border border-border bg-surface-raised p-4 space-y-2 text-xs">
            <p className="font-medium text-text-primary">Campaign: {title || 'Untitled Campaign'}</p>
            <p className="text-text-secondary">Niche: {niche} • Attribution Window: {attributionDays} days</p>
            <p className="text-text-muted">{brief || 'No brief provided'}</p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        {currentStep > 1 ? (
          <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
          </Button>
        ) : <div />}

        {currentStep < 6 ? (
          <Button onClick={() => setCurrentStep(currentStep + 1)}>
            Continue <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        ) : (
          <Button disabled={loading} onClick={handleLaunch} className="bg-brand-accent hover:bg-brand-accent-hover text-white">
            {loading ? 'Funding Escrow & Launching...' : 'Authorize Escrow & Launch Campaign'}
          </Button>
        )}
      </div>
    </div>
  );
}

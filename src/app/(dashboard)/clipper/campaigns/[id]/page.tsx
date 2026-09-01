'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Download, 
  Lock, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  Upload,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCents } from '@/lib/utils/constants';

export default function ClipperCampaignDetail() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [claimed, setClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);

  // Mock campaign detail for clipper
  const campaign = {
    id: campaignId,
    title: 'Summer Activewear Reel Blitz',
    brandName: 'ActiveWear Official',
    niche: 'Fitness',
    payoutType: 'HYBRID',
    payoutAmountCents: 100_00,
    cpmRateCents: 15_00,
    slotsRemaining: 3,
    deadline: 'Sep 15, 2026',
    brief: 'Create high-energy 15-30s workout edits using our 4K gym footage. Focus on dynamic match-cuts to the beat. The goal is driving awareness for the new seamless compression collection.',
    guidelines: {
      dos: [
        'Include discount code ALEX20 in video overlay within first 5s',
        'Tag @ActiveWear in caption and add as Paid Partnership collaborator',
        'Use high-energy trending audio from commercial-safe library',
      ],
      donts: [
        'Do not blur the logo or alter brand color palette',
        'Do not use copyrighted non-cleared music',
        'No negative body commentary',
      ],
    },
    assets: [
      { name: 'gym_scene_squats_4k.mp4', size: '420 MB', key: 'assets/squats_4k.mp4' },
      { name: 'treadmill_cinematic_run_4k.mp4', size: '380 MB', key: 'assets/treadmill_4k.mp4' },
      { name: 'logo_vector_package.zip', size: '12 MB', key: 'assets/logo_pack.zip' },
    ],
  };

  const handleClaimSlot = () => {
    setClaiming(true);
    setTimeout(() => {
      setClaimed(true);
      setClaiming(false);
    }, 800);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-text-primary">{campaign.title}</h1>
            <span className="rounded bg-brand-accent/10 px-2 py-0.5 text-xs font-semibold text-brand-accent">
              {campaign.niche}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">By {campaign.brandName} • Deadline: {campaign.deadline}</p>
        </div>

        <div>
          {!claimed ? (
            <Button
              disabled={claiming}
              onClick={handleClaimSlot}
              className="bg-brand-accent hover:bg-brand-accent-hover text-white text-xs gap-1.5"
            >
              <Lock className="h-3.5 w-3.5" />
              {claiming ? 'Locking Slot...' : 'Claim Slot (48h Lock)'}
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-medium text-status-success">
                <CheckCircle2 className="h-4 w-4" /> Slot Claimed (47h 58m left)
              </span>
              <Button
                size="sm"
                onClick={() => router.push('/clipper/submissions')}
                className="bg-brand-accent text-white text-xs gap-1"
              >
                Submit Edit <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Payout & Terms Box */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 rounded-lg border border-border bg-surface p-4">
        <div>
          <p className="text-xs text-text-muted">Base Payout</p>
          <p className="font-mono text-base font-semibold text-text-primary tabular-nums">
            {formatCents(campaign.payoutAmountCents)} / approved post
          </p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Performance Bonus</p>
          <p className="font-mono text-base font-semibold text-status-success tabular-nums">
            ${(campaign.cpmRateCents / 100).toFixed(2)} CPM (per 1K views)
          </p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Escrow Custody</p>
          <p className="text-xs text-text-secondary flex items-center gap-1 mt-1 font-medium">
            <ShieldCheck className="h-4 w-4 text-brand-accent" /> 100% Pre-funded Escrow
          </p>
        </div>
      </div>

      {/* Creative Brief */}
      <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Creative Brief</h3>
        <p className="text-sm text-text-secondary leading-relaxed">{campaign.brief}</p>
      </div>

      {/* Guidelines Checklist */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
          <p className="text-xs font-semibold text-status-success uppercase tracking-wider">Do&apos;s</p>
          <ul className="space-y-1.5 text-xs text-text-secondary">
            {campaign.guidelines.dos.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-status-success">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
          <p className="text-xs font-semibold text-status-danger uppercase tracking-wider">Don&apos;ts</p>
          <ul className="space-y-1.5 text-xs text-text-secondary">
            {campaign.guidelines.donts.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-status-danger">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Asset Download Pool */}
      <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Raw Asset Downloads</h3>
          {!claimed && (
            <span className="text-xs text-text-muted flex items-center gap-1">
              <Lock className="h-3 w-3" /> Unlocked upon claiming slot
            </span>
          )}
        </div>

        <div className="space-y-2">
          {campaign.assets.map((asset, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-md border border-border bg-surface-raised px-3 py-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-accent" />
                <span className="font-medium text-text-primary">{asset.name}</span>
                <span className="text-text-muted">({asset.size})</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={!claimed}
                className="h-7 text-xs gap-1"
                onClick={() => alert(`Downloading signed URL: ${asset.name}`)}
              >
                <Download className="h-3 w-3" /> Download
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

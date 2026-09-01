'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw, 
  ExternalLink, 
  FileText, 
  Scale, 
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCents } from '@/lib/utils/constants';
import { useToast } from '@/components/ui/toast';

export default function AdminDisputesPage() {
  const { toast } = useToast();
  const [selectedDispute, setSelectedDispute] = useState<string>('disp-101');
  const [resolving, setResolving] = useState(false);

  const [disputes, setDisputes] = useState([
    {
      id: 'disp-101',
      campaignTitle: 'Summer Activewear Reel Blitz',
      brandName: 'ActiveWear Official',
      clipperName: 'Jake Studio Edits',
      clipperHandle: 'jake_edits_official',
      submissionId: 'sub-948',
      reason: 'SUSPECTED_VIEW_FRAUD',
      description: 'Brand claims 80,000 views appeared within 45 minutes with 0 comment velocity.',
      amountContestedCents: 1200_00,
      riskScore: 82,
      status: 'PENDING_ARBITRATION',
      videoUrl: 'https://instagram.com/reel/C928_suspicious',
      views: 84200,
      likes: 12,
      comments: 0,
      engagementRate: 0.01,
    },
    {
      id: 'disp-102',
      campaignTitle: 'Glow Serum Before & After Challenge',
      brandName: 'Lumiere Beauty',
      clipperName: 'Sarah Visuals',
      clipperHandle: 'sarah_glow_cuts',
      submissionId: 'sub-881',
      reason: 'WRONGFUL_REJECTION',
      description: 'Clipper claims edit fully complied with all 3 brand guidelines, but was rejected without feedback.',
      amountContestedCents: 250_00,
      riskScore: 15,
      status: 'PENDING_ARBITRATION',
      videoUrl: 'https://instagram.com/reel/C881_legit',
      views: 22100,
      likes: 1420,
      comments: 88,
      engagementRate: 6.82,
    },
  ]);

  const active = disputes.find((d) => d.id === selectedDispute) || disputes[0];

  const handleResolve = async (ruling: 'DISBURSE_CLIPPER' | 'REFUND_BRAND' | 'SPLIT_SETTLEMENT') => {
    try {
      setResolving(true);
      const res = await fetch(`/api/disputes/${active.id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruling }),
      });

      if (!res.ok) throw new Error('Arbitration failed');

      setDisputes((prev) =>
        prev.map((d) => (d.id === active.id ? { ...d, status: 'RESOLVED' } : d))
      );

      toast({
        type: 'success',
        title: 'Arbitration Ruling Applied',
        description: `Dispute ${active.id} resolved with ${ruling.replace('_', ' ')}. Escrow funds re-allocated.`,
      });
    } catch {
      toast({
        type: 'error',
        title: 'Error',
        description: 'Failed to apply arbitration ruling.',
      });
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Dispute Arbitration Console</h1>
        <p className="text-sm text-text-muted">Arbitrate contested campaign submissions, bot velocity flags, and wrongful rejections.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Queue */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Active Disputes ({disputes.length})</h2>
          <div className="space-y-2">
            {disputes.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDispute(d.id)}
                className={`w-full text-left rounded-lg border p-3.5 transition-colors ${
                  selectedDispute === d.id
                    ? 'border-brand-accent bg-surface shadow-sm'
                    : 'border-border bg-surface/50 hover:bg-surface'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold text-text-primary">{d.campaignTitle}</span>
                  <span className="font-mono text-xs font-semibold text-text-primary tabular-nums">
                    {formatCents(d.amountContestedCents)}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted mt-1">{d.brandName} vs. @{d.clipperHandle}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    d.riskScore > 70 ? 'bg-status-danger/10 text-status-danger' : 'bg-status-success/10 text-status-success'
                  }`}>
                    Fraud Risk: {d.riskScore}%
                  </span>
                  <StatusBadge type="claim" status={d.status} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Dossier & Ruling Panel */}
        <div className="lg:col-span-8 rounded-lg border border-border bg-surface p-6 space-y-6">
          <div className="flex items-start justify-between border-b border-border pb-4">
            <div>
              <span className="text-[11px] font-mono text-text-muted">CASE ID: {active.id}</span>
              <h2 className="text-base font-semibold text-text-primary mt-0.5">{active.campaignTitle}</h2>
              <p className="text-xs text-text-muted">Parties: <strong className="text-text-secondary">{active.brandName}</strong> (Brand) &bull; <strong className="text-text-secondary">@{active.clipperHandle}</strong> (Creator)</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-text-muted">Contested Amount</span>
              <p className="font-mono text-lg font-bold text-text-primary tabular-nums">
                {formatCents(active.amountContestedCents)}
              </p>
            </div>
          </div>

          {/* Telemetry Box */}
          <div className="rounded-lg border border-border bg-surface-raised p-4 space-y-3">
            <h3 className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
              <Scale className="h-4 w-4 text-brand-accent" />
              Automated Fraud &amp; Engagement Telemetry
            </h3>
            <div className="grid grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-text-muted">Views</span>
                <p className="font-mono font-bold text-text-primary">{active.views.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-text-muted">Likes</span>
                <p className="font-mono font-bold text-text-primary">{active.likes.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-text-muted">Comments</span>
                <p className="font-mono font-bold text-text-primary">{active.comments}</p>
              </div>
              <div>
                <span className="text-text-muted">Engagement Rate</span>
                <p className={`font-mono font-bold ${active.engagementRate < 0.2 ? 'text-status-danger' : 'text-status-success'}`}>
                  {active.engagementRate}%
                </p>
              </div>
            </div>
            {active.riskScore > 70 && (
              <p className="text-xs text-status-danger bg-status-danger/10 p-2 rounded flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                High probability of artificial view delivery. Engagement is under 0.05%.
              </p>
            )}
          </div>

          {/* Dispute Description */}
          <div className="space-y-1 text-xs">
            <span className="font-semibold text-text-primary">Dispute Claim Statement:</span>
            <p className="text-text-secondary bg-surface p-3 rounded border border-border leading-relaxed">{active.description}</p>
          </div>

          {/* Ruling Actions */}
          <div className="border-t border-border pt-4 space-y-3">
            <span className="text-xs font-semibold text-text-primary">Admin Arbitration Ruling:</span>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="sm"
                disabled={resolving || active.status === 'RESOLVED'}
                onClick={() => handleResolve('REFUND_BRAND')}
                className="bg-status-danger hover:bg-status-danger/90 text-white text-xs gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Full Refund to Brand (Reject Traffic)
              </Button>

              <Button
                size="sm"
                disabled={resolving || active.status === 'RESOLVED'}
                onClick={() => handleResolve('DISBURSE_CLIPPER')}
                className="bg-status-success hover:bg-status-success/90 text-white text-xs gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Disburse 100% to Creator
              </Button>

              <Button
                size="sm"
                variant="outline"
                disabled={resolving || active.status === 'RESOLVED'}
                onClick={() => handleResolve('SPLIT_SETTLEMENT')}
                className="text-xs gap-1.5"
              >
                50/50 Split Settlement
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

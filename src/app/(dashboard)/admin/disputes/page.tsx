'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw, 
  ExternalLink, 
  FileText, 
  Scale, 
  DollarSign,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCents } from '@/lib/utils/constants';
import { useToast } from '@/components/ui/toast';

interface DisputeItem {
  id: string;
  campaignTitle: string;
  brandName: string;
  clipperName: string;
  clipperHandle: string;
  submissionId: string;
  disputeReason: string;
  description: string;
  amountContestedCents: number;
  riskScore: number;
  status: string;
  videoUrl?: string;
  views?: number;
  likes?: number;
  comments?: number;
  engagementRate?: number;
}

export default function AdminDisputesPage() {
  const { toast } = useToast();
  const [disputes, setDisputes] = useState<DisputeItem[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/disputes');
      if (res.ok) {
        const json = await res.json();
        setDisputes(json.data || []);
        if (json.data && json.data.length > 0) {
          setSelectedDispute(json.data[0].id);
        }
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const active = disputes.find((d) => d.id === selectedDispute);

  const handleResolve = async (ruling: 'DISBURSE_CLIPPER' | 'REFUND_BRAND' | 'SPLIT_SETTLEMENT') => {
    if (!active) return;
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

      {disputes.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-12 text-center space-y-3">
          <CheckCircle2 className="mx-auto h-8 w-8 text-status-success" />
          <h3 className="text-sm font-semibold text-text-primary">All Dispute Queues Clear</h3>
          <p className="text-xs text-text-muted">There are currently no active dispute arbitration cases or quarantined traffic submissions.</p>
        </div>
      ) : (
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
                    <StatusBadge type="claim" status={d.status as any} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Dossier & Ruling Panel */}
          {active && (
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

              {/* Dispute Description */}
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-text-primary">Dispute Claim Statement:</span>
                <p className="text-text-secondary bg-surface-raised p-3 rounded border border-border leading-relaxed">{active.description}</p>
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
                    <RotateCcw className="h-3.5 w-3.5" /> Full Refund to Brand
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
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Megaphone, 
  Users, 
  DollarSign, 
  Eye, 
  Clock, 
  Play, 
  CheckCircle2, 
  ShieldCheck,
  Download
} from 'lucide-react';
import { MetricCard } from '@/components/shared/metric-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { VerificationTimeline } from '@/components/tracking/verification-timeline';
import { SubmissionReviewPanel } from '@/components/campaign/submission-review-panel';
import { Button } from '@/components/ui/button';

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const [activeTab, setActiveTab] = useState<'submissions' | 'tracking' | 'assets'>('submissions');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState('sub-1');

  // Mock campaign detail
  const campaign = {
    id: campaignId,
    title: 'Summer Activewear Reel Blitz',
    niche: 'Fitness',
    status: 'ACTIVE',
    budget: 5000_00,
    budgetSpent: 2150_00,
    escrowBalance: 2850_00,
    totalReach: 148_500,
    slotsTotal: 10,
    slotsClaimed: 7,
    attributionWindowDays: 7,
  };

  // Mock submissions queue
  const [submissions, setSubmissions] = useState([
    {
      id: 'sub-1',
      clipperName: 'Alex Creator',
      clipperHandle: 'alex_edits_fit',
      submittedAt: 'Sep 01, 2026',
      videoUrl: 'https://s3.amazonaws.com/clipbridge/submissions/alex_edit_v2.mp4',
      caption: 'Pushing past limits with @ActiveWear 🔥 Use code ALEX20 for 20% off! #ad #paidpartnership #activewear',
      status: 'PENDING',
      paidPartnershipConfirmed: true,
      brandBrief: {
        title: campaign.title,
        requiredTags: ['@ActiveWear', '#activewear'],
        dosAndDonts: [
          'Highlight discount code in first 5 seconds',
          'Ensure high-energy transition during second rep',
          'Paid partnership tag clearly visible on post',
        ],
      },
    },
    {
      id: 'sub-2',
      clipperName: 'Maya Visuals',
      clipperHandle: 'maya_gymtok',
      submittedAt: 'Aug 30, 2026',
      videoUrl: 'https://s3.amazonaws.com/clipbridge/submissions/maya_final.mp4',
      caption: 'Morning routine unlocked. Get the look @ActiveWear #ad',
      status: 'APPROVED',
      paidPartnershipConfirmed: true,
      brandBrief: {
        title: campaign.title,
        requiredTags: ['@ActiveWear'],
        dosAndDonts: ['Paid partnership tag clearly visible on post'],
      },
    },
  ]);

  const currentSubmission = submissions.find((s) => s.id === selectedSubmissionId) || submissions[0];

  const handleApprove = async (id: string, comments?: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'APPROVED' } : s))
    );
  };

  const handleReject = async (id: string, comments: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'REJECTED' } : s))
    );
  };

  return (
    <div className="space-y-6">
      {/* Campaign Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-bold text-text-primary">{campaign.title}</h1>
            <StatusBadge type="campaign" status={campaign.status} />
          </div>
          <p className="text-xs text-text-muted">Niche: {campaign.niche} • ID: {campaignId}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" /> Export Report (CSV)
          </Button>
        </div>
      </div>

      {/* Campaign Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Escrow Held" value={`$${(campaign.escrowBalance / 100).toFixed(2)}`} subtitle="Secured via Stripe" />
        <MetricCard title="Spend to Date" value={`$${(campaign.budgetSpent / 100).toFixed(2)}`} subtitle="Released payouts" />
        <MetricCard title="Total Verified Reach" value={campaign.totalReach.toLocaleString()} subtitle="Across 4 live posts" />
        <MetricCard title="Creator Slots" value={`${campaign.slotsClaimed} / ${campaign.slotsTotal}`} subtitle="Slots claimed" />
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border text-sm">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`border-b-2 px-4 py-2 font-medium transition-colors ${
            activeTab === 'submissions'
              ? 'border-brand-accent text-brand-accent'
              : 'border-transparent text-text-muted hover:text-text-secondary'
          }`}
        >
          Review Submissions ({submissions.filter((s) => s.status === 'PENDING').length} Pending)
        </button>
        <button
          onClick={() => setActiveTab('tracking')}
          className={`border-b-2 px-4 py-2 font-medium transition-colors ${
            activeTab === 'tracking'
              ? 'border-brand-accent text-brand-accent'
              : 'border-transparent text-text-muted hover:text-text-secondary'
          }`}
        >
          Attribution &amp; Performance
        </button>
      </div>

      {/* Submissions Review Tab */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {submissions.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubmissionId(sub.id)}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedSubmissionId === sub.id
                    ? 'border-brand-accent bg-brand-accent/10 text-brand-accent'
                    : 'border-border bg-surface text-text-secondary hover:bg-surface-raised'
                }`}
              >
                {sub.clipperName} ({sub.status})
              </button>
            ))}
          </div>

          <SubmissionReviewPanel
            submission={currentSubmission}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      )}

      {/* Tracking Tab */}
      {activeTab === 'tracking' && (
        <div className="space-y-6">
          <VerificationTimeline currentStep="TRACKING" daysRemaining={4} currentViews={48200} />
          
          <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Live Tracked Instagram Reels</h3>
            <div className="overflow-hidden rounded-md border border-border">
              <table className="w-full text-xs">
                <thead className="border-b border-border bg-surface-raised text-text-muted">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Creator</th>
                    <th className="px-3 py-2 text-left font-medium">Live Reel URL</th>
                    <th className="px-3 py-2 text-right font-medium">Views</th>
                    <th className="px-3 py-2 text-right font-medium">Likes</th>
                    <th className="px-3 py-2 text-right font-medium">Est. Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  <tr>
                    <td className="px-3 py-2 font-medium text-text-primary">alex_edits_fit</td>
                    <td className="px-3 py-2 font-mono text-brand-accent hover:underline cursor-pointer">
                      instagram.com/reel/C89xK1...
                    </td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">48,200</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">3,850</td>
                    <td className="px-3 py-2 text-right font-mono font-semibold text-status-success tabular-nums">$723.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

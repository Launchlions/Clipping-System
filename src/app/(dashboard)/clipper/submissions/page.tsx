'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileCheck, 
  UploadCloud, 
  Link as LinkIcon, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Play,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { VerificationTimeline } from '@/components/tracking/verification-timeline';
import { formatCents } from '@/lib/utils/constants';

export default function ClipperSubmissionsPage() {
  const [showSubmitLiveUrl, setShowSubmitLiveUrl] = useState(false);
  const [liveReelUrl, setLiveReelUrl] = useState('');
  const [submittingUrl, setSubmittingUrl] = useState(false);

  const [submissions, setSubmissions] = useState([
    {
      id: 'sub-1',
      campaignTitle: 'Summer Activewear Reel Blitz',
      brandName: 'ActiveWear Official',
      status: 'APPROVED', // Ready for creator to post to Instagram
      submittedAt: 'Sep 01, 2026',
      liveUrl: '',
      payoutAmountCents: 100_00,
      cpmRateCents: 15_00,
      views: 0,
      reviewComments: 'Great edit! Approved for Instagram. Please post and submit your live Reel link below.',
    },
    {
      id: 'sub-2',
      campaignTitle: 'Glow Serum Before & After Edit Challenge',
      brandName: 'Lumiere Beauty',
      status: 'PUBLISHED', // Live and tracking
      submittedAt: 'Aug 26, 2026',
      liveUrl: 'https://instagram.com/reel/C8921_example',
      payoutAmountCents: 250_00,
      cpmRateCents: 0,
      views: 34_800,
      reviewComments: 'Approved on first review.',
    },
    {
      id: 'sub-3',
      campaignTitle: 'High-Protein Ready Meal Taste Test Cuts',
      brandName: 'MacroFit Nutrition',
      status: 'PAID',
      submittedAt: 'Aug 14, 2026',
      liveUrl: 'https://instagram.com/reel/C7123_example',
      payoutAmountCents: 180_00,
      cpmRateCents: 0,
      views: 62_100,
      reviewComments: 'Paid out to Stripe Express on Aug 21.',
    },
  ]);

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveReelUrl.includes('instagram.com')) {
      alert('Please enter a valid Instagram Reel URL');
      return;
    }

    setSubmittingUrl(true);
    setTimeout(() => {
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === 'sub-1'
            ? { ...s, status: 'PUBLISHED', liveUrl: liveReelUrl, views: 1200 }
            : s
        )
      );
      setSubmittingUrl(false);
      setShowSubmitLiveUrl(false);
      setLiveReelUrl('');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">My Submissions</h1>
          <p className="text-sm text-text-muted">Track edits, submit live links, and monitor performance verification.</p>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {submissions.map((sub) => (
          <div key={sub.id} className="rounded-lg border border-border bg-surface p-5 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">{sub.campaignTitle}</h3>
                <p className="text-xs text-text-muted">{sub.brandName} • Submitted {sub.submittedAt}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge type="submission" status={sub.status} />
              </div>
            </div>

            {/* If Approved, show callout to submit live link */}
            {sub.status === 'APPROVED' && (
              <div className="rounded-md border border-status-success/30 bg-status-success-bg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-status-success">✓ Content Approved by Brand!</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Publish your edit to Instagram with the required tags, then submit your live Reel URL to start view tracking.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowSubmitLiveUrl(true)}
                  className="bg-brand-accent hover:bg-brand-accent-hover text-white text-xs gap-1.5 shrink-0"
                >
                  <LinkIcon className="h-3.5 w-3.5" /> Submit Live Reel URL
                </Button>
              </div>
            )}

            {/* If Live/Tracking, show timeline */}
            {sub.status === 'PUBLISHED' && (
              <div className="space-y-3">
                <VerificationTimeline currentStep="TRACKING" daysRemaining={5} currentViews={sub.views} />
                <div className="flex items-center justify-between text-xs text-text-muted px-1">
                  <span className="flex items-center gap-1 font-mono text-brand-accent">
                    <ExternalLink className="h-3.5 w-3.5" /> {sub.liveUrl}
                  </span>
                  <span className="font-mono text-status-success font-semibold">
                    Est. Payout: {formatCents(sub.payoutAmountCents + (sub.views / 1000) * sub.cpmRateCents)}
                  </span>
                </div>
              </div>
            )}

            {/* If Paid */}
            {sub.status === 'PAID' && (
              <div className="rounded-md border border-border bg-surface-raised p-3 flex items-center justify-between text-xs">
                <span className="text-text-secondary">Attribution window concluded. Total views: {sub.views.toLocaleString()}</span>
                <span className="font-mono font-bold text-status-success tabular-nums">
                  Paid: {formatCents(sub.payoutAmountCents)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for Submitting Live URL */}
      {showSubmitLiveUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-semibold text-text-primary">Submit Live Instagram Reel URL</h3>
            <p className="text-xs text-text-muted">
              Paste the public link to your published Instagram Reel. Our tracking engine will verify the post and begin hourly view snapshots.
            </p>

            <form onSubmit={handleLinkSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-text-secondary">Instagram Reel Link</label>
                <input
                  type="url"
                  required
                  value={liveReelUrl}
                  onChange={(e) => setLiveReelUrl(e.target.value)}
                  placeholder="https://www.instagram.com/reel/C89..."
                  className="mt-1 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-xs text-text-primary focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowSubmitLiveUrl(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submittingUrl} className="bg-brand-accent text-white">
                  {submittingUrl ? 'Verifying Link...' : 'Submit for Tracking'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

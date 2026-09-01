'use client';

import React, { useState } from 'react';
import { Check, X, MessageSquare, AlertTriangle, ShieldCheck, ExternalLink, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { cn } from '@/lib/utils/cn';

interface SubmissionReviewPanelProps {
  submission: {
    id: string;
    clipperName: string;
    clipperHandle: string;
    submittedAt: string;
    videoUrl: string;
    caption: string;
    status: string;
    paidPartnershipConfirmed: boolean;
    brandBrief: {
      title: string;
      requiredTags: string[];
      dosAndDonts: string[];
    };
  };
  onApprove: (id: string, comments?: string) => Promise<void>;
  onReject: (id: string, comments: string) => Promise<void>;
}

export function SubmissionReviewPanel({ submission, onApprove, onReject }: SubmissionReviewPanelProps) {
  const [comment, setComment] = useState('');
  const [partnershipChecked, setPartnershipChecked] = useState(submission.paidPartnershipConfirmed);
  const [submitting, setSubmitting] = useState(false);

  async function handleApprove() {
    if (!partnershipChecked) {
      alert('You must verify that the content complies with the Paid Partnership disclosure before approving.');
      return;
    }
    setSubmitting(true);
    await onApprove(submission.id, comment);
    setSubmitting(false);
  }

  async function handleReject() {
    if (!comment.trim()) {
      alert('Please provide feedback comments explaining why this edit was rejected.');
      return;
    }
    setSubmitting(true);
    await onReject(submission.id, comment);
    setSubmitting(false);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left side: Media preview */}
      <div className="lg:col-span-7 flex flex-col space-y-4">
        <div className="overflow-hidden rounded-lg border border-border bg-black/90 p-4 aspect-[9/16] max-h-[520px] flex flex-col items-center justify-center relative">
          <div className="text-center text-text-muted">
            <Play className="mx-auto h-12 w-12 text-white/70 mb-2 hover:text-white cursor-pointer transition-colors" />
            <p className="text-xs text-white/60">Preview Edit Submission</p>
            <p className="text-[10px] text-white/40 mt-1 font-mono">{submission.videoUrl}</p>
          </div>
          
          <div className="absolute bottom-3 left-3 right-3 rounded bg-black/60 backdrop-blur-sm p-2 text-left">
            <p className="text-xs text-white/90 font-medium">Caption preview:</p>
            <p className="text-[11px] text-white/70 line-clamp-2 mt-0.5">{submission.caption}</p>
          </div>
        </div>
      </div>

      {/* Right side: PR-Style Review & Checklist */}
      <div className="lg:col-span-5 flex flex-col space-y-5">
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text-primary">{submission.clipperName}</p>
              <p className="text-xs text-text-muted">@{submission.clipperHandle}</p>
            </div>
            <StatusBadge type="submission" status={submission.status} />
          </div>
          <p className="text-[11px] text-text-muted">Submitted on {submission.submittedAt}</p>
        </div>

        {/* Campaign Guidelines Checklist */}
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Guidelines Checklist</h4>
          <div className="space-y-2 text-xs">
            {submission.brandBrief.dosAndDonts.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
                <span className="text-text-secondary">{rule}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-border-subtle">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={partnershipChecked}
                onChange={(e) => setPartnershipChecked(e.target.checked)}
                className="mt-0.5 rounded border-border text-brand-accent focus:ring-brand-accent"
              />
              <span className="text-xs text-text-primary leading-tight">
                <strong className="font-medium">Paid Partnership disclosure verified:</strong> Content includes required brand tag and FTC/Meta sponsorship tag.
              </span>
            </label>
          </div>
        </div>

        {/* Review comment & actions */}
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
          <label className="text-xs font-medium text-text-secondary">Feedback / Change Requests</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add comments for the creator (required if requesting changes)..."
            rows={3}
            className="w-full rounded-md border border-input-border bg-input-bg p-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring resize-none"
          />

          <div className="flex gap-2 pt-2">
            <Button
              variant="destructive"
              size="sm"
              disabled={submitting}
              onClick={handleReject}
              className="flex-1 gap-1.5 text-xs"
            >
              <X className="h-3.5 w-3.5" />
              Request Changes
            </Button>
            <Button
              size="sm"
              disabled={submitting}
              onClick={handleApprove}
              className="flex-1 gap-1.5 text-xs bg-status-success hover:bg-status-success/90 text-white"
            >
              <Check className="h-3.5 w-3.5" />
              Approve for Publishing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

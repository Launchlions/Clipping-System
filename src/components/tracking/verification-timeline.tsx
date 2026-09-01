import React from 'react';
import { CheckCircle2, Clock, Eye, AlertCircle, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type VerificationStep = 'SUBMITTED' | 'APPROVED' | 'LIVE_VERIFIED' | 'TRACKING' | 'ATTRIBUTION_CLOSED' | 'PAID';

interface TimelineStep {
  key: VerificationStep;
  label: string;
  description: string;
}

const STEPS: TimelineStep[] = [
  { key: 'SUBMITTED', label: 'Submitted', description: 'Content uploaded for review' },
  { key: 'APPROVED', label: 'Brand Approved', description: 'Greenlit for Instagram' },
  { key: 'LIVE_VERIFIED', label: 'Live Link Verified', description: 'Reel detected & valid' },
  { key: 'TRACKING', label: 'Tracking Reach', description: 'Attribution window open' },
  { key: 'ATTRIBUTION_CLOSED', label: 'Attribution Closed', description: 'Final view count locked' },
  { key: 'PAID', label: 'Escrow Released', description: 'Payout routed to Stripe' },
];

interface VerificationTimelineProps {
  currentStep: VerificationStep;
  daysRemaining?: number;
  currentViews?: number;
  className?: string;
}

export function VerificationTimeline({
  currentStep,
  daysRemaining,
  currentViews,
  className,
}: VerificationTimelineProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className={cn('rounded-lg border border-border bg-surface p-5', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Verification & Payout Timeline</h3>
        {currentStep === 'TRACKING' && (
          <div className="flex items-center gap-3">
            {daysRemaining !== undefined && (
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-raised px-2.5 py-0.5 font-mono text-xs text-text-secondary tabular-nums">
                <Clock className="h-3 w-3 text-brand-accent" />
                {daysRemaining}d window left
              </span>
            )}
            {currentViews !== undefined && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-accent/10 px-2.5 py-0.5 font-mono text-xs font-medium text-brand-accent tabular-nums">
                <Eye className="h-3 w-3" />
                {currentViews.toLocaleString()} views
              </span>
            )}
          </div>
        )}
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isPending = idx > currentIndex;

            return (
              <div key={step.key} className="relative flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                      isCompleted && 'bg-status-success text-white',
                      isCurrent && 'border-2 border-brand-accent bg-surface text-brand-accent',
                      isPending && 'border border-border bg-surface-raised text-text-muted'
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      isCurrent && 'text-brand-accent font-semibold',
                      isCompleted && 'text-text-primary',
                      isPending && 'text-text-muted'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                <p className="mt-1 pl-8 text-[11px] leading-tight text-text-muted">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

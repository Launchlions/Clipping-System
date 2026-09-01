'use client';

import { useState } from 'react';

export interface SubmissionPayload {
  claimId: string;
  videoUrl: string;
  caption?: string;
  paidPartnershipConfirmed: boolean;
}

export function useSubmissions() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitVideo = async (payload: SubmissionPayload) => {
    try {
      setSubmitting(true);
      setError(null);
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit content');
      }

      return await res.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const reviewSubmission = async (submissionId: string, action: 'APPROVE' | 'REJECT', comments?: string) => {
    const res = await fetch(`/api/submissions/${submissionId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, comments }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit review');
    }

    return await res.json();
  };

  const submitLiveLink = async (submissionId: string, liveUrl: string) => {
    const res = await fetch(`/api/submissions/${submissionId}/live-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ liveUrl }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to verify live link');
    }

    return await res.json();
  };

  return {
    submitting,
    error,
    submitVideo,
    reviewSubmission,
    submitLiveLink,
  };
}

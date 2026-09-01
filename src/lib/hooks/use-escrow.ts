'use client';

import { useState } from 'react';

export function useEscrow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const depositEscrow = async (campaignId: string, amountCents: number) => {
    try {
      setLoading(true);
      const res = await fetch('/api/escrow/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId, amountCents }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Deposit failed');
      }

      return await res.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const releasePayout = async (payload: {
    campaignId: string;
    clipperId: string;
    submissionId?: string;
    totalAmountCents: number;
  }) => {
    try {
      setLoading(true);
      const res = await fetch('/api/escrow/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Payout release failed');
      }

      return await res.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    depositEscrow,
    releasePayout,
  };
}

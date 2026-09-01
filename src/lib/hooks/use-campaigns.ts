'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CampaignData {
  id: string;
  title: string;
  brandName: string;
  niche: string;
  payoutType: string;
  payoutAmountCents: number;
  cpmRateCents: number;
  budgetCents: number;
  budgetSpentCents: number;
  slotsTotal: number;
  slotsClaimed: number;
  status: string;
  escrowStatus: string;
  attributionWindowDays: number;
  createdAt: string;
}

export function useCampaigns(initialNiche = 'ALL') {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNiche, setSelectedNiche] = useState(initialNiche);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const url = selectedNiche === 'ALL' ? '/api/campaigns' : `/api/campaigns?niche=${encodeURIComponent(selectedNiche)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load campaigns');
      const json = await res.json();
      setCampaigns(json.data || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching campaigns');
    } finally {
      setLoading(false);
    }
  }, [selectedNiche]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const createCampaign = async (payload: Partial<CampaignData>) => {
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create campaign');
    }
    const json = await res.json();
    setCampaigns((prev) => [json.campaign, ...prev]);
    return json.campaign;
  };

  const claimSlot = async (campaignId: string) => {
    const res = await fetch(`/api/campaigns/${campaignId}/claim`, {
      method: 'POST',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to claim slot');
    }
    const json = await res.json();
    // Update local state optimistically
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId ? { ...c, slotsClaimed: c.slotsClaimed + 1 } : c
      )
    );
    return json.claim;
  };

  return {
    campaigns,
    loading,
    error,
    selectedNiche,
    setSelectedNiche,
    refresh: fetchCampaigns,
    createCampaign,
    claimSlot,
  };
}

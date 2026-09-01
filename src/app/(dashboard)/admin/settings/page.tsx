'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sliders, 
  Percent, 
  Server, 
  AlertTriangle, 
  CheckCircle2, 
  Save 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminSettingsPage() {
  const [commissionRate, setCommissionRate] = useState(15);
  const [fraudThreshold, setFraudThreshold] = useState(25000); // 25k views/10m spike
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Platform System Settings</h1>
        <p className="text-sm text-text-muted">Global marketplace parameters, risk thresholds, and compliance configurations.</p>
      </div>

      {/* Global Marketplace Commission */}
      <div className="rounded-lg border border-border bg-surface p-5 space-y-4 text-xs">
        <h3 className="text-sm font-semibold text-text-primary">Marketplace Commission Protocol</h3>
        <p className="text-text-muted">Platform fee deducted from gross campaign payouts upon verified attribution close.</p>

        <div className="max-w-xs space-y-2">
          <label className="font-medium text-text-secondary">Platform Commission Rate (%)</label>
          <div className="flex gap-2">
            <input
              type="number"
              min={5}
              max={30}
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              className="w-full rounded-md border border-input-border bg-input-bg p-2 font-mono text-text-primary focus:border-brand-accent focus:outline-none"
            />
            <Button size="sm" className="bg-brand-accent text-white" onClick={() => alert(`Commission rate updated to ${commissionRate}%.`)}>
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Automated Bot & Fraud Thresholds */}
      <div className="rounded-lg border border-border bg-surface p-5 space-y-4 text-xs">
        <h3 className="text-sm font-semibold text-text-primary">Fraud Detection &amp; Bot Heuristics</h3>
        <p className="text-text-muted">Velocity spike triggers for automatic payout holds and manual dispute queue routing.</p>

        <div className="max-w-xs space-y-2">
          <label className="font-medium text-text-secondary">Abnormal Velocity Spike Trigger (Views / 10 mins)</label>
          <input
            type="number"
            step={5000}
            value={fraudThreshold}
            onChange={(e) => setFraudThreshold(Number(e.target.value))}
            className="w-full rounded-md border border-input-border bg-input-bg p-2 font-mono text-text-primary focus:border-brand-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Third-Party Service Health */}
      <div className="rounded-lg border border-border bg-surface p-5 space-y-4 text-xs">
        <h3 className="text-sm font-semibold text-text-primary">External Integrations &amp; Health</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-md border border-border bg-surface-raised">
            <div>
              <p className="font-semibold text-text-primary">Stripe Connect Custody Engine</p>
              <p className="text-text-muted">Escrow holds, split payouts, and KYC Express verification</p>
            </div>
            <span className="text-status-success font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Operational
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-md border border-border bg-surface-raised">
            <div>
              <p className="font-semibold text-text-primary">Meta / Instagram Graph API</p>
              <p className="text-text-muted">Reel view polling, Creator OAuth, and Paid Partnership verification</p>
            </div>
            <span className="text-status-success font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Operational
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-md border border-border bg-surface-raised">
            <div>
              <p className="font-semibold text-text-primary">AWS S3 Raw Footage Pipeline</p>
              <p className="text-text-muted">Presigned upload URLs and background watermarking worker</p>
            </div>
            <span className="text-status-success font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

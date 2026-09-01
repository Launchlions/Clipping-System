'use client';

import React, { useState } from 'react';
import { 
  Building, 
  CreditCard, 
  Users, 
  Key, 
  ShieldCheck, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Copy, 
  RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';

export default function BrandSettingsPage() {
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'team' | 'api' | 'privacy'>('profile');

  // Form states
  const [companyName, setCompanyName] = useState('Acme Corporation');
  const [website, setWebsite] = useState('https://acme.com');
  const [industry, setIndustry] = useState('Fashion & Apparel');
  const [billingEmail, setBillingEmail] = useState('billing@acme.com');
  const [apiKey, setApiKey] = useState('cb_live_99f82a17b0198c2983e01a');

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const regenerateKey = () => {
    if (confirm('Are you sure you want to regenerate your API key? Any active integrations will need to be updated.')) {
      setApiKey(`cb_live_${Math.random().toString(36).substring(2, 12)}`);
      alert('API Key regenerated successfully.');
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Brand Settings</h1>
        <p className="text-sm text-text-muted">Manage company profile, KYB verification, billing, team, and security.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border text-xs">
        {[
          { id: 'profile', label: 'Company Profile & KYB' },
          { id: 'billing', label: 'Billing & Escrow' },
          { id: 'team', label: 'Team Members' },
          { id: 'api', label: 'API & Webhooks' },
          { id: 'privacy', label: 'Privacy & GDPR' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`border-b-2 px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-brand-accent text-brand-accent font-semibold'
                : 'border-transparent text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Profile & KYB */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Business Entity (KYB)</h3>
                <p className="text-xs text-text-muted">Verified commercial entity for escrow custody compliance.</p>
              </div>
              <StatusBadge type="kyc" status="VERIFIED" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
              <div>
                <label className="font-medium text-text-secondary block mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-md border border-input-border bg-input-bg p-2 text-text-primary focus:border-brand-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-text-secondary block mb-1">Corporate Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full rounded-md border border-input-border bg-input-bg p-2 text-text-primary focus:border-brand-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-text-secondary block mb-1">Primary Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full rounded-md border border-input-border bg-input-bg p-2 text-text-primary focus:border-brand-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-text-secondary block mb-1">Billing Email</label>
                <input
                  type="email"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  className="w-full rounded-md border border-input-border bg-input-bg p-2 text-text-primary focus:border-brand-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" className="bg-brand-accent text-white text-xs" onClick={() => alert('Company profile updated.')}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Billing & Escrow */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Payment Methods &amp; Invoicing</h3>
            <p className="text-xs text-text-muted">Cards on file for escrow pre-funding and monthly reconciliation invoices.</p>

            <div className="rounded-md border border-border bg-surface-raised p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-brand-accent" />
                <div>
                  <p className="font-semibold text-text-primary">Corporate Visa ending in 9012</p>
                  <p className="text-text-muted">Expires 12/28 • Default for escrow deposits</p>
                </div>
              </div>
              <span className="rounded bg-status-success/10 text-status-success px-2 py-0.5 font-semibold text-[10px]">
                PRIMARY
              </span>
            </div>

            <Button variant="outline" size="sm" className="text-xs" onClick={() => alert('Opening Stripe Elements payment modal...')}>
              + Add Backup Payment Method
            </Button>
          </div>
        </div>
      )}

      {/* 3. Team Members */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Team Management</h3>
                <p className="text-xs text-text-muted">Grant campaign creation and submission review permissions.</p>
              </div>
              <Button size="sm" className="bg-brand-accent text-white text-xs" onClick={() => alert('Invite team member modal')}>
                + Invite Member
              </Button>
            </div>

            <div className="divide-y divide-border-subtle text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-text-primary">Sarah Jenkins (You)</p>
                  <p className="text-text-muted">brand@demo.com • Admin &amp; CFO</p>
                </div>
                <span className="text-text-muted font-mono">Owner</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-text-primary">Marcus Vance</p>
                  <p className="text-text-muted">marcus@demo.com • Influencer Marketing Lead</p>
                </div>
                <span className="text-text-muted font-mono">Reviewer</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. API & Webhooks */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-surface p-5 space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-text-primary">API Keys &amp; Webhooks</h3>
            <p className="text-text-muted">Use API keys to programmatically create campaigns and ingest live attribution tracking webhooks.</p>

            <div className="space-y-2">
              <label className="font-medium text-text-secondary">Live API Secret Key</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  readOnly
                  value={apiKey}
                  className="flex-1 rounded-md border border-input-border bg-surface-raised font-mono p-2 text-text-primary"
                />
                <Button variant="outline" size="sm" onClick={copyKey} className="gap-1">
                  {copiedKey ? <CheckCircle2 className="h-3.5 w-3.5 text-status-success" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedKey ? 'Copied' : 'Copy'}
                </Button>
                <Button variant="outline" size="sm" onClick={regenerateKey} className="gap-1 text-status-danger">
                  <RefreshCw className="h-3.5 w-3.5" /> Rotate
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Privacy & GDPR */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-surface p-5 space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-text-primary">Data Privacy &amp; GDPR Controls</h3>
            <p className="text-text-muted">Manage data export, tracking consent, and account deletion requests.</p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 rounded-md border border-border bg-surface-raised">
                <div>
                  <p className="font-semibold text-text-primary">Export Account &amp; Financial Data</p>
                  <p className="text-text-muted">Download all campaign logs, payout receipts, and audit history (JSON / CSV).</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => alert('Data export package generating...')}>
                  <Download className="h-3.5 w-3.5 mr-1" /> Request Export
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-md border border-status-danger/30 bg-status-danger-bg">
                <div>
                  <p className="font-semibold text-status-danger">Right to be Forgotten (Account Deletion)</p>
                  <p className="text-text-muted">Permanently anonymize company PII and revoke active campaign escrow.</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => alert('Account deletion confirmation dialog')}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

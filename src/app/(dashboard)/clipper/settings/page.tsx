'use client';

import React, { useState } from 'react';
import { 
  Instagram, 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  Trash2, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';

const ALL_NICHES = ['Fitness', 'Beauty', 'Fashion', 'Tech', 'Food', 'Gaming', 'Lifestyle', 'Finance', 'Comedy'];

export default function ClipperSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'instagram' | 'payouts' | 'tax' | 'privacy'>('profile');

  // Clipper profile state
  const [igHandle, setIgHandle] = useState('alex_edits_fit');
  const [followerCount, setFollowerCount] = useState(142000);
  const [bio, setBio] = useState('High-energy fitness, calisthenics, and gym edit creator. 140K+ TikTok & IG Reels.');
  const [niches, setNiches] = useState<string[]>(['Fitness', 'Lifestyle']);

  const toggleNiche = (niche: string) => {
    setNiches((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Creator Settings</h1>
        <p className="text-sm text-text-muted">Manage your Instagram connection, Stripe Express payouts, and tax compliance.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border text-xs">
        {[
          { id: 'profile', label: 'Creator Profile' },
          { id: 'instagram', label: 'Instagram Verification' },
          { id: 'payouts', label: 'Stripe Express Payouts' },
          { id: 'tax', label: 'Tax & W-9 Status' },
          { id: 'privacy', label: 'Privacy & Data' },
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

      {/* 1. Profile */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-surface p-5 space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-text-primary">Creator Bio &amp; Portfolio</h3>
            
            <div className="space-y-3">
              <div>
                <label className="font-medium text-text-secondary block mb-1">Instagram Handle</label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-input-border bg-surface-raised px-3 text-text-muted">
                    @
                  </span>
                  <input
                    type="text"
                    value={igHandle}
                    onChange={(e) => setIgHandle(e.target.value)}
                    className="w-full rounded-r-md border border-input-border bg-input-bg p-2 text-text-primary focus:border-brand-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-text-secondary block mb-1">Creator Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-md border border-input-border bg-input-bg p-2 text-text-primary focus:border-brand-accent focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="font-medium text-text-secondary block mb-1">Content Niches</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {ALL_NICHES.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => toggleNiche(n)}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        niches.includes(n)
                          ? 'border-brand-accent bg-brand-accent/10 text-brand-accent font-semibold'
                          : 'border-border text-text-muted hover:border-text-muted'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" className="bg-brand-accent text-white" onClick={() => alert('Profile updated successfully.')}>
                Save Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Instagram Verification */}
      {activeTab === 'instagram' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-surface p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white">
                  <Instagram className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">Instagram Graph API Connection</h3>
                  <p className="text-text-muted">Account Type: <strong className="text-text-secondary">Instagram Creator / Business</strong></p>
                </div>
              </div>
              <span className="flex items-center gap-1 rounded bg-status-success/10 text-status-success px-2 py-0.5 font-semibold text-[10px]">
                <CheckCircle2 className="h-3 w-3" /> VERIFIED
              </span>
            </div>

            <div className="rounded-md border border-border bg-surface-raised p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-text-muted">Connected Account:</span>
                <span className="font-mono font-medium text-text-primary">@{igHandle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Verified Followers:</span>
                <span className="font-mono font-medium text-text-primary">{followerCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Meta OAuth Token:</span>
                <span className="text-status-success font-medium">Active (AES-256 Encrypted)</span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="text-status-danger border-status-danger/30 hover:bg-status-danger/10" onClick={() => alert('Disconnected Instagram account.')}>
              Disconnect Account
            </Button>
          </div>
        </div>
      )}

      {/* 3. Stripe Express Payouts */}
      {activeTab === 'payouts' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-surface p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Stripe Connect Express Payouts</h3>
                <p className="text-text-muted">Identity verified for direct bank transfers.</p>
              </div>
              <StatusBadge type="kyc" status="VERIFIED" />
            </div>

            <div className="rounded-md border border-border bg-surface-raised p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-text-muted">Connected Bank:</span>
                <span className="font-mono text-text-primary">Chase Checking (•••• 4821)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Payout Schedule:</span>
                <span className="text-status-success font-medium">Automatic on attribution close (24h)</span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => alert('Opening Stripe Express dashboard...')}>
              <ExternalLink className="h-3.5 w-3.5" /> Edit Bank Details in Stripe Express
            </Button>
          </div>
        </div>
      )}

      {/* 4. Tax & W-9 */}
      {activeTab === 'tax' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-surface p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Tax Reporting (Form W-9)</h3>
                <p className="text-text-muted">Mandatory US 1099-K reporting information.</p>
              </div>
              <span className="rounded bg-status-success/10 text-status-success px-2 py-0.5 font-semibold text-[10px]">
                W-9 ON FILE
              </span>
            </div>

            <p className="text-text-secondary leading-relaxed">
              Your taxpayer identification number (TIN) is encrypted and stored with Stripe. Year-end 1099-K tax documents will be available for direct download in January.
            </p>

            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => alert('Downloading tax summary...')}>
              <Download className="h-3.5 w-3.5" /> Download Tax Statement (PDF)
            </Button>
          </div>
        </div>
      )}

      {/* 5. Privacy & Data */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-surface p-5 space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-text-primary">Privacy &amp; Data Rights</h3>
            <p className="text-text-muted">Manage CCPA / GDPR consent and account deletion.</p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 rounded-md border border-border bg-surface-raised">
                <div>
                  <p className="font-semibold text-text-primary">Download My Data Archive</p>
                  <p className="text-text-muted">All submission logs, payout transactions, and creator profile metadata.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => alert('Preparing creator data archive...')}>
                  <Download className="h-3.5 w-3.5 mr-1" /> Export Data
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-md border border-status-danger/30 bg-status-danger-bg">
                <div>
                  <p className="font-semibold text-status-danger">Delete Creator Profile</p>
                  <p className="text-text-muted">Erase your profile, connected Instagram credentials, and personal data.</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => alert('Confirm account deletion dialog')}>
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

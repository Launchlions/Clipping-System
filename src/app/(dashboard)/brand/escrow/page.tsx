'use client';

import React, { useState } from 'react';
import { 
  Landmark, 
  ShieldCheck, 
  Download, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/shared/metric-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCents } from '@/lib/utils/constants';

interface EscrowTransaction {
  id: string;
  type: 'DEPOSIT' | 'HOLD' | 'RELEASE' | 'REFUND';
  description: string;
  campaignTitle?: string;
  amountCents: number;
  balanceAfterCents: number;
  createdAt: string;
  referenceId: string;
  status: string;
}

const MOCK_LEDGER: EscrowTransaction[] = [
  {
    id: 'tx-1',
    type: 'RELEASE',
    description: 'Creator Payout Release (Alex Creator)',
    campaignTitle: 'Summer Activewear Reel Blitz',
    amountCents: -180_00,
    balanceAfterCents: 5660_00,
    createdAt: 'Sep 01, 2026, 14:20 UTC',
    referenceId: 'po_99a8x12Zv',
    status: 'COMPLETED',
  },
  {
    id: 'tx-2',
    type: 'RELEASE',
    description: 'Creator Payout Release (Maya Visuals)',
    campaignTitle: 'Summer Activewear Reel Blitz',
    amountCents: -250_00,
    balanceAfterCents: 5840_00,
    createdAt: 'Aug 29, 2026, 09:12 UTC',
    referenceId: 'po_771x9aKv',
    status: 'COMPLETED',
  },
  {
    id: 'tx-3',
    type: 'DEPOSIT',
    description: 'Escrow Account Wire / Stripe ACH Deposit',
    campaignTitle: 'Summer Activewear Reel Blitz',
    amountCents: 5000_00,
    balanceAfterCents: 6090_00,
    createdAt: 'Aug 20, 2026, 11:45 UTC',
    referenceId: 'pi_3Pfx9182xZvKYlo2',
    status: 'COMPLETED',
  },
  {
    id: 'tx-4',
    type: 'DEPOSIT',
    description: 'Initial Campaign Escrow Funding',
    campaignTitle: 'Brand Awareness Push',
    amountCents: 10000_00,
    balanceAfterCents: 1090_00,
    createdAt: 'Jul 15, 2026, 16:30 UTC',
    referenceId: 'pi_3Pdw8182xZvKYlo2',
    status: 'COMPLETED',
  },
];

import { useToast } from '@/components/ui/toast';
import { useEscrow } from '@/lib/hooks/use-escrow';

export default function BrandEscrowPage() {
  const { toast } = useToast();
  const { depositEscrow } = useEscrow();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(2500);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Escrow Ledger</h1>
          <p className="text-sm text-text-muted">
            Bank-grade statement of deposits, campaign holds, and automated performance releases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => alert('Exporting monthly statement...')}>
            <FileSpreadsheet className="h-3.5 w-3.5" /> Export CSV / PDF
          </Button>
          <Button size="sm" className="bg-brand-accent hover:bg-brand-accent-hover text-white text-xs gap-1.5" onClick={() => setShowDepositModal(true)}>
            <Plus className="h-3.5 w-3.5" /> Deposit Funds
          </Button>
        </div>
      </div>

      {/* Hero Financial Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Available Escrow" value="$5,660.00" subtitle="Secured via Stripe Custody" />
        <MetricCard title="Active Campaign Holds" value="$2,850.00" subtitle="Locked in active slots" />
        <MetricCard title="Total Released (YTD)" value="$12,340.00" subtitle="Paid to creators" />
        <MetricCard title="Custody Compliance" value="SAQ-A" subtitle="PCI-DSS / Stripe Connect" />
      </div>

      {/* Escrow Custody Trust Banner */}
      <div className="rounded-lg border border-border bg-surface p-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-text-primary">Stripe Connect Protected Escrow</p>
            <p className="text-text-muted">
              Funds deposited into escrow are held in an isolated custodial balance and can never be unilaterally moved without verified performance.
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Statement Table */}
      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border p-4">
          <h3 className="text-sm font-semibold text-text-primary">Transaction History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-border bg-surface-raised text-text-muted uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">Type</th>
                <th className="px-4 py-2.5 text-left font-medium">Description &amp; Campaign</th>
                <th className="px-4 py-2.5 text-left font-medium">Reference ID</th>
                <th className="px-4 py-2.5 text-right font-medium">Amount</th>
                <th className="px-4 py-2.5 text-right font-medium">Running Balance</th>
                <th className="px-4 py-2.5 text-right font-medium">Timestamp</th>
                <th className="px-4 py-2.5 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {MOCK_LEDGER.map((row) => (
                <tr key={row.id} className="hover:bg-surface-raised/50 transition-colors">
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${
                        row.type === 'DEPOSIT'
                          ? 'bg-status-success-bg text-status-success'
                          : 'bg-surface-raised text-text-secondary'
                      }`}
                    >
                      {row.type === 'DEPOSIT' ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                      {row.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-text-primary">{row.description}</p>
                    {row.campaignTitle && <p className="text-[11px] text-text-muted">{row.campaignTitle}</p>}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-text-muted">{row.referenceId}</td>
                  <td
                    className={`px-4 py-3 text-right font-mono font-semibold tabular-nums ${
                      row.amountCents > 0 ? 'text-status-success' : 'text-text-primary'
                    }`}
                  >
                    {row.amountCents > 0 ? `+${formatCents(row.amountCents)}` : formatCents(row.amountCents)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-text-secondary tabular-nums">
                    {formatCents(row.balanceAfterCents)}
                  </td>
                  <td className="px-4 py-3 text-right text-text-muted">{row.createdAt}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge type="escrow" status="FUNDED" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-semibold text-text-primary">Deposit Escrow Funds</h3>
            <p className="text-xs text-text-muted">
              Add funds to your brand escrow balance via Corporate Card or ACH Wire transfer.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-text-secondary">Deposit Amount ($)</label>
                <input
                  type="number"
                  min={500}
                  step={500}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 font-mono text-sm text-text-primary tabular-nums focus:border-brand-accent focus:outline-none"
                />
              </div>

              <div className="rounded-md border border-border bg-surface-raised p-3 text-xs space-y-1">
                <div className="flex justify-between text-text-secondary">
                  <span>Payment Method:</span>
                  <span className="font-mono">Visa •••• 9012 (Stripe Elements)</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Availability:</span>
                  <span className="text-status-success font-medium">Instant Escrow Credit</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowDepositModal(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-brand-accent text-white"
                onClick={async () => {
                  try {
                    await depositEscrow('camp-1', depositAmount * 100);
                    toast({
                      type: 'success',
                      title: 'Escrow Deposit Succeeded',
                      description: `$${depositAmount.toLocaleString()}.00 added to Stripe custody balance.`,
                    });
                  } catch (err: any) {
                    toast({
                      type: 'error',
                      title: 'Deposit Failed',
                      description: err.message || 'Payment method was declined.',
                    });
                  } finally {
                    setShowDepositModal(false);
                  }
                }}
              >
                Confirm Deposit (${depositAmount}.00)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

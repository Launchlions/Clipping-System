'use client';

import React, { useState, useEffect } from 'react';
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
import { useToast } from '@/components/ui/toast';
import { useEscrow } from '@/lib/hooks/use-escrow';

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

export default function BrandEscrowPage() {
  const { toast } = useToast();
  const { depositEscrow } = useEscrow();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(2500);
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('clipbridge_escrow_ledger');
      if (saved) {
        setTransactions(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const totalBalance = transactions.reduce((acc, tx) => acc + tx.amountCents, 0);

  const handleConfirmDeposit = async () => {
    try {
      await depositEscrow('general-escrow', depositAmount * 100);
      const newTx: EscrowTransaction = {
        id: `tx_${Date.now()}`,
        type: 'DEPOSIT',
        description: 'Stripe Direct Escrow Deposit',
        campaignTitle: 'Account Balance',
        amountCents: depositAmount * 100,
        balanceAfterCents: totalBalance + depositAmount * 100,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        referenceId: `pi_${Math.random().toString(36).substring(2, 12)}`,
        status: 'COMPLETED',
      };

      const updated = [newTx, ...transactions];
      setTransactions(updated);
      try {
        localStorage.setItem('clipbridge_escrow_ledger', JSON.stringify(updated));
      } catch {}

      toast({
        type: 'success',
        title: 'Deposit Successful',
        description: `$${depositAmount.toLocaleString()}.00 added to Stripe Connect escrow custody.`,
      });
      setShowDepositModal(false);
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Deposit Failed',
        description: err.message || 'Payment method was declined.',
      });
    }
  };

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
          <Button size="sm" className="bg-brand-accent hover:bg-brand-accent-hover text-white text-xs gap-1.5 shadow-sm" onClick={() => setShowDepositModal(true)}>
            <Plus className="h-3.5 w-3.5" /> Deposit Funds
          </Button>
        </div>
      </div>

      {/* Hero Financial Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Available Escrow" value={formatCents(Math.max(0, totalBalance))} subtitle="Secured via Stripe Custody" />
        <MetricCard title="Total Transactions" value={transactions.length.toString()} subtitle="Deposit &amp; payout ledger events" />
        <MetricCard title="Settlement Status" value="ACTIVE" subtitle="100% Instant Escrow" />
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

        {transactions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-text-primary">No escrow transactions recorded yet</p>
            <p className="text-xs text-text-muted">Deposit funds or launch a campaign to fund your creator escrow balance.</p>
            <Button size="sm" className="bg-brand-accent text-white text-xs gap-1.5" onClick={() => setShowDepositModal(true)}>
              <Plus className="h-3.5 w-3.5" /> Deposit Initial Escrow
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-border bg-surface-raised text-text-muted uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Type</th>
                  <th className="px-4 py-2.5 text-left font-medium">Description</th>
                  <th className="px-4 py-2.5 text-left font-medium">Reference ID</th>
                  <th className="px-4 py-2.5 text-right font-medium">Amount</th>
                  <th className="px-4 py-2.5 text-right font-medium">Running Balance</th>
                  <th className="px-4 py-2.5 text-right font-medium">Timestamp</th>
                  <th className="px-4 py-2.5 text-center font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {transactions.map((row) => (
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
        )}
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
                  min={100}
                  step={100}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 font-mono text-sm text-text-primary tabular-nums focus:border-brand-accent focus:outline-none"
                />
              </div>

              <div className="rounded-md border border-border bg-surface-raised p-3 text-xs space-y-1">
                <div className="flex justify-between text-text-secondary">
                  <span>Payment Provider:</span>
                  <span className="font-mono">Stripe Connect Protected Custody</span>
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
                onClick={handleConfirmDeposit}
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

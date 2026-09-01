import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { DollarSign, Eye, FileCheck, ShoppingBag, TrendingUp } from "lucide-react";
import Link from "next/link";

// Mock data
const MOCK_ACTIVE_CLAIMS = [
  {
    id: "cl1",
    campaignTitle: "Summer Collection Launch",
    brandName: "Acme Corp",
    status: "SUBMITTED" as const,
    payoutType: "PER_POST",
    estEarning: 150_00,
    deadline: "Sep 15, 2026",
  },
  {
    id: "cl2",
    campaignTitle: "Fitness App Promo",
    brandName: "FitTrack",
    status: "CLAIMED" as const,
    payoutType: "CPM",
    estEarning: 200_00,
    deadline: "Sep 20, 2026",
  },
];

const MOCK_RECENT_PAYOUTS = [
  { id: "p1", campaign: "Brand Awareness Push", amount: 320_00, date: "Aug 28, 2026", status: "COMPLETED" as const },
  { id: "p2", campaign: "Q2 Product Launch", amount: 180_00, date: "Aug 15, 2026", status: "COMPLETED" as const },
];

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default function ClipperDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted">
            Your earnings and active campaigns
          </p>
        </div>
        <Link
          href="/clipper/marketplace"
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-accent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-accent-hover"
        >
          <ShoppingBag className="h-4 w-4" />
          Browse Campaigns
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Earnings"
          value="$2,450.00"
          trend={{ value: "+18.5%", direction: "up" }}
          subtitle="Lifetime"
        />
        <MetricCard
          title="Pending Payout"
          value="$350.00"
          subtitle="Processing by Sep 5"
        />
        <MetricCard
          title="Active Claims"
          value="2"
          subtitle="2 submissions due"
        />
        <MetricCard
          title="Total Reach"
          value="892K"
          trend={{ value: "+12%", direction: "up" }}
          subtitle="All content"
        />
      </div>

      {/* Active claims */}
      <div>
        <h2 className="text-sm font-medium text-text-primary">Active Claims</h2>
        <div className="mt-3 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-raised">
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                  Campaign
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                  Brand
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                  Status
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                  Est. Earning
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                  Deadline
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ACTIVE_CLAIMS.map((claim) => (
                <tr
                  key={claim.id}
                  className="border-b border-border-subtle transition-colors last:border-0 hover:bg-surface-raised"
                >
                  <td className="px-3 py-2 font-medium text-text-primary">
                    {claim.campaignTitle}
                  </td>
                  <td className="px-3 py-2 text-text-secondary">
                    {claim.brandName}
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge type="submission" status={claim.status} />
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-text-secondary tabular-nums">
                    {formatCents(claim.estEarning)}
                  </td>
                  <td className="px-3 py-2 text-right text-text-muted">
                    {claim.deadline}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent payouts */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-text-primary">
            Recent Payouts
          </h2>
          <Link
            href="/clipper/earnings"
            className="text-xs font-medium text-brand-accent hover:text-brand-accent-hover"
          >
            View all →
          </Link>
        </div>
        <div className="mt-3 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-raised">
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                  Campaign
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                  Amount
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                  Date
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_RECENT_PAYOUTS.map((payout) => (
                <tr
                  key={payout.id}
                  className="border-b border-border-subtle transition-colors last:border-0 hover:bg-surface-raised"
                >
                  <td className="px-3 py-2 text-text-primary">
                    {payout.campaign}
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-medium text-status-success tabular-nums">
                    +{formatCents(payout.amount)}
                  </td>
                  <td className="px-3 py-2 text-right text-text-muted">
                    {payout.date}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <StatusBadge type="submission" status={payout.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

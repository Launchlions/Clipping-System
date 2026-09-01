import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Megaphone, Plus, Eye, Users, DollarSign } from "lucide-react";
import Link from "next/link";

// Mock data for demonstration
const MOCK_CAMPAIGNS = [
  {
    id: "c1",
    title: "Summer Collection Launch",
    status: "ACTIVE" as const,
    budget: 5000_00,
    spent: 2340_00,
    submissions: 12,
    reach: 145_000,
  },
  {
    id: "c2",
    title: "Product Review Q3",
    status: "DRAFT" as const,
    budget: 3000_00,
    spent: 0,
    submissions: 0,
    reach: 0,
  },
  {
    id: "c3",
    title: "Brand Awareness Push",
    status: "COMPLETED" as const,
    budget: 10000_00,
    spent: 9750_00,
    submissions: 38,
    reach: 892_000,
  },
];

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(n);
}

export default function BrandDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted">
            Overview of your campaigns and spend
          </p>
        </div>
        <Link
          href="/brand/campaigns/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-accent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-accent-hover"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </Link>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Escrow Balance"
          value="$18,000.00"
          subtitle="Across 3 campaigns"
        />
        <MetricCard
          title="Total Spend"
          value="$12,090.00"
          trend={{ value: "+12.3%", direction: "up" }}
          subtitle="This month"
        />
        <MetricCard
          title="Total Reach"
          value="1.04M"
          trend={{ value: "+8.7%", direction: "up" }}
          subtitle="All campaigns"
        />
        <MetricCard
          title="Active Creators"
          value="24"
          trend={{ value: "+3", direction: "up" }}
          subtitle="Across active campaigns"
        />
      </div>

      {/* Active campaigns table */}
      <div>
        <h2 className="text-sm font-medium text-text-primary">
          Active Campaigns
        </h2>
        <div className="mt-3 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-raised">
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                  Campaign
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                  Status
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                  Budget
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                  Spent
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                  Submissions
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                  Reach
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CAMPAIGNS.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="border-b border-border-subtle transition-colors last:border-0 hover:bg-surface-raised"
                >
                  <td className="px-3 py-2">
                    <Link
                      href={`/brand/campaigns/${campaign.id}`}
                      className="font-medium text-text-primary hover:text-brand-accent"
                    >
                      {campaign.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge type="campaign" status={campaign.status} />
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-text-secondary tabular-nums">
                    {formatCents(campaign.budget)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-text-secondary tabular-nums">
                    {formatCents(campaign.spent)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-text-secondary tabular-nums">
                    {campaign.submissions}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-text-secondary tabular-nums">
                    {formatNumber(campaign.reach)}
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

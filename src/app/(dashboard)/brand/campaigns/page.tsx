import { EmptyState } from "@/components/shared/empty-state";
import { Megaphone } from "lucide-react";
import Link from "next/link";

export default function BrandCampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Campaigns</h1>
          <p className="text-sm text-text-muted">Manage your campaigns</p>
        </div>
        <Link
          href="/brand/campaigns/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-accent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-accent-hover"
        >
          New Campaign
        </Link>
      </div>
      <EmptyState
        icon={Megaphone}
        title="No campaigns yet"
        description="Create your first campaign to start connecting with creators."
        action={
          <Link
            href="/brand/campaigns/new"
            className="rounded-md bg-brand-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-accent-hover"
          >
            Create Campaign
          </Link>
        }
      />
    </div>
  );
}

import { Badge } from "@/components/ui/badge";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "pending" | "outline";

const CAMPAIGN_STATUS_MAP: Record<string, BadgeVariant> = {
  DRAFT: "pending",
  ACTIVE: "success",
  PAUSED: "warning",
  COMPLETED: "default",
  CANCELLED: "danger",
};

const SUBMISSION_STATUS_MAP: Record<string, BadgeVariant> = {
  PENDING: "pending",
  IN_REVIEW: "warning",
  APPROVED: "success",
  REJECTED: "danger",
  PUBLISHED: "success",
  PAID: "success",
};

const ESCROW_STATUS_MAP: Record<string, BadgeVariant> = {
  UNFUNDED: "danger",
  FUNDED: "success",
  PARTIALLY_RELEASED: "warning",
  FULLY_RELEASED: "success",
  REFUNDED: "pending",
};

const KYC_STATUS_MAP: Record<string, BadgeVariant> = {
  UNVERIFIED: "danger",
  PENDING: "warning",
  VERIFIED: "success",
  REJECTED: "danger",
};

function formatLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface StatusBadgeProps {
  type: "campaign" | "submission" | "escrow" | "kyc";
  status: string;
}

export function StatusBadge({ type, status }: StatusBadgeProps) {
  const maps: Record<string, Record<string, BadgeVariant>> = {
    campaign: CAMPAIGN_STATUS_MAP,
    submission: SUBMISSION_STATUS_MAP,
    escrow: ESCROW_STATUS_MAP,
    kyc: KYC_STATUS_MAP,
  };

  const variant = maps[type]?.[status] || "default";

  return <Badge variant={variant}>{formatLabel(status)}</Badge>;
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Megaphone,
  Landmark,
  Settings,
  ShoppingBag,
  FileCheck,
  DollarSign,
  AlertTriangle,
  CreditCard,
  Shield,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

type Role = "BRAND" | "CLIPPER" | "ADMIN";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  BRAND: [
    { label: "Dashboard", href: "/brand/dashboard", icon: LayoutDashboard },
    { label: "Campaigns", href: "/brand/campaigns", icon: Megaphone },
    { label: "Escrow", href: "/brand/escrow", icon: Landmark },
    { label: "Settings", href: "/brand/settings", icon: Settings },
  ],
  CLIPPER: [
    { label: "Dashboard", href: "/clipper/dashboard", icon: LayoutDashboard },
    { label: "Marketplace", href: "/clipper/marketplace", icon: ShoppingBag },
    { label: "Submissions", href: "/clipper/submissions", icon: FileCheck },
    { label: "Earnings", href: "/clipper/earnings", icon: DollarSign },
    { label: "Settings", href: "/clipper/settings", icon: Settings },
  ],
  ADMIN: [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Disputes", href: "/admin/disputes", icon: AlertTriangle },
    { label: "Payouts", href: "/admin/payouts", icon: CreditCard },
    { label: "Fraud", href: "/admin/fraud", icon: Shield },
  ],
};

interface SidebarProps {
  role: Role;
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ role, collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const items = NAV_ITEMS[role] || [];

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-surface transition-[width] duration-200 ease-in-out",
        collapsed ? "w-12" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-12 items-center border-b border-border px-3">
        {collapsed ? (
          <span className="text-sm font-bold text-brand-accent">CB</span>
        ) : (
          <span className="text-sm font-semibold tracking-tight text-text-primary">
            ClipBridge
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                isActive
                  ? "border-l-2 border-brand-accent bg-surface-raised text-text-primary"
                  : "border-l-2 border-transparent text-text-secondary hover:bg-surface-raised/50 hover:text-text-primary"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border px-2 py-2">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-raised hover:text-text-secondary"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}

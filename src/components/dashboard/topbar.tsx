"use client";

import { signOut, useSession } from "next-auth/react";
import { Bell, LogOut, Settings, User } from "lucide-react";
import { Breadcrumbs } from "./breadcrumbs";
import { cn } from "@/lib/utils/cn";

import { NotificationBell } from "./notification-bell";

export function Topbar() {
  const { data: session } = useSession();

  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-surface px-4">
      <Breadcrumbs />

      <div className="flex items-center gap-2">
        <NotificationBell />

        {/* User menu */}
        <div className="relative group">
          <button className="flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-surface-raised">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-raised text-xs font-medium text-text-secondary">
              {session?.user?.name?.charAt(0) || "U"}
            </div>
            {session?.user?.name && (
              <span className="hidden text-text-secondary sm:block">
                {session.user.name}
              </span>
            )}
          </button>

          {/* Dropdown */}
          <div className="invisible absolute right-0 top-full z-50 mt-1 min-w-[200px] rounded-md border border-border bg-surface py-1 opacity-0 shadow-md transition-all group-hover:visible group-hover:opacity-100">
            {session?.user && (
              <div className="border-b border-border px-3 py-2">
                <p className="text-sm font-medium text-text-primary">
                  {session.user.name}
                </p>
                <p className="text-xs text-text-muted">{session.user.email}</p>
                <span className="mt-1 inline-flex items-center rounded-full bg-brand-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-brand-accent">
                  {session.user.role}
                </span>
              </div>
            )}
            <button
              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-raised"
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-status-danger transition-colors hover:bg-surface-raised"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

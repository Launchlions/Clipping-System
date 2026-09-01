"use client";

import { SessionProvider } from "next-auth/react";
import { SidebarProvider, DashboardShell } from "@/components/dashboard/shell";
import { useSession } from "next-auth/react";

function DashboardInner({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const role = (session?.user?.role || "BRAND") as "BRAND" | "CLIPPER" | "ADMIN";

  return (
    <SidebarProvider>
      <DashboardShell role={role}>{children}</DashboardShell>
    </SidebarProvider>
  );
}

import { ToastProvider } from "@/components/ui/toast";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider basePath="/api/auth">
      <ToastProvider>
        <DashboardInner>{children}</DashboardInner>
      </ToastProvider>
    </SessionProvider>
  );
}

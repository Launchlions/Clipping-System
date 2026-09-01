"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

type Role = "BRAND" | "CLIPPER" | "ADMIN";

interface SidebarContextValue {
  collapsed: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  toggle: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <SidebarContext.Provider
      value={{ collapsed, toggle: () => setCollapsed((c) => !c) }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

interface DashboardShellProps {
  children: ReactNode;
  role: Role;
}

export function DashboardShell({ children, role }: DashboardShellProps) {
  const { collapsed, toggle } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      <Sidebar role={role} collapsed={collapsed} onToggle={toggle} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Check, CheckCheck, ExternalLink, Info, ShieldCheck, AlertCircle } from 'lucide-react';
import { useNotifications } from '@/lib/hooks/use-notifications';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[9px] font-bold text-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg border border-border bg-surface shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-border bg-surface-raised px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-text-primary">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded bg-brand-accent/10 px-1.5 py-0.2 text-[10px] font-semibold text-brand-accent">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={() => markAsRead()}
                className="flex items-center gap-1 text-[11px] text-text-muted hover:text-text-primary transition-colors font-medium"
              >
                <CheckCheck className="h-3 w-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border-subtle text-xs">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-text-muted">No notifications right now.</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3.5 transition-colors hover:bg-surface-raised cursor-pointer ${
                    !n.isRead ? 'bg-brand-accent/5' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={`font-semibold ${!n.isRead ? 'text-brand-accent' : 'text-text-primary'}`}>
                      {n.title}
                    </p>
                    {!n.isRead && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-accent shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  {n.actionUrl && (
                    <Link
                      href={n.actionUrl}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1 text-[10px] text-brand-accent font-medium hover:underline mt-2"
                    >
                      View Details <ExternalLink className="h-2.5 w-2.5" />
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  toast: (options: { type?: ToastType; title: string; description?: string }) => void;
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type = 'info', title, description }: { type?: ToastType; title: string; description?: string }) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, description }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast, toasts, removeToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 rounded-lg border border-border bg-surface p-3.5 shadow-lg animate-in slide-in-from-bottom-2 duration-200"
          >
            {t.type === 'success' && <CheckCircle2 className="h-4 w-4 text-status-success shrink-0 mt-0.5" />}
            {t.type === 'warning' && <AlertTriangle className="h-4 w-4 text-status-warning shrink-0 mt-0.5" />}
            {t.type === 'error' && <AlertCircle className="h-4 w-4 text-status-danger shrink-0 mt-0.5" />}
            {t.type === 'info' && <Info className="h-4 w-4 text-brand-accent shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text-primary">{t.title}</p>
              {t.description && <p className="text-[11px] text-text-muted mt-0.5">{t.description}</p>}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-text-muted hover:text-text-primary p-0.5 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if not wrapped in provider
    return {
      toast: ({ title, description }: { type?: ToastType; title: string; description?: string }) => {
        console.log(`[Toast] ${title}: ${description || ''}`);
      },
      toasts: [],
      removeToast: () => {},
    };
  }
  return context;
}

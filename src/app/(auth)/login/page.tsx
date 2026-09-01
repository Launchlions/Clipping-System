"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        let destination = callbackUrl;
        if (destination === "/" || destination.endsWith("/login")) {
          if (email.includes("clipper")) destination = "/clipper/dashboard";
          else if (email.includes("admin")) destination = "/admin/dashboard";
          else destination = "/brand/dashboard";
        }
        window.location.href = destination;
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password");
  };

  return (
    <>
      <h2 className="text-lg font-semibold text-text-primary">
        Sign in to ClipBridge
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        Enter your credentials to access your account
      </p>

      {error && (
        <div className="mt-4 rounded-md bg-status-danger/10 px-3 py-2 text-sm text-status-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text-secondary"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            className="mt-1.5 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-text-secondary"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="mt-1.5 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-md bg-brand-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-accent-hover disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-brand-accent hover:text-brand-accent-hover"
        >
          Sign up
        </Link>
      </p>

      {/* Demo credentials with one-click fill */}
      <div className="mt-6 rounded-md border border-border-subtle bg-surface-raised p-3">
        <p className="text-xs font-semibold text-text-secondary">Quick 1-Click Demo Logins:</p>
        <div className="mt-2 flex flex-col gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => fillDemo("brand@demo.com")}
            className="text-left px-2 py-1 rounded bg-surface hover:bg-border transition-colors font-mono text-text-primary"
          >
            🏢 Brand: <span className="text-brand-accent">brand@demo.com</span> (Click to fill)
          </button>
          <button
            type="button"
            onClick={() => fillDemo("clipper@demo.com")}
            className="text-left px-2 py-1 rounded bg-surface hover:bg-border transition-colors font-mono text-text-primary"
          >
            ✂️ Clipper: <span className="text-brand-accent">clipper@demo.com</span> (Click to fill)
          </button>
          <button
            type="button"
            onClick={() => fillDemo("admin@demo.com")}
            className="text-left px-2 py-1 rounded bg-surface hover:bg-border transition-colors font-mono text-text-primary"
          >
            🛡️ Admin: <span className="text-brand-accent">admin@demo.com</span> (Click to fill)
          </button>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-xs text-text-muted">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}

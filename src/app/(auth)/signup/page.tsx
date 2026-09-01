"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Megaphone, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Role = "BRAND" | "CLIPPER";
type Step = 1 | 2 | 3;

const NICHES = [
  "Fashion", "Beauty", "Fitness", "Food", "Travel", "Tech",
  "Gaming", "Music", "Comedy", "Education", "Lifestyle", "Sports",
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // Basic info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Brand fields
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [billingEmail, setBillingEmail] = useState("");

  // Clipper fields
  const [igHandle, setIgHandle] = useState("");
  const [bio, setBio] = useState("");
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);

  function toggleNiche(niche: string) {
    setSelectedNiches((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    );
  }

  function canProceed(): boolean {
    if (step === 1) return role !== null;
    if (step === 2)
      return (
        name.length > 0 &&
        email.length > 0 &&
        password.length >= 6 &&
        password === confirmPassword
      );
    return true;
  }

  async function handleGoogleSignUp() {
    try {
      setGoogleLoading(true);
      await signIn("google", { callbackUrl: role === "BRAND" ? "/brand/dashboard" : "/clipper/dashboard" });
    } catch {
      setError("Google authentication failed.");
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);

    try {
      // 1. Register user in database
      const regRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          companyName,
          website,
          industry,
          igHandle,
          bio,
          niches: selectedNiches,
        }),
      });

      if (!regRes.ok) {
        const json = await regRes.json();
        throw new Error(json.error || 'Registration failed');
      }

      // 2. Sign in with the newly created account
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created, but sign-in failed. Please login manually.");
      } else {
        const dashboardPath =
          role === "BRAND" ? "/brand/dashboard" : "/clipper/dashboard";
        router.push(dashboardPath);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2 className="text-lg font-semibold text-text-primary">
        Create your account
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        Join ClipBridge to connect brands with short-form creators
      </p>

      {/* Stepper */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={cn(
              "h-1.5 w-8 rounded-full transition-colors",
              s <= step ? "bg-brand-accent" : "bg-surface-raised"
            )}
          />
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-status-danger/10 px-3 py-2 text-xs text-status-danger">
          {error}
        </div>
      )}

      {/* Google OAuth Quick Button on Step 1 */}
      {step === 1 && (
        <div className="mt-6 space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-2.5 rounded-md border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-text-primary transition-colors hover:bg-surface-raised shadow-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            {googleLoading ? "Connecting..." : "Sign up with Google"}
          </button>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-border" />
            <span className="bg-surface px-2 text-[10px] uppercase tracking-wider text-text-muted">
              or select your account type
            </span>
          </div>
        </div>
      )}

      {/* Step 1: Role selection */}
      {step === 1 && (
        <div className="mt-4 space-y-3">
          <button
            onClick={() => setRole("BRAND")}
            className={cn(
              "flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors",
              role === "BRAND"
                ? "border-brand-accent bg-brand-accent/5 shadow-sm"
                : "border-border hover:border-text-muted"
            )}
          >
            <Megaphone className="mt-0.5 h-5 w-5 shrink-0 text-brand-accent" />
            <div>
              <p className="text-xs font-semibold text-text-primary">
                I&apos;m a Brand
              </p>
              <p className="mt-0.5 text-[11px] text-text-muted">
                Launch escrow-backed campaigns and receive vetted creator cuts
              </p>
            </div>
            {role === "BRAND" && (
              <Check className="ml-auto h-4 w-4 shrink-0 text-brand-accent" />
            )}
          </button>

          <button
            onClick={() => setRole("CLIPPER")}
            className={cn(
              "flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors",
              role === "CLIPPER"
                ? "border-brand-accent bg-brand-accent/5 shadow-sm"
                : "border-border hover:border-text-muted"
            )}
          >
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-brand-accent" />
            <div>
              <p className="text-xs font-semibold text-text-primary">
                I&apos;m a Fan-Page Clipper / Creator
              </p>
              <p className="mt-0.5 text-[11px] text-text-muted">
                Claim 48h brief slots and earn instant 85% payouts on live views
              </p>
            </div>
            {role === "CLIPPER" && (
              <Check className="ml-auto h-4 w-4 shrink-0 text-brand-accent" />
            )}
          </button>
        </div>
      )}

      {/* Step 2: Basic info */}
      {step === 2 && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              className="mt-1 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@company.com"
              className="mt-1 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary">
              Password (min. 6 characters)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={cn(
                "mt-1 block w-full rounded-md border bg-input-bg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-ring",
                confirmPassword && password !== confirmPassword
                  ? "border-status-danger focus:border-status-danger"
                  : "border-input-border focus:border-brand-accent"
              )}
            />
          </div>
        </div>
      )}

      {/* Step 3: Role-specific fields */}
      {step === 3 && role === "BRAND" && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary">
              Company / Brand name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Activewear"
              className="mt-1 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary">
              Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://brand.com"
              className="mt-1 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary">
              Primary Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="mt-1 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-xs text-text-primary focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="Fitness">Fitness &amp; Apparel</option>
              <option value="Beauty">Beauty &amp; Skincare</option>
              <option value="Tech">Technology &amp; Gadgets</option>
              <option value="Food">Food &amp; Beverage</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      )}

      {step === 3 && role === "CLIPPER" && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary">
              Instagram Handle
            </label>
            <div className="mt-1 flex">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-input-border bg-surface-raised px-2.5 text-xs text-text-muted">
                @
              </span>
              <input
                type="text"
                value={igHandle}
                onChange={(e) => setIgHandle(e.target.value)}
                placeholder="yourhandle"
                className="block w-full rounded-r-md border border-input-border bg-input-bg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary">
              Niches &amp; Content Specialties
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {NICHES.map((niche) => (
                <button
                  key={niche}
                  type="button"
                  onClick={() => toggleNiche(niche)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                    selectedNiches.includes(niche)
                      ? "border-brand-accent bg-brand-accent/10 text-brand-accent"
                      : "border-border text-text-muted hover:border-text-muted"
                  )}
                >
                  {niche}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="mt-6 flex gap-2">
        {step > 1 && (
          <button
            onClick={() => setStep((s) => (s - 1) as Step)}
            className="flex-1 rounded-md border border-border px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-raised"
          >
            Back
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={() => setStep((s) => (s + 1) as Step)}
            disabled={!canProceed()}
            className="flex-1 rounded-md bg-brand-accent px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-accent-hover disabled:opacity-50 shadow-sm"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex flex-1 items-center justify-center rounded-md bg-brand-accent px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-accent-hover disabled:opacity-50 shadow-sm"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-brand-accent hover:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}

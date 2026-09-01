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

  async function handleSubmit() {
    setError("");
    setLoading(true);

    try {
      // In production this would call a server action to create the user.
      // For now, sign in with the matching demo account.
      const demoEmail = role === "BRAND" ? "brand@demo.com" : "clipper@demo.com";
      const result = await signIn("credentials", {
        email: demoEmail,
        password: "password",
        redirect: false,
      });

      if (result?.error) {
        setError("Account creation failed. Please try again.");
      } else {
        const dashboardPath =
          role === "BRAND" ? "/brand/dashboard" : "/clipper/dashboard";
        router.push(dashboardPath);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
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
        Join ClipBridge to connect brands with creators
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
        <div className="mt-4 rounded-md bg-status-danger/10 px-3 py-2 text-sm text-status-danger">
          {error}
        </div>
      )}

      {/* Step 1: Role selection */}
      {step === 1 && (
        <div className="mt-6 space-y-3">
          <button
            onClick={() => setRole("BRAND")}
            className={cn(
              "flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors",
              role === "BRAND"
                ? "border-brand-accent bg-brand-accent/5"
                : "border-border hover:border-text-muted"
            )}
          >
            <Megaphone className="mt-0.5 h-5 w-5 shrink-0 text-brand-accent" />
            <div>
              <p className="text-sm font-medium text-text-primary">
                I&apos;m a Brand
              </p>
              <p className="mt-0.5 text-xs text-text-muted">
                Launch campaigns and connect with creators
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
                ? "border-brand-accent bg-brand-accent/5"
                : "border-border hover:border-text-muted"
            )}
          >
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-brand-accent" />
            <div>
              <p className="text-sm font-medium text-text-primary">
                I&apos;m a Creator
              </p>
              <p className="mt-0.5 text-xs text-text-muted">
                Discover campaigns and earn from your content
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
            <label className="block text-sm font-medium text-text-secondary">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              className="mt-1.5 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@company.com"
              className="mt-1.5 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="mt-1.5 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className={cn(
                "mt-1.5 block w-full rounded-md border bg-input-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-ring",
                confirmPassword && password !== confirmPassword
                  ? "border-status-danger focus:border-status-danger"
                  : "border-input-border focus:border-brand-accent"
              )}
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-xs text-status-danger">
                Passwords do not match
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Role-specific fields */}
      {step === 3 && role === "BRAND" && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Company name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Corporation"
              className="mt-1.5 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://acme.com"
              className="mt-1.5 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="mt-1.5 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-sm text-text-primary focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Select industry</option>
              <option value="fashion">Fashion & Apparel</option>
              <option value="beauty">Beauty & Cosmetics</option>
              <option value="tech">Technology</option>
              <option value="food">Food & Beverage</option>
              <option value="health">Health & Wellness</option>
              <option value="entertainment">Entertainment</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Billing email
            </label>
            <input
              type="email"
              value={billingEmail}
              onChange={(e) => setBillingEmail(e.target.value)}
              placeholder="billing@acme.com"
              className="mt-1.5 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
      )}

      {step === 3 && role === "CLIPPER" && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Instagram handle
            </label>
            <div className="mt-1.5 flex">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-input-border bg-surface-raised px-3 text-sm text-text-muted">
                @
              </span>
              <input
                type="text"
                value={igHandle}
                onChange={(e) => setIgHandle(e.target.value)}
                placeholder="yourhandle"
                className="block w-full rounded-r-md border border-input-border bg-input-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell brands about your content style..."
              rows={3}
              className="mt-1.5 block w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Content niches
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {NICHES.map((niche) => (
                <button
                  key={niche}
                  type="button"
                  onClick={() => toggleNiche(niche)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
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
      <div className="mt-6 flex gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep((s) => (s - 1) as Step)}
            className="flex-1 rounded-md border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-raised"
          >
            Back
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={() => setStep((s) => (s + 1) as Step)}
            disabled={!canProceed()}
            className="flex-1 rounded-md bg-brand-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-accent-hover disabled:opacity-50"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex flex-1 items-center justify-center rounded-md bg-brand-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-accent-hover disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create account"
            )}
          </button>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-brand-accent hover:text-brand-accent-hover"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}

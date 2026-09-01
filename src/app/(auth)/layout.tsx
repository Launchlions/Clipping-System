export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-lg font-semibold tracking-tight text-text-primary">
            ClipBridge
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            The trusted creator marketplace
          </p>
        </div>

        {/* Card */}
        <div className="rounded-lg border border-border bg-surface p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

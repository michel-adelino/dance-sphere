import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center hero-gradient px-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
          <span className="font-bold text-primary">DS</span>
        </div>
        <span className="font-display text-2xl font-semibold">DanceSphere</span>
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-2xl">
        {children}
      </div>
    </div>
  );
}

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                <span className="text-sm font-bold text-primary">DS</span>
              </div>
              <span className="font-display text-lg font-semibold">DanceSphere</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted">
              The platform where dancers, teachers, and organizers connect.
              Discover events, book tickets, and share your passion for dance.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Explore</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/events" className="text-sm text-muted hover:text-primary">
                  All Events
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-muted hover:text-primary">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Organizers</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/dashboard" className="text-sm text-muted hover:text-primary">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="gradient-divider mt-8" />
        <p className="mt-8 text-center text-xs text-muted">
          © {new Date().getFullYear()} DanceSphere. Move. Connect. Dance.
        </p>
      </div>
    </footer>
  );
}

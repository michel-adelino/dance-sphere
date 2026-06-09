import { Mail, CheckCircle2 } from "lucide-react";

export function EmailSentNotice({ email }: { email: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-left">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
      <div>
        <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Mail className="h-4 w-4 text-secondary" />
          Confirmation email sent
        </p>
        <p className="mt-1 text-sm text-muted">
          A ticket confirmation with QR codes was sent to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>
    </div>
  );
}

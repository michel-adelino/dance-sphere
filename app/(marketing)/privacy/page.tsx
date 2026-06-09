export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold">Privacy Policy</h1>
      <div className="mt-8 space-y-6 text-muted leading-relaxed">
        <p>
          DanceSphere respects your privacy. We collect only the information
          necessary to provide our event ticketing services: your name, email
          address, and booking history.
        </p>
        <p>
          Payment data is processed securely by Stripe and is never stored on
          our servers. We use cookies for authentication sessions only.
        </p>
        <p>
          You may request deletion of your account and associated data at any
          time by contacting us or through your account settings.
        </p>
        <p>
          We comply with GDPR requirements. Your data is stored within the EU
          where possible and is not sold to third parties.
        </p>
      </div>
    </div>
  );
}

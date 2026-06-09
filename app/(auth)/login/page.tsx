import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <>
      <h1 className="font-display text-2xl font-semibold text-center">Welcome back</h1>
      <p className="mt-2 text-center text-sm text-muted">Sign in to your account</p>
      <div className="mt-8">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </>
  );
}

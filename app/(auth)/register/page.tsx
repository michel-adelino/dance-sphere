import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <>
      <h1 className="font-display text-2xl font-semibold text-center">Join DanceSphere</h1>
      <p className="mt-2 text-center text-sm text-muted">Create your free account</p>
      <div className="mt-8">
        <RegisterForm />
      </div>
    </>
  );
}

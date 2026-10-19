import type { Metadata } from "next";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import Shield from "@/components/Shield";

export const metadata: Metadata = {
  title: "Staff Login | Senn Parents",
};

export default function LoginPage() {
  return (
    <main className="auth-page">
      <Link href="/" className="nav-mark">
        <Shield />
        <span>Senn Parents</span>
      </Link>
      <SignIn
        path="/login"
        signUpUrl="/signup"
        forceRedirectUrl="/dashboard"
      />
    </main>
  );
}

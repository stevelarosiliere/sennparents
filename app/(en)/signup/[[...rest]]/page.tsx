import type { Metadata } from "next";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import Shield from "@/components/Shield";

export const metadata: Metadata = {
  title: "Staff Sign Up | Senn Parents",
};

export default function SignUpPage() {
  return (
    <main className="auth-page">
      <Link href="/" className="nav-mark">
        <Shield />
        <span>Senn Parents</span>
      </Link>
      <SignUp
        path="/signup"
        signInUrl="/login"
        forceRedirectUrl="/dashboard"
      />
    </main>
  );
}

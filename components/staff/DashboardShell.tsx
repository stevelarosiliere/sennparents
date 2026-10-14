"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { useStaffUser } from "@/components/staff/useStaffUser";
import Shield from "@/components/Shield";

type Role = "admin" | "staff";

/**
 * Shared chrome + guard for /dashboard pages: redirects pending/denied
 * users to /pending, optionally requires a role, and renders the header
 * with an optional back link to the dashboard home.
 */
export default function DashboardShell({
  requireRole,
  backHref,
  children,
}: {
  requireRole?: Role;
  backHref?: string;
  children: (role: Role) => React.ReactNode;
}) {
  const router = useRouter();
  const { loading, user } = useStaffUser();

  useEffect(() => {
    if (user?.role === "pending" || user?.role === "denied") {
      router.replace("/pending");
    } else if (user && requireRole && user.role !== requireRole) {
      router.replace("/dashboard");
    }
  }, [user, requireRole, router]);

  if (
    loading ||
    user === null ||
    user.role === "pending" ||
    user.role === "denied" ||
    (requireRole && user.role !== requireRole)
  ) {
    return (
      <main className="auth-page">
        <p className="lede">Loading…</p>
      </main>
    );
  }

  return (
    <main className="dash-wrap">
      <div className="dash-head">
        <div className="nav-mark">
          <Shield />
          <span>Senn Parents</span>
        </div>
        <SignOutButton redirectUrl="/">
          <button className="dash-signout">Sign out</button>
        </SignOutButton>
      </div>
      {backHref && (
        <Link href={backHref} className="dash-back">
          ← Back to dashboard
        </Link>
      )}
      {children(user.role as Role)}
    </main>
  );
}

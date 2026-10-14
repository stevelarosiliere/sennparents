"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { useStaffUser } from "@/components/staff/useStaffUser";
import Shield from "@/components/Shield";

export default function PendingPage() {
  const router = useRouter();
  const { loading, user } = useStaffUser();

  useEffect(() => {
    if (user !== null && user.role !== "pending" && user.role !== "denied") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (
    loading ||
    user === null ||
    (user.role !== "pending" && user.role !== "denied")
  ) {
    return (
      <main className="auth-page">
        <p className="lede">Loading…</p>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="nav-mark">
        <Shield />
        <span>Senn Parents</span>
      </div>
      <div className="pending-card">
        {user.role === "denied" ? (
          <>
            <h1>Account not approved</h1>
            <p>
              An administrator reviewed your account and did not approve it for
              staff access. If you think this is a mistake, contact the Senn
              Parents team.
            </p>
          </>
        ) : (
          <>
            <h1>Account pending approval</h1>
            <p>
              Thanks for signing up. An administrator needs to approve your
              account before you can use the staff dashboard. Check back soon.
            </p>
          </>
        )}
      </div>
      <SignOutButton redirectUrl="/">
        <button className="dash-signout">Sign out</button>
      </SignOutButton>
    </main>
  );
}

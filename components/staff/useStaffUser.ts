"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * Auth + role plumbing shared by /dashboard and /pending.
 * Redirects to /login when signed out, creates the Convex users row
 * on first visit (role: "pending"), and returns the row once loaded.
 */
export function useStaffUser() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.current, isAuthenticated ? {} : "skip");
  const ensure = useMutation(api.users.ensure);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isLoading, isAuthenticated, router]);

  // First sign-in: no row yet, so create one as "pending".
  useEffect(() => {
    if (isAuthenticated && user === null) void ensure();
  }, [isAuthenticated, user, ensure]);

  return {
    // Still resolving auth, the query, or the initial ensure() round-trip
    loading: isLoading || (isAuthenticated && (user === undefined || user === null)),
    user: user ?? null,
  };
}

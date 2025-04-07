"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, memo } from "react";
import LoadingScreen from "@/components/screens/LoadingScreen";

function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're certain the user is not authenticated
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
    // We intentionally only want this to run when authentication status changes,
    // not on every re-render or tab focus
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? children : null;
}

export default memo(ProtectedRoute); 
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingScreen from "@/components/screens/LoadingScreen";

export default function ProtectedRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/register");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? children : null;
} 
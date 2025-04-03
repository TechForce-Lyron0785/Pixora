"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { UnprotectedRoute, WithLoading } from "@/components/hoc";

export default function AuthLayout({ children }) {
  return (
    <WithLoading>
      <UnprotectedRoute>
        <div className="fixed top-4 right-4 z-50">
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
          >
            <Home className="size-5 mr-2" />
            Back Home
          </Link>
        </div>
        {children}
      </UnprotectedRoute>
    </WithLoading>
  );
}
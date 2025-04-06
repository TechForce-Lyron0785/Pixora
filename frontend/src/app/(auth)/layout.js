"use client";

import { Home, Sparkles } from "lucide-react";
import Link from "next/link";
import { UnprotectedRoute, WithLoading } from "@/components/hoc";

export default function AuthLayout({ children }) {
  return (
    <WithLoading>
      <UnprotectedRoute>
        <div className="flex justify-between items-center px-6 py-4 bg-zinc-950 backdrop-blur-lg border-b border-white/10 text-white">
          {/* Logo */}
          <Link href={"/"} className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg p-2 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold">Pixora</h1>
          </Link>
          <div className="flex items-center space-x-3 ml-2">
            <Link href={"/login"} className="px-4 py-2 text-sm font-medium text-white hover:bg-white/5 rounded-lg transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-lg transition-colors flex items-center">
              <span>Get Started</span>
              <Sparkles className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
        {children}
      </UnprotectedRoute>
    </WithLoading>
  );
}
"use client";
import { Sidebar } from "@/components";
import { ProtectedRoute, WithLoading } from "@/components/hoc";

export default function AuthLayout({ children }) {
  return (
    <ProtectedRoute>
      <WithLoading>
        <div className="flex min-h-screen bg-zinc-950 text-white">
          <Sidebar />
          <div className="ml-20 lg:ml-64 flex-1">
            {children}
          </div>
        </div>
      </WithLoading>
    </ProtectedRoute>
  );
}
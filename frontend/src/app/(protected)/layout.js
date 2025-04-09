"use client";
import { Sidebar, FooterCompact } from "@/components";
import { ProtectedRoute, WithLoading } from "@/components/hoc";
import { memo } from "react";

// Memoize the content to prevent unnecessary re-renders
const LayoutContent = memo(({ children }) => (
  <div className="flex min-h-screen bg-zinc-950 text-white">
    <Sidebar />
    <div className="ml-20 lg:ml-64 flex-1">
      {/* TODO: LOGGED-IN HEADER */}
      {children}
      <FooterCompact />
    </div>
  </div>
));

LayoutContent.displayName = 'LayoutContent';

function AuthLayout({ children }) {
  return (
    <ProtectedRoute>
      <WithLoading>
        <LayoutContent>
          {children}
        </LayoutContent>
      </WithLoading>
    </ProtectedRoute>
  );
}

export default memo(AuthLayout);
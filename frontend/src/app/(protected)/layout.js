"use client";
import { Sidebar, FooterCompact, LoggedInHeader } from "@/components";

function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />
      <div className="ml-20 lg:ml-64 flex-1 pt-16">
        <LoggedInHeader />
        {children}
        <FooterCompact />
      </div>
    </div>
  );
}

export default AuthLayout;
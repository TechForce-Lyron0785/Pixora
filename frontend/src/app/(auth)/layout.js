"use client";

import { Header } from "@/components";

export default function AuthLayout({ children }) {
  return (
    <div className="pt-16 bg-zinc-950">
      <Header />
      {children}
    </div>
  );
}
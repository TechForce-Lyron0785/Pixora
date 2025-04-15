"use client";

import { WithLoading } from "@/components/hoc";
import { Header } from "@/components";

export default function AuthLayout({ children }) {
  return (
    <>
      <Header />
      <div className="pt-16 bg-zinc-950">
        {children}
      </div>
    </>
  );
}
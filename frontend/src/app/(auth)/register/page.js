"use client";

import { motion } from "framer-motion";
import { RegisterForm, ShowcaseGallery } from "@/components/auth/register";

export default function RegisterPage() {
  return (
    <div
      className="relative flex flex-col lg:flex-row bg-zinc-950"
    >
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 px-8 py-5">
        <RegisterForm />
      </div>
      {/* Right Side - Showcase */}
      <ShowcaseGallery />
    </div>
  );
}
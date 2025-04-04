"use client";

import { motion } from "framer-motion";
import { LoginForm, ShowcaseGallery, AnimatedBackground, PageFooter } from "@/components/auth/login";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 m-0 overflow-hidden bg-[#030014] py-8 pt-12">
      {/* Dynamic background with animated gradient and particles */}
      <AnimatedBackground />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-7xl mx-4 flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(123,104,238,0.3)] bg-[#0a0a1b]/70 backdrop-blur-xl border border-[#ffffff10]"
        style={{
          boxShadow: "0 0 80px rgba(111, 0, 255, 0.2), 0 0 32px rgba(255, 0, 229, 0.15)",
        }}
      >
        <ShowcaseGallery />
        {/* Left Side - Form */}
        <div className="w-full lg:w-5/12 p-8 lg:p-12 flex flex-col justify-center relative">
          {/* Glassmorphism card effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff05] to-[#ffffff02] backdrop-blur-sm"></div>
          
          {/* Animated border */}
          <div className="absolute inset-0 p-[1px] rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#7000ff00] via-[#ff00e61f] to-transparent animate-border-flow"></div>
          </div>
          
          <LoginForm />
        </div>

        {/* Right Side - Interactive Showcase with enhanced visuals */}
      </motion.div>

      {/* Enhanced Footer */}
      <PageFooter />
    </div>
  );
}
"use client";

import { motion } from "framer-motion";
import { RegisterForm, ShowcaseGallery, AnimatedBackground } from "@/components/auth/register";

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 m-0 overflow-hidden bg-black py-8 pt-12">
      {/* Dynamic background with animated gradient and particles */}
      <AnimatedBackground />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-7xl mx-4 flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(123,104,238,0.2)] bg-gray-900/80 backdrop-blur-xl border border-gray-800/50"
      >
        {/* Left Side - Form */}
        <div className="w-full lg:w-5/12 p-8 lg:p-12 flex flex-col justify-center relative">
          {/* Animated background elements */}
          <div className="absolute -z-10 top-0 right-0 w-72 h-72 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -z-10 bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl"></div>

          {/* Floating 3D elements */}
          <motion.div
            className="absolute top-20 right-20 w-8 h-8 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg opacity-60"
            animate={{
              rotate: 360,
              y: [0, -10, 0],
            }}
            transition={{
              rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-60"
            animate={{
              rotate: -360,
              x: [0, 10, 0],
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              x: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          />

          <RegisterForm />
        </div>

        {/* Right Side - Showcase */}
        <ShowcaseGallery />
      </motion.div>
    </div>
  );
}
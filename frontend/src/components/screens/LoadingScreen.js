"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 blur-3xl opacity-30 animate-pulse"></div>
        
        {/* Logo container */}
        <motion.div 
          className="relative z-10 flex flex-col items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-2 rounded-2xl shadow-lg shadow-purple-500/20 bg-white/10 backdrop-blur-sm mb-8">
            <Image
              src="/images/logo.png"
              className="w-16 h-16"
              alt="Pixora logo"
              height={64}
              width={64}
            />
          </div>
          
          {/* Branded name */}
          <h1 className="text-3xl font-bold text-white mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Pix</span>ora
          </h1>
          
          {/* Loading indicator */}
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity, 
                  repeatType: "loop",
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
          
          <p className="mt-4 text-sm text-gray-400">Loading amazing things...</p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function AnimatedBackground() {
  // Floating particles animation
  useEffect(() => {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
      const animateParticle = () => {
        const xPos = Math.random() * 100;
        const yPos = Math.random() * 100;
        const scale = (Math.random() * 1) + 0.5;
        const duration = (Math.random() * 20) + 10;

        particle.style.transition = `all ${duration}s ease-out`;
        particle.style.transform = `translate(${xPos}vw, ${yPos}vh) scale(${scale})`;
        particle.style.opacity = Math.random() * 0.5 + 0.1;
      };

      animateParticle();
      setInterval(animateParticle, 20000);
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-950 via-black to-gray-900 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute w-full h-full bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-blue-900/30"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
          animate={{ x: [0, -20], y: [0, -20] }}
          transition={{ duration: 60, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="particle absolute rounded-full opacity-20 bg-white blur-sm"
          style={{
            width: `${Math.random() * 30 + 10}px`,
            height: `${Math.random() * 30 + 10}px`,
            top: `${Math.random() * 100}vh`,
            left: `${Math.random() * 100}vw`,
            transition: `all ${Math.random() * 20 + 10}s ease-out`,
          }}
        />
      ))}
    </div>
  );
} 
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
    <div className="fixed inset-0 bg-gradient-to-b from-[#030014] via-[#080024] to-[#10002b] overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-40">
        <motion.div
          className="absolute w-full h-full bg-gradient-to-r from-[#4f00cf]/30 via-[#7000ff]/20 to-[#ff00e5]/30"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        />
      </div>

      {/* Animated mesh gradient */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute inset-0 bg-[url('/images/mesh-gradient.png')] bg-cover bg-center mix-blend-overlay"></div>
      </motion.div>

      {/* Grid pattern overlay with animation */}
      <div className="absolute inset-0 opacity-15">
        <motion.div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)`,
            backgroundSize: "30px 30px",
          }}
          animate={{ 
            backgroundPosition: ["0px 0px", "30px 30px"]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Enhanced floating particles with glow */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="particle absolute rounded-full opacity-0"
          initial={{
            opacity: 0,
            scale: Math.random() * 0.5 + 0.5,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            opacity: [0, Math.random() * 0.4 + 0.1, 0],
            scale: [0, Math.random() * 1 + 0.5, 0],
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: `${Math.random() * 30 + 10}px`,
            height: `${Math.random() * 30 + 10}px`,
            background: `radial-gradient(circle at center, ${
              ["#ff00e5", "#7000ff", "#4f00cf", "#00ffff"][Math.floor(Math.random() * 4)]
            }, transparent)`,
            boxShadow: `0 0 20px ${
              ["#ff00e5", "#7000ff", "#4f00cf", "#00ffff"][Math.floor(Math.random() * 4)]
            }`,
            filter: "blur(3px)",
          }}
        />
      ))}
      
      {/* Animated light streaks */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`streak-${i}`}
          className="absolute h-[1px] bg-gradient-to-r from-transparent via-[#ff00e5]/50 to-transparent"
          style={{
            width: `${Math.random() * 30 + 20}%`,
            top: `${Math.random() * 100}%`,
            left: `-30%`,
            transform: `rotate(${Math.random() * 20 - 10}deg)`,
          }}
          animate={{
            left: ["0%", "130%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
} 
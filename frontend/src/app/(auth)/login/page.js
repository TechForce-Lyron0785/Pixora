"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Sparkles, Image as ImageIcon, Camera, Zap, ChevronRight, ChevronLeft, AlertCircle, User } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Sample images for the showcase gallery
  const showcaseImages = [
    { id: 1, link: "/images/upload/img6.webp" },
    { id: 2, link: "/images/upload/img7.png" },
    { id: 3, link: "/images/upload/img5.png" },
    { id: 4, link: "/images/upload/user3.png" },
    { id: 5, link: "/images/bg-img2.jpg" },
    { id: 6, link: "/images/bg-img3.jpg" },
  ];

  // Auto-rotate showcase images
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % showcaseImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [showcaseImages.length]);

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

  const validate = () => {
    let tempErrors = {};
    if (!formData.identifier) {
      tempErrors.identifier = "Email or username is required";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      const { success, error } = await login(formData);
      
      if (success) {
        toast.success("Login successful!");
        router.push("/profile");
      } else {
        setErrors({ general: error || "Invalid credentials. Please try again." });
        toast.error(error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setErrors({ general: "An error occurred. Please try again later." });
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 m-0 overflow-hidden bg-[#030014] py-8 pt-12">
      {/* Dynamic background with animated gradient and particles */}
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
        {/* Left Side - Form */}
        <div className="w-full lg:w-5/12 p-8 lg:p-12 flex flex-col justify-center relative">
          {/* Glassmorphism card effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff05] to-[#ffffff02] backdrop-blur-sm"></div>
          
          {/* Animated border */}
          <div className="absolute inset-0 p-[1px] rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#7000ff00] via-[#ff00e61f] to-transparent animate-border-flow"></div>
          </div>
          
          <div className="relative z-10">
            {/* Logo and Brand with enhanced animation */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-10 flex items-center"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="p-2 rounded-xl shadow-lg shadow-[#ff00e5]/20 bg-gradient-to-br from-[#7000ff]/30 to-[#ff00e5]/30 backdrop-blur-sm"
              >
                <Image
                  src="/images/logo.png"
                  className="w-8 h-8"
                  alt="Pixora logo"
                  height={20}
                  width={20}
                />
              </motion.div>
              <span className="text-white font-bold text-2xl ml-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7000ff] to-[#ff00e5]">Pix</span>ora
              </span>
            </motion.div>

            {/* Header with enhanced typography */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="text-3xl lg:text-4xl font-bold mb-3 tracking-tight">
                <span className="text-white">Welcome </span>
                <motion.span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-[#7000ff] to-[#ff00e5]"
                  animate={{ 
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  back
                </motion.span>
              </h1>

              <p className="mb-8 text-[#ffffffcc] font-light">
                Log in to create, share and discover incredible AI-generated imagery
              </p>
            </motion.div>

            {/* Login Form with enhanced interactivity */}
            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-[#ff005520] border border-[#ff005540] text-[#ff4081] text-sm mb-4 flex items-center"
                >
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{errors.general}</span>
                </motion.div>
              )}

              {/* Email/Username Field with enhanced focus effects */}
              <div className="space-y-2">
                <label htmlFor="identifier" className="block text-sm font-medium text-[#ffffffcc]">
                  Email or Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ffffff80] group-focus-within:text-[#ff00e5] transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    id="identifier"
                    name="identifier"
                    type="text"
                    autoComplete="email username"
                    value={formData.identifier}
                    onChange={handleChange}
                    className={`block w-full pl-12 pr-4 py-4 rounded-xl text-sm bg-[#ffffff08] border ${
                      errors.identifier ? "border-red-500" : "border-[#ffffff20]"
                    } text-white placeholder-[#ffffff60] focus:ring-2 focus:ring-[#ff00e5] focus:border-[#ff00e5] transition-all duration-200`}
                    placeholder="your.email@example.com or username"
                  />
                  {errors.identifier && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#7000ff00] via-[#ff00e550] to-[#7000ff00] transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                </div>
                <AnimatePresence>
                  {errors.identifier && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-[#ff4081]"
                    >
                      {errors.identifier}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password Field with enhanced focus effects */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-[#ffffffcc]">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ffffff80] group-focus-within:text-[#ff00e5] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-12 pr-12 py-4 rounded-xl text-sm bg-[#ffffff08] border ${
                      errors.password ? "border-red-500" : "border-[#ffffff20]"
                    } text-white placeholder-[#ffffff60] focus:ring-2 focus:ring-[#ff00e5] focus:border-[#ff00e5] transition-all duration-200`}
                    placeholder="••••••••"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#ffffff80] hover:text-white transition-colors"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </motion.button>
                  {errors.password && (
                    <div className="absolute inset-y-0 right-12 pr-3 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#7000ff00] via-[#ff00e550] to-[#7000ff00] transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-[#ff4081]"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Remember Me & Forgot Password with enhanced interactivity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded focus:ring-[#ff00e5] bg-[#ffffff10] border-[#ffffff30] text-[#ff00e5] appearance-none checked:bg-[#ff00e5]"
                    />
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center text-white opacity-0 pointer-events-none"
                      animate={{ opacity: formData.rememberMe ? 1 : 0 }}
                    >
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 1L3.5 6.5L1 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  </div>
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-[#ffffffcc]">
                    Remember me
                  </label>
                </div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-sm"
                >
                  <Link href="/forgot-password" className="font-medium text-[#ff00e5] hover:text-[#ff4081] transition-colors">
                    Forgot password?
                  </Link>
                </motion.div>
              </div>

              {/* Sign In Button with enhanced animation */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 0, 229, 0.5)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-4 px-4 rounded-xl text-base font-medium text-white bg-gradient-to-r from-[#7000ff] to-[#ff00e5] hover:from-[#8929ff] hover:to-[#ff4081] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff00e5] transition-all duration-200 shadow-lg shadow-[#ff00e5]/20"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <>
                    <span>Sign in</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                    >
                      <Zap className="ml-2 h-4 w-4" />
                    </motion.div>
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Social Login Options with enhanced interactivity */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8"
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#ffffff15]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#0a0a1b] text-[#ffffff80]">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {/* Google Button with enhanced hover effects */}
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 0 15px rgba(255, 0, 229, 0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="w-full inline-flex justify-center items-center py-3 px-4 rounded-xl shadow-sm bg-[#ffffff08] text-[#ffffffcc] border border-[#ffffff15] hover:bg-[#ffffff10] transition-all duration-200"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                    </g>
                  </svg>
                </motion.button>

                {/* Apple Button with enhanced hover effects */}
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 0 15px rgba(255, 0, 229, 0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="w-full inline-flex justify-center items-center py-3 px-4 rounded-xl shadow-sm bg-[#ffffff08] text-[#ffffffcc] border border-[#ffffff15] hover:bg-[#ffffff10] transition-all duration-200"
                >
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </motion.button>

                {/* Twitter/X Button with enhanced hover effects */}
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 0 15px rgba(255, 0, 229, 0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="w-full inline-flex justify-center items-center py-3 px-4 rounded-xl shadow-sm bg-[#ffffff08] text-[#ffffffcc] border border-[#ffffff15] hover:bg-[#ffffff10] transition-all duration-200"
                >
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                </motion.button>
              </div>
            </motion.div>

            {/* Sign Up Link with enhanced animation */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8 text-center text-sm text-[#ffffff80]"
            >
              Don&apos;t have an account?{' '}
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-block"
              >
                <Link href="/register" className="font-medium text-[#ff00e5] hover:text-[#ff4081] transition-colors">
                  Create an account
                </Link>
              </motion.span>
            </motion.p>
          </div>
        </div>

        {/* Right Side - Interactive Showcase with enhanced visuals */}
        <div className="w-full lg:w-7/12 relative overflow-hidden bg-gradient-to-br from-[#0a0a1b] to-[#030014] min-h-[400px] lg:min-h-[600px]">
          {/* Animated 3D grid with perspective */}
          <div className="absolute inset-0 perspective-1000">
            <motion.div
              className="absolute inset-0 transform-style-3d"
              animate={{ 
                rotateX: [0, 5, 0], 
                rotateY: [0, 10, 0] 
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                repeatType: "mirror", 
                ease: "easeInOut" 
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#7000ff]/5 to-[#ff00e5]/5">
                <svg className="absolute w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="smallGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                      <path d="M 15 0 L 0 0 0 15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    </pattern>
                    <pattern id="grid" width="75" height="75" patternUnits="userSpaceOnUse">
                      <rect width="75" height="75" fill="url(#smallGrid)" />
                      <path d="M 75 0 L 0 0 0 75" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                    </pattern>
                    <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,1)" />
                    </linearGradient>
                    <mask id="gridMask">
                      <rect width="100%" height="100%" fill="url(#fadeGradient)" />
                    </mask>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridMask)" />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* 3D Showcase Gallery with enhanced animations */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative w-full max-w-lg"
            >
              {/* Interactive 3D Image Carousel */}
              <div className="relative h-80 md:h-96 mb-12 perspective-1000">
                <motion.div 
                  className="absolute -inset-8"
                  animate={{ rotateY: [0, 5, 0], rotateX: [0, 3, 0] }}
                  transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                >
                  {showcaseImages.map((image, index) => (
                    <motion.div
                      key={image.id}
                      className={`absolute inset-0 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.3)] border border-white/10 transform-style-3d ${
                        activeImageIndex === index ? 'z-10' : 'z-0'
                      }`}
                      initial={{ opacity: 0, scale: 0.8, rotateY: -15, z: -100 }}
                      animate={{
                        opacity: activeImageIndex === index ? 1 : 0,
                        scale: activeImageIndex === index ? 1 : 0.8,
                        rotateY: activeImageIndex === index ? 0 : (index > activeImageIndex ? 25 : -25),
                        z: activeImageIndex === index ? 0 : -100,
                        x: activeImageIndex === index ? 0 : (index > activeImageIndex ? 50 : -50)
                      }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                      <div className="w-full h-full relative group">
                        <Image
                          src={image.link}
                          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                          alt="Pixora creation"
                          height={400}
                          width={400}
                          priority={index === activeImageIndex}
                        />
                        
                        {/* Interactive overlay with hover effects */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div className="bg-cyan-500/80 p-1.5 rounded-lg backdrop-blur-sm">
                                  <Camera className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-white font-medium">Creation #{image.id}</span>
                              </div>
                              <div className="flex space-x-2">
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="bg-white/10 p-1.5 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
                                >
                                  <Sparkles className="h-4 w-4 text-cyan-300" />
                                </motion.button>
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="bg-white/10 p-1.5 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
                                >
                                  <Zap className="h-4 w-4 text-fuchsia-300" />
                                </motion.button>
                              </div>
                            </div>
                            <div className="text-xs text-white/70 mt-2 font-light">Created with Pixora AI Studio</div>
                          </div>
                        </div>
                        
                        {/* Interactive particles on hover */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          {[...Array(15)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 rounded-full bg-white/80"
                              initial={{ 
                                x: Math.random() * 100 + "%", 
                                y: "100%", 
                                opacity: 0.3 + Math.random() * 0.7 
                              }}
                              animate={{ 
                                y: "0%",
                                opacity: 0
                              }}
                              transition={{ 
                                duration: 1 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Interactive navigation controls */}
              <div className="flex justify-center items-center space-x-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 p-2 rounded-full backdrop-blur-sm border border-cyan-500/30 text-cyan-400 hover:text-white transition-colors"
                  onClick={() => setActiveImageIndex((prev) => (prev - 1 + showcaseImages.length) % showcaseImages.length)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </motion.button>
                
                <div className="flex space-x-2">
                  {showcaseImages.map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className="relative group"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className={`block w-2 h-2 rounded-full transition-all duration-300 ${
                        activeImageIndex === i 
                          ? 'bg-gradient-to-r from-cyan-400 to-fuchsia-400 w-8' 
                          : 'bg-gray-600 group-hover:bg-gray-400'
                      }`} />
                      {activeImageIndex === i && (
                        <motion.span 
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/50 to-fuchsia-400/50 blur-sm"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-gradient-to-r from-fuchsia-500/10 to-fuchsia-500/20 p-2 rounded-full backdrop-blur-sm border border-fuchsia-500/30 text-fuchsia-400 hover:text-white transition-colors"
                  onClick={() => setActiveImageIndex((prev) => (prev + 1) % showcaseImages.length)}
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Interactive feature cards */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { 
                    icon: <Sparkles className="h-5 w-5" />, 
                    text: "AI-Powered Generation", 
                    description: "Create stunning visuals instantly",
                    color: "from-cyan-500/20 to-cyan-600/10",
                    borderColor: "cyan-500/30",
                    iconColor: "text-cyan-400"
                  },
                  { 
                    icon: <Camera className="h-5 w-5" />, 
                    text: "Smart Photo Enhancement", 
                    description: "Transform ordinary to extraordinary",
                    color: "from-purple-500/20 to-purple-600/10",
                    borderColor: "purple-500/30",
                    iconColor: "text-purple-400"
                  },
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + (idx * 0.1), duration: 0.5 }}
                    whileHover={{ 
                      y: -5,
                      boxShadow: `0 10px 25px -5px rgba(139, 92, 246, 0.3)`,
                      transition: { duration: 0.2 }
                    }}
                    className={`bg-gradient-to-br ${feature.color} backdrop-blur-lg border border-${feature.borderColor} rounded-xl p-4 hover:border-white/20 transition-all duration-300`}
                  >
                    <div className={`${feature.iconColor} mb-2`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-white font-medium text-sm">{feature.text}</h3>
                    <p className="text-gray-300 text-xs mt-1">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Interactive call-to-action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="mt-5 text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(139, 92, 246, 0.5)" }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-cyan-500 via-purple-500 to-fuchsia-500 text-white font-medium py-3 px-8 rounded-full hover:from-cyan-600 hover:via-purple-600 hover:to-fuchsia-600 transition-all duration-300"
                >
                  Start Creating Now
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Floating interactive elements */}
          {[...Array(8)].map((_, i) => {
            const size = 40 + Math.random() * 100;
            const delay = Math.random() * 4;
            const duration = 15 + Math.random() * 20;
            const colors = [
              "from-cyan-500/15 to-cyan-600/5",
              "from-purple-500/15 to-purple-600/5",
              "from-fuchsia-500/15 to-fuchsia-600/5",
              "from-blue-500/15 to-blue-600/5"
            ];
            const colorIndex = Math.floor(Math.random() * colors.length);

            return (
              <motion.div
                key={i}
                className={`absolute rounded-xl bg-gradient-to-br ${colors[colorIndex]} backdrop-blur-xl border border-white/10 hover:border-white/20 transition-colors duration-300`}
                style={{ width: size, height: size }}
                initial={{
                  x: Math.random() * 1000 - 500,
                  y: Math.random() * 1000 - 500,
                  opacity: 0,
                  rotate: Math.random() * 360,
                  scale: 0.5
                }}
                animate={{
                  x: Math.random() * 1000 - 500,
                  y: Math.random() * 1000 - 500,
                  opacity: 0.3,
                  rotate: Math.random() * 360,
                  scale: 1
                }}
                transition={{
                  duration: duration,
                  delay: delay,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
                whileHover={{
                  opacity: 0.6,
                  scale: 1.2,
                  transition: { duration: 0.3 }
                }}
              />
            );
          })}

          {/* Dynamic radial glow effects */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              className="absolute w-1/2 h-1/2 rounded-full bg-gradient-to-r from-cyan-600/10 via-purple-600/10 to-fuchsia-600/10 blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            ></motion.div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-4 left-0 right-0 text-center"
      >
        <div className="text-xs text-gray-500 flex items-center justify-center space-x-4">
          <span>&copy; {new Date().getFullYear()} Pixora AI Studio</span>
          <span className="h-3 w-px bg-gray-700"></span>
          <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
          <span className="h-3 w-px bg-gray-700"></span>
          <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
          <span className="h-3 w-px bg-gray-700"></span>
          <Link href="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link>
        </div>
      </motion.div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, User, Sparkles, Image as ImageIcon, Camera, Zap, ChevronLeft, ChevronRight, UserPlus, CheckCircle, AtSign, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Footer, Header } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { register, checkUserExists, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    fullName: "",
    email: "",
    username: "",

    // Step 2: Security
    password: "",
    confirmPassword: "",

    // Step 3: Preferences
    interests: [],
    subscribeNewsletter: false,
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [validationPassed, setValidationPassed] = useState({
    username: false,
    email: false
  });

  // Available interests for selection
  const availableInterests = [
    "Photography", "Digital Art", "AI Generation",
    "Landscapes", "Portraits", "Abstract",
    "Fantasy", "Sci-Fi", "Nature"
  ];

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

  const validateStep = (step) => {
    let tempErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) {
        tempErrors.fullName = "Full name is required";
      }

      if (!formData.email) {
        tempErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        tempErrors.email = "Email address is invalid";
      }

      if (!formData.username.trim()) {
        tempErrors.username = "Username is required";
      } else if (formData.username.length < 3) {
        tempErrors.username = "Username must be at least 3 characters";
      }
    }

    if (step === 2) {
      if (!formData.password) {
        tempErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        tempErrors.password = "Password must be at least 8 characters";
      }

      if (!formData.confirmPassword) {
        tempErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        tempErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (step === 3) {
      if (!formData.agreeToTerms) {
        tempErrors.agreeToTerms = "You must agree to the terms and conditions";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Reset validation status when field changes
    if (name === 'username' || name === 'email') {
      setValidationPassed(prev => ({ ...prev, [name]: false }));
    }
    
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const handleInterestToggle = (interest) => {
    const updatedInterests = [...formData.interests];
    if (updatedInterests.includes(interest)) {
      const index = updatedInterests.indexOf(interest);
      updatedInterests.splice(index, 1);
    } else {
      updatedInterests.push(interest);
    }
    setFormData({ ...formData, interests: updatedInterests });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const nextStep = async () => {
    if (!validateStep(currentStep)) return;

    // For step 1, check if username or email is already taken
    if (currentStep === 1) {
      try {
        setIsSubmitting(true);
        // Check if username or email exists
        const { exists: usernameExists, message: usernameMessage } = await checkUserExists({ 
          username: formData.username 
        });
        
        if (usernameExists) {
          setErrors(prev => ({ ...prev, username: usernameMessage }));
          setValidationPassed(prev => ({ ...prev, username: false }));
          setIsSubmitting(false);
          return;
        } else {
          setValidationPassed(prev => ({ ...prev, username: true }));
        }
        
        const { exists: emailExists, message: emailMessage } = await checkUserExists({ 
          email: formData.email 
        });
        
        if (emailExists) {
          setErrors(prev => ({ ...prev, email: emailMessage }));
          setValidationPassed(prev => ({ ...prev, email: false }));
          setIsSubmitting(false);
          return;
        } else {
          setValidationPassed(prev => ({ ...prev, email: true }));
        }
        
        setIsSubmitting(false);
      } catch (error) {
        setIsSubmitting(false);
        toast.error("An error occurred. Please try again.");
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    
    try {
      // Submit registration data
      const userData = {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const { success, error, data } = await register(userData);

      if (success) {
        toast.success("Registration successful!");
        router.push("/"); // Redirect to home page
      } else {
        toast.error(error || "Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step indicators
  const StepIndicator = () => (
    <div className="flex justify-center items-center mb-8">
      {[...Array(totalSteps)].map((_, idx) => (
        <div key={idx} className="flex items-center">
          <div
            className={`rounded-full transition-all flex items-center justify-center ${idx + 1 === currentStep
              ? "bg-purple-500 text-white"
              : idx + 1 < currentStep
                ? "bg-green-500 text-white"
                : "bg-gray-700 text-gray-400"
              } h-8 w-8 text-sm font-medium`}
          >
            {idx + 1 < currentStep ? <CheckCircle className="h-4 w-4" /> : idx + 1}
          </div>
          {idx < totalSteps - 1 && (
            <div
              className={`h-1 w-12 mx-1 ${idx + 1 < currentStep ? "bg-green-500" : "bg-gray-700"
                }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-white">Let{"'"}s get started</h2>
              <p className="text-gray-400">Tell us a bit about yourself</p>
            </div>

            {/* Full Name Field */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-400 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-4 rounded-xl text-sm bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>
              <AnimatePresence>
                {errors.fullName && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-red-400"
                  >
                    {errors.fullName}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-12 pr-10 py-4 rounded-xl text-sm bg-gray-800/50 border ${
                    errors.email 
                      ? "border-red-500" 
                      : validationPassed.email 
                        ? "border-green-500" 
                        : "border-gray-700"
                  } text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                  placeholder="your.email@example.com"
                />
                {validationPassed.email && !errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
                {errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-red-400"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-400 transition-colors">
                  <AtSign className="w-5 h-5" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className={`block w-full pl-12 pr-10 py-4 rounded-xl text-sm bg-gray-800/50 border ${
                    errors.username 
                      ? "border-red-500" 
                      : validationPassed.username 
                        ? "border-green-500" 
                        : "border-gray-700"
                  } text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                  placeholder="coolcreator"
                />
                {validationPassed.username && !errors.username && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
                {errors.username && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              <AnimatePresence>
                {errors.username && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-red-400"
                  >
                    {errors.username}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-white">Secure your account</h2>
              <p className="text-gray-400">Create a strong password for protection</p>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-12 py-4 rounded-xl text-sm bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-red-400"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
              <p className="text-xs text-gray-400 mt-1">
                Password must be at least 8 characters long
              </p>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-12 py-4 rounded-xl text-sm bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <AnimatePresence>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-red-400"
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password Strength Indicator - Visual feedback */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Password Strength</label>
              <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${!formData.password
                    ? "w-0"
                    : formData.password.length < 6
                      ? "w-1/4 bg-red-500"
                      : formData.password.length < 8
                        ? "w-2/4 bg-yellow-500"
                        : formData.password.length < 10
                          ? "w-3/4 bg-blue-500"
                          : "w-full bg-green-500"
                    }`}
                />
              </div>
              <p className="text-xs text-gray-400">
                {!formData.password
                  ? "Enter a password"
                  : formData.password.length < 6
                    ? "Weak: Add more characters"
                    : formData.password.length < 8
                      ? "Fair: Getting better"
                      : formData.password.length < 10
                        ? "Good: Almost there"
                        : "Strong: Excellent password!"}
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-white">Personalize your experience</h2>
              <p className="text-gray-400">Select your interests to personalize your feed</p>
            </div>

            {/* Interests Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                What are you interested in?
              </label>
              <div className="flex flex-wrap gap-2 mt-3">
                {availableInterests.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${formData.interests.includes(interest)
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Selected: {formData.interests.length > 0 ? formData.interests.join(", ") : "None"}
              </p>
            </div>

            {/* Newsletter Subscription */}
            <div className="flex items-center">
              <input
                id="subscribeNewsletter"
                name="subscribeNewsletter"
                type="checkbox"
                checked={formData.subscribeNewsletter}
                onChange={handleChange}
                className="h-4 w-4 rounded focus:ring-purple-500 bg-gray-800 border-gray-700 text-purple-600"
              />
              <label htmlFor="subscribeNewsletter" className="ml-2 block text-sm text-gray-300">
                Subscribe to our newsletter for updates and tips
              </label>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 rounded focus:ring-purple-500 bg-gray-800 border-gray-700 text-purple-600"
                />
              </div>
              <div className="ml-2 text-sm">
                <label htmlFor="agreeToTerms" className="text-gray-300">
                  I agree to the <Link href="/terms" className="text-purple-400 hover:text-purple-300">Terms of Service</Link> and <Link href="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link>
                </label>
                <AnimatePresence>
                  {errors.agreeToTerms && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-red-400 mt-1"
                    >
                      {errors.agreeToTerms}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 m-0 overflow-hidden bg-black py-8 pt-12">
      {/* Dynamic background with animated gradient and particles */}
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
          />          {/* Logo and Brand */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 flex items-center"
          >
            <div className="p-1 rounded-md shadow-lg shadow-gray-500/20 bg-white/10 backdrop-blur-sm">
              <Image
                src="/images/logo.png"
                className="w-8 h-8"
                alt="Pixora logo"
                height={20}
                width={20}
              />
            </div>
            <span className="text-white font-bold text-2xl ml-3">Pixora</span>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 text-white tracking-tight">
              Create your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">account</span>
            </h1>
            <p className="mb-6 text-gray-300">
              Join Pixora to create and share AI-generated imagery
            </p>
          </motion.div>

          {/* Step Indicator */}
          <StepIndicator />

          {/* Multi-step Form Container */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <form onSubmit={currentStep === totalSteps ? handleSubmit : (e) => e.preventDefault()}>
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="mt-10 flex justify-between">
                {currentStep > 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={prevStep}
                    className="flex items-center px-6 py-3 rounded-xl text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition-all duration-200"
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Back
                  </motion.button>
                ) : (
                  <div></div> // Empty div for flex spacing
                )}

                {currentStep < totalSteps ? (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={nextStep}
                    disabled={isSubmitting}
                    className="flex items-center px-6 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-lg shadow-purple-500/20"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Checking...
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="h-5 w-5 ml-1" />
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center px-6 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-lg shadow-purple-500/20"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Complete Registration
                        <UserPlus className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Social Registration */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="h-px w-full bg-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900 text-gray-400">or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                className="w-full py-3 px-4 rounded-xl font-medium text-gray-400 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 flex justify-center items-center text-sm transition-all"
              >
                <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.0003 2C6.47731 2 2.00031 6.477 2.00031 12C2.00031 16.991 5.65731 21.128 10.4383 21.879V14.89H7.89831V12H10.4383V9.797C10.4383 7.291 11.9323 5.907 14.2153 5.907C15.3103 5.907 16.4543 6.102 16.4543 6.102V8.562H15.1923C13.9503 8.562 13.5623 9.333 13.5623 10.124V12H16.3363L15.8933 14.89H13.5623V21.879C18.3433 21.129 22.0003 16.99 22.0003 12C22.0003 6.477 17.5233 2 12.0003 2Z" />
                </svg>
              </button>
              <button
                type="button"
                className="w-full py-3 px-4 rounded-xl font-medium text-gray-400 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 flex justify-center items-center text-sm transition-all"
              >
                <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </button>
              <button
                type="button"
                className="w-full py-3 px-4 rounded-xl font-medium text-gray-400 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 flex justify-center items-center text-sm transition-all"
              >
                <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Login Link */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Right Side - Showcase */}
        <div className="hidden lg:block lg:w-7/12 relative overflow-hidden">
          {/* Feature highlight text */}
          <div className="absolute top-12 left-12 z-10 max-w-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <div className="p-1 rounded-full bg-purple-500/20 backdrop-blur-sm">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                </div>
                <span className="ml-2 text-sm font-medium text-purple-400">AI-POWERED CREATIVITY</span>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-white">Unleash your creative potential</h2>
              <p className="text-gray-300">
                Generate stunning visuals with our AI tools and join a community of creators sharing their work.
              </p>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mt-6 flex flex-wrap gap-2"
            >
              <div className="flex items-center bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Camera className="h-4 w-4 text-purple-400 mr-1.5" />
                <span className="text-xs text-gray-300">Powerful Image Generation</span>
              </div>
              <div className="flex items-center bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <ImageIcon className="h-4 w-4 text-purple-400 mr-1.5" />
                <span className="text-xs text-gray-300">Style Transfer</span>
              </div>
              <div className="flex items-center bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Zap className="h-4 w-4 text-purple-400 mr-1.5" />
                <span className="text-xs text-gray-300">Fast Processing</span>
              </div>
            </motion.div>
          </div>

          {/* Image Gallery */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="relative h-full w-full">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-transparent z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"></div>

              {/* Image Gallery */}
              <div className="relative z-0 w-full h-full">
                <AnimatePresence initial={false}>
                  {showcaseImages.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{
                        opacity: index === activeImageIndex ? 1 : 0,
                        scale: index === activeImageIndex ? 1 : 1.1,
                      }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <div className="w-full h-full relative">
                        <Image
                          src={image.link}
                          alt="AI generated artwork"
                          className="object-cover"
                          fill
                          priority={index === 0}
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Image gallery navigation dots */}
          <div className="absolute bottom-8 inset-x-0 flex justify-center z-20">
            <div className="flex space-x-2">
              {showcaseImages.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all ${index === activeImageIndex ? "w-6 bg-purple-500" : "w-2 bg-gray-500"
                    }`}
                  onClick={() => setActiveImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
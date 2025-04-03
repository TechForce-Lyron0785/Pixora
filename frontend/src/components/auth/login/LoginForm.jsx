import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Lock, AlertCircle, User, Zap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function LoginForm() {
  const router = useRouter();
  const { login, googleLogin } = useAuth();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Optimize validation by using a memoized callback
  const validate = useCallback(() => {
    const tempErrors = {};
    if (!formData.identifier) {
      tempErrors.identifier = "Email or username is required";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }, [formData.identifier, formData.password]);

  // Optimize input handler with a debounced approach
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

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

  // Precompute static animation props to avoid recreating objects on each render
  const logoAnimationProps = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay: 0.2, duration: 0.5 }
  };

  const headerAnimationProps = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay: 0.3, duration: 0.5 }
  };

  const formAnimationProps = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay: 0.4, duration: 0.5 }
  };

  const socialAnimationProps = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay: 0.5, duration: 0.5 }
  };

  const signupAnimationProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay: 0.6, duration: 0.5 }
  };

  return (
    <div className="relative z-10">
      {/* Logo and Brand with enhanced animation */}
      <motion.div
        {...logoAnimationProps}
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
        {...headerAnimationProps}
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
        {...formAnimationProps}
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
            <input
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
              <Lock className="w-5 w-5" />
            </div>
            <input
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
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#ffffff80] hover:text-white transition-colors"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
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
          <div className="text-sm">
            <Link href="/forgot-password" className="font-medium text-[#ff00e5] hover:text-[#ff4081] transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Sign In Button with enhanced animation */}
        <button
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
              <Zap className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </motion.form>

      {/* Social Login Options with enhanced interactivity */}
      <motion.div
        {...socialAnimationProps}
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
          <button
            type="button"
            onClick={googleLogin}
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
          </button>

          {/* Apple Button with enhanced hover effects */}
          <button
            type="button"
            className="w-full inline-flex justify-center items-center py-3 px-4 rounded-xl shadow-sm bg-[#ffffff08] text-[#ffffffcc] border border-[#ffffff15] hover:bg-[#ffffff10] transition-all duration-200"
          >
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
          </button>

          {/* Twitter/X Button with enhanced hover effects */}
          <button
            type="button"
            className="w-full inline-flex justify-center items-center py-3 px-4 rounded-xl shadow-sm bg-[#ffffff08] text-[#ffffffcc] border border-[#ffffff15] hover:bg-[#ffffff10] transition-all duration-200"
          >
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
          </button>
        </div>
      </motion.div>

      {/* Sign Up Link with enhanced animation */}
      <motion.p
        {...signupAnimationProps}
        className="mt-8 text-center text-sm text-[#ffffff80]"
      >
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-[#ff00e5] hover:text-[#ff4081] transition-colors">
          Create an account
        </Link>
      </motion.p>
    </div>
  );
}
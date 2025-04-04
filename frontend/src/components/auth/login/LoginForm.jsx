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
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const { success, error } = await login(formData);

      if (success) {
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        setErrors({
          general: error || "Invalid credentials. Please try again.",
        });
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
    transition: { delay: 0.2, duration: 0.5 },
  };

  const headerAnimationProps = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay: 0.3, duration: 0.5 },
  };

  const formAnimationProps = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay: 0.4, duration: 0.5 },
  };

  const socialAnimationProps = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay: 0.5, duration: 0.5 },
  };

  const signupAnimationProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay: 0.6, duration: 0.5 },
  };

  return (
    <div className="relative z-10">
      {/* Logo and Brand with enhanced animation */}
      <motion.div {...logoAnimationProps} className="mb-10 flex items-center">
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
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7000ff] to-[#ff00e5]">
            Pix
          </span>
          ora
        </span>
      </motion.div>

      {/* Header with enhanced typography */}
      <motion.div {...headerAnimationProps}>
        <h1 className="text-3xl lg:text-4xl font-bold mb-3 tracking-tight">
          <span className="text-white">Welcome </span>
          <motion.span
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#7000ff] to-[#ff00e5]"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
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
          <label
            htmlFor="identifier"
            className="block text-sm font-medium text-[#ffffffcc]"
          >
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
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#ffffffcc]"
          >
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
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
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
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 1L3.5 6.5L1 4"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </div>
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-[#ffffffcc]"
            >
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-[#ff00e5] hover:text-[#ff4081] transition-colors"
            >
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
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
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
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8"
      >
        <button
          type="button"
          onClick={googleLogin}
          className="w-full py-3 px-4 rounded-xl font-medium text-gray-400 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 flex justify-center items-center text-sm transition-all gap-2 cursor-pointer"
        >
          <svg
            className="h-5 w-5"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-base">Continue with Google</span>
        </button>
      </motion.div>

      {/* Sign Up Link with enhanced animation */}
      <motion.p
        {...signupAnimationProps}
        className="mt-8 text-center text-sm text-[#ffffff80]"
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-[#ff00e5] hover:text-[#ff4081] transition-colors"
        >
          Create an account
        </Link>
      </motion.p>
    </div>
  );
}

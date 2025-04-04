"use client"
import React, { useState, useCallback } from 'react';
import { Sparkles, Mail, Lock, Eye, EyeOff, Github, Twitter, AlertCircle } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";

const LoginPage = () => {
  const router = useRouter();
  const { login, googleLogin } = useAuth();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

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

  const handleGoogleLogin = useCallback(async () => {
    try {
      await googleLogin();
    } catch (error) {
      toast.error("Google login failed. Please try again.");
    }
  }, [googleLogin]);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      {/* Left side - Login form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative">
        {/* Logo */}
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg p-2 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">Pixora</h1>
        </div>

        {/* Login form */}
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
            <p className="text-gray-400">Sign in to your Pixora account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-4 rounded-lg bg-red-900/20 border border-red-800/40 text-red-400 text-sm mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{errors.general}</span>
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="identifier" className="text-sm font-medium text-gray-300">Email or Username</label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  value={formData.identifier}
                  onChange={handleChange}
                  className={`bg-zinc-800/50 border ${errors.identifier ? 'border-red-500' : 'border-white/10'} rounded-lg py-3 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-white placeholder-gray-500`}
                  placeholder="name@example.com or username"
                />
                {errors.identifier && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.identifier && (
                <p className="text-sm text-red-500">{errors.identifier}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`bg-zinc-800/50 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-lg py-3 pl-10 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-white placeholder-gray-500`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {errors.password && (
                  <div className="absolute inset-y-0 right-10 pr-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 bg-zinc-800"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-violet-400 hover:text-violet-300">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium transition-all duration-300"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
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
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-zinc-950 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button 
                onClick={handleGoogleLogin}
                className="flex justify-center items-center py-2 px-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
              >
                <FaGoogle className="size-4" />
              </button>
              <button className="flex justify-center items-center py-2 px-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="flex justify-center items-center py-2 px-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                <Github className="w-5 h-5" />
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-violet-400 hover:text-violet-300">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image/gradient with floating elements */}
      <div className="hidden lg:block w-1/2 bg-gradient-to-br from-violet-900 via-fuchsia-900 to-zinc-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-violet-500 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-fuchsia-500 blur-3xl"></div>
          <div className="absolute top-2/3 left-1/2 w-24 h-24 rounded-full bg-rose-500 blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-12">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold mb-4">Create, Share, and Discover Amazing Images</h2>
            <p className="text-lg text-white/80 mb-8">Join our creative community of artists and photographers from around the world.</p>
            
            {/* Image gallery preview */}
            <div className="grid grid-cols-3 gap-2 mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
                  <img 
                    src={`/api/placeholder/${(i+1)*100}/${(i+1)*100}`} 
                    alt="Gallery preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-800 overflow-hidden">
                    <img src={`/api/placeholder/${(i+1)*20}/${(i+1)*20}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-sm">Join <span className="font-bold">12,000+</span> creators</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
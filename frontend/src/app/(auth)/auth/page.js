"use client"
import React, { useState } from 'react';
import { Sparkles, Mail, Lock, Eye, EyeOff, Github, Twitter, Google } from 'lucide-react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempted with:', { email, password, rememberMe });
    // Add your authentication logic here
  };

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
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-800/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-white placeholder-gray-500"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-800/50 border border-white/10 rounded-lg py-3 pl-10 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-white placeholder-gray-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 bg-zinc-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-violet-400 hover:text-violet-300">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium transition-all duration-300"
            >
              Sign in
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
              <button className="flex justify-center items-center py-2 px-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                {/* <Google className="w-5 h-5" /> */}
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
            <a href="#" className="font-medium text-violet-400 hover:text-violet-300">
              Create an account
            </a>
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
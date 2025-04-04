"use client"
import React, { useState } from 'react';
import { Sparkles, Mail, Lock, Eye, EyeOff, Github, Twitter, User, UserCircle, ArrowRight, CheckCircle, Camera, FileImage } from 'lucide-react';

const RegisterPage = () => {
  // State management
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    agreeTerms: false,
    profileImage: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Image preview handlers
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({...formData, profileImage: file});
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setFormData({...formData, profileImage: null});
  };

  // Form handlers
  const updateFormData = (field, value) => {
    setFormData({...formData, [field]: value});
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateFirstStep = () => {
    // Basic validation for first step
    if (!formData.fullName || !formData.email || !formData.password || !formData.agreeTerms) {
      return false;
    }
    return formData.password.length >= 8;
  };

  const goToNextStep = () => {
    if (validateFirstStep()) {
      setStep(2);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Registration submitted:', formData);
      setLoading(false);
      // Redirect or show success message
    }, 1500);
  };

  // Sample gallery images
  const sampleGallery = [
    "/api/placeholder/600/400",
    "/api/placeholder/601/400",
    "/api/placeholder/602/400",
    "/api/placeholder/603/400",
    "/api/placeholder/604/400",
    "/api/placeholder/605/400"
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      {/* Left side - Registration form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative">
        {/* Logo */}
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg p-2 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">Pixora</h1>
        </div>

        {/* Progress indicator */}
        <div className="w-full max-w-md mb-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-violet-600' : 'bg-zinc-800'}`}>
                {step > 1 ? <CheckCircle className="w-5 h-5" /> : <span>1</span>}
              </div>
              <span className="text-xs mt-1 text-gray-400">Account</span>
            </div>
            <div className="h-1 flex-1 mx-2 bg-zinc-800">
              <div className={`h-full ${step === 2 ? 'bg-violet-600' : 'bg-zinc-800'}`} style={{ width: `${step > 1 ? '100%' : '0%'}`, transition: 'width 0.3s ease' }}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 2 ? 'bg-violet-600' : 'bg-zinc-800'}`}>
                <span>2</span>
              </div>
              <span className="text-xs mt-1 text-gray-400">Profile</span>
            </div>
          </div>
        </div>

        {/* Registration form */}
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              {step === 1 ? 'Join Pixora' : 'Complete Your Profile'}
            </h2>
            <p className="text-gray-400">
              {step === 1 ? 'Create your account and start sharing' : 'Add your profile details to get discovered'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                <div className="space-y-1">
                  <label htmlFor="fullName" className="text-sm font-medium text-gray-300">Full Name</label>
                  <div className="relative group">
                    <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-violet-400 transition-colors" />
                    <input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateFormData('fullName', e.target.value)}
                      className="bg-zinc-800/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all hover:border-violet-500/50 text-white placeholder-gray-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-violet-400 transition-colors" />
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="bg-zinc-800/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all hover:border-violet-500/50 text-white placeholder-gray-500"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-violet-400 transition-colors" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className="bg-zinc-800/50 border border-white/10 rounded-lg py-3 pl-10 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all hover:border-violet-500/50 text-white placeholder-gray-500"
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
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 mt-1">Password must be at least 8 characters</p>
                    <div className="h-1 w-24 bg-zinc-800 rounded overflow-hidden">
                      <div 
                        className={`h-full ${formData.password.length < 4 ? 'bg-red-500' : formData.password.length < 8 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(100, (formData.password.length / 12) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={() => updateFormData('agreeTerms', !formData.agreeTerms)}
                    className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 bg-zinc-800"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                    I agree to the <a href="#" className="text-violet-400 hover:text-violet-300 underline">Terms of Service</a> and <a href="#" className="text-violet-400 hover:text-violet-300 underline">Privacy Policy</a>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={goToNextStep}
                  disabled={!validateFirstStep()}
                  className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${validateFirstStep() ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500' : 'bg-zinc-800 cursor-not-allowed'} text-white font-medium transition-all duration-300`}
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <label htmlFor="username" className="text-sm font-medium text-gray-300">Username</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-violet-400 transition-colors" />
                    <input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => updateFormData('username', e.target.value)}
                      className="bg-zinc-800/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all hover:border-violet-500/50 text-white placeholder-gray-500"
                      placeholder="johndoe"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">This will be your unique @handle</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Profile Picture</label>
                  
                  <div className="flex flex-col items-center justify-center space-y-4">
                    {previewImage ? (
                      <div className="relative group">
                        <img 
                          src={previewImage} 
                          alt="Profile Preview" 
                          className="w-32 h-32 object-cover rounded-full border-2 border-violet-500"
                        />
                        <div 
                          className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={removeImage}
                        >
                          <span className="text-sm font-medium">Remove</span>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="w-32 h-32 rounded-full bg-zinc-800/80 border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:border-violet-500 transition-colors"
                        onClick={() => document.getElementById('profileImage').click()}
                      >
                        <Camera className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-400">Add Photo</span>
                      </div>
                    )}
                    
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    
                    <button
                      type="button"
                      onClick={() => document.getElementById('profileImage').click()}
                      className="text-sm text-violet-400 hover:text-violet-300 underline flex items-center gap-1"
                    >
                      <FileImage className="w-4 h-4" /> Upload image
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 px-4 rounded-lg border border-white/10 hover:bg-white/5 text-white font-medium transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium transition-all duration-300 flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    Complete Sign Up
                  </button>
                </div>
              </>
            )}
          </form>

          {step === 1 && (
            <>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-zinc-950 text-gray-400">Or sign up with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <button className="flex justify-center items-center py-2 px-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors group">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-xs font-bold text-zinc-900">G</span>
                    </div>
                  </button>
                  <button className="flex justify-center items-center py-2 px-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors group">
                    <Twitter className="w-5 h-5 group-hover:text-blue-400 group-hover:scale-110 transition-all" />
                  </button>
                  <button className="flex justify-center items-center py-2 px-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors group">
                    <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              <p className="mt-8 text-center text-sm text-gray-400">
                Already have an account?{' '}
                <a href="#" className="font-medium text-violet-400 hover:text-violet-300 underline">
                  Sign in
                </a>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Right side - Image showcase */}
      <div className="hidden lg:block w-1/2 bg-gradient-to-br from-violet-900/80 via-fuchsia-900/80 to-zinc-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-violet-500 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-fuchsia-500 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-2/3 left-1/2 w-24 h-24 rounded-full bg-rose-500 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-12">
          <div className="max-w-md text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Showcase Your Creative Vision</h2>
            <p className="text-lg text-white/80">Join our growing community of visual creators and share your unique perspective.</p>
          </div>
          
          {/* Image gallery */}
          <div className="w-full max-w-2xl">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative">
              {sampleGallery.map((img, index) => (
                <div 
                  key={index} 
                  className="aspect-w-1 aspect-h-1 relative group overflow-hidden rounded-lg"
                  style={{ 
                    transition: 'all 0.5s ease',
                    transform: `translateY(${index % 2 === 0 ? '8px' : '-8px'})`, 
                    animationDelay: `${index * 0.1}s` 
                  }}
                >
                  <img 
                    src={img} 
                    alt={`Gallery image ${index + 1}`}
                    className="object-cover w-full h-full rounded-lg transform group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <div className="p-3">
                      <h4 className="text-white text-sm font-bold truncate">Artwork Title</h4>
                      <p className="text-white/70 text-xs">By @creator{index + 1}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Social proof */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between w-full max-w-md">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-800 overflow-hidden">
                  <img src={`/api/placeholder/${(i+1)*30}/${(i+1)*30}`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm"><span className="font-bold text-white">12,000+</span> creators</p>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
                <span className="text-xs ml-1 text-white/70">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
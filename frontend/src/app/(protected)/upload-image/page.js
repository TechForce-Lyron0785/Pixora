"use client"
import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Upload,
  ImageIcon,
  X,
  CheckCircle,
  Grid,
  MessageSquare,
  PlusCircle,
  Bell,
  UserIcon,
  Tag,
  Sliders,
  Eye,
  Globe,
  Lock,
  Users,
  HelpCircle,
  Info,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const ImageUpload = () => {
  const api = useApi();
  const { data: session } = useSession();
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedVisibility, setSelectedVisibility] = useState('public');
  const [selectedTags, setSelectedTags] = useState([]);
  const [inputTag, setInputTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const [isStorageFull, setIsStorageFull] = useState(false);

  const [imageDetails, setImageDetails] = useState({
    title: '',
    description: '',
    category: 'portrait',
    license: 'standard'
  });
  const [commentsAllowed, setCommentsAllowed] = useState(true);

  const categories = [
    { id: 'abstract', name: 'Abstract' },
    { id: 'portrait', name: 'Portrait' },
    { id: 'landscape', name: 'Landscape' },
    { id: 'cyberpunk', name: 'Cyberpunk' },
    { id: 'minimal', name: 'Minimal' },
  ];

  const licenses = [
    { id: 'standard', name: 'Standard License', description: 'For personal and commercial use' },
    { id: 'extended', name: 'Extended License', description: 'For extensive commercial projects' },
  ];

  const suggestedTags = ['photography', 'digital art', 'graphic design', 'illustration', 'abstract', 'minimalism', '3d render'];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (fileList) => {
    try {
      setUploadError(null);
      
      const filesArray = Array.from(fileList).map(file => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2), // in MB
        progress: 0,
        uploading: true,
        error: null,
        uploaded: false,
        publicId: null,
        cloudinaryUrl: null
      }));
      
      setFiles(prev => [...prev, ...filesArray]);

      // Start uploading each file to Cloudinary immediately
      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];
        
        try {
          // Create FormData for the file
          const formData = new FormData();
          formData.append('image', file.file);

          // Simulate progress
          const updateProgress = () => {
            setFiles(prev => 
              prev.map((f, idx) => {
                if (idx === prev.length - filesArray.length + i && f.progress < 90) {
                  return { ...f, progress: f.progress + 10 };
                }
                return f;
              })
            );
          };
          
          // Update progress every 300ms
          const progressInterval = setInterval(updateProgress, 300);
          
          try {
            // Use fetch instead of axios for file upload
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:5000'}/api/images/upload-temp`, {
              method: 'POST',
              headers: {
                // Don't set Content-Type with FormData - fetch sets it automatically with boundary
                Authorization: session?.backendToken ? `Bearer ${session.backendToken}` : '',
              },
              credentials: 'include',
              body: formData
            });
            
            clearInterval(progressInterval);
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to upload image');
            }
            
            const data = await response.json();
            
            // Update file with Cloudinary info
            setFiles(prev => prev.map((f, index) => {
              if (index === prev.length - filesArray.length + i) {
                return {
                  ...f,
                  progress: 100,
                  uploading: false,
                  uploaded: true,
                  publicId: data.data.publicId,
                  cloudinaryUrl: data.data.imageUrl,
                  imageSize: data.data.imageSize
                };
              }
              return f;
            }));
          } catch (error) {
            clearInterval(progressInterval);
            throw error;
          }
        } catch (error) {
          console.error('Pre-upload error:', error);
          
          if (error.message.includes('Storage limit reached')) {
            setIsStorageFull(true);
            setUploadError(error.message);
          }
          
          // Update file with error
          setFiles(prev => prev.map((f, index) => {
            if (index === prev.length - filesArray.length + i) {
              return {
                ...f,
                progress: 0,
                uploading: false,
                error: error.message || 'Upload failed'
              };
            }
            return f;
          }));
        }
      }

      if (currentStep === 1) {
        setCurrentStep(2);
      }
    } catch (error) {
      console.error('Handle files error:', error);
      setUploadError(error.message || 'An error occurred while processing files');
    }
  };

  const removeFile = async (index) => {
    const file = files[index];
    
    // Delete from Cloudinary if it was uploaded successfully
    if (file.publicId) {
      try {
        await api.delete(`/api/images/cloudinary/${file.publicId}`);
        
      } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
      }
    }
    
    // Remove from state
    const newFiles = [...files];
    URL.revokeObjectURL(newFiles[index].preview); // Clean up object URL
    newFiles.splice(index, 1);
    setFiles(newFiles);

    if (newFiles.length === 0 && currentStep > 1) {
      setCurrentStep(1);
    }
  };

  const handleTagAdd = (tag) => {
    if (tag && !selectedTags.includes(tag) && selectedTags.length < 10) {
      setSelectedTags([...selectedTags, tag]);
      setInputTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const uploadToServer = async () => {
    try {
      setIsUploading(true);
      setUploadError(null);

      if (files.length === 0) {
        throw new Error("Please select at least one image");
      }

      if (!imageDetails.title || !imageDetails.description) {
        throw new Error("Title and description are required");
      }
      
      // Check if file was successfully pre-uploaded
      if (!files[0].publicId || !files[0].cloudinaryUrl) {
        throw new Error("Image was not properly uploaded. Please try again.");
      }

      // Create a request body with the image details
      const imageData = {
        publicId: files[0].publicId,
        imageUrl: files[0].cloudinaryUrl,
        title: imageDetails.title,
        description: imageDetails.description,
        category: imageDetails.category,
        license: imageDetails.license,
        visibility: selectedVisibility,
        imageSize: files[0].imageSize,
        commentsAllowed: commentsAllowed
      };
      
      // Add tags if available
      if (selectedTags.length > 0) {
        imageData.tags = selectedTags;
      }

      try {
        // Use fetch for saving details too
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:5000'}/api/images/save-details`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: session?.backendToken ? `Bearer ${session.backendToken}` : '',
          },
          credentials: 'include',
          body: JSON.stringify(imageData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save image details');
        }

        setCurrentStep(4); // Move to success step
      } catch (error) {
        throw error;
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to save image details');
    } finally {
      setIsUploading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      // Add validation for step 2
      if (currentStep === 2 && (!imageDetails.title.trim() || !imageDetails.description.trim())) {
        // Show error or validation message
        setUploadError("Please provide both title and description before continuing");
        return;
      }
      
      setCurrentStep(currentStep + 1);

      if (currentStep === 3) {
        uploadToServer();
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setImageDetails({ ...imageDetails, [name]: value });
    
    // Clear error when user types in title or description
    if ((name === 'title' || name === 'description') && uploadError) {
      setUploadError(null);
    }
  };

  return (
    <div className="p-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => window.history.back()}
            className="mr-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Upload New Images</h1>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative max-w-2xl mx-auto">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/10 -translate-y-1/2 z-0"></div>

          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600'
                  : 'bg-white/10'
                  }`}
              >
                {currentStep > step ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="text-sm">{step}</span>
                )}
              </div>
              <span className="text-xs mt-2 text-gray-400">
                {step === 1 ? 'Select Files' :
                  step === 2 ? 'Image Details' :
                    step === 3 ? 'Final Settings' : 'Complete'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Storage Limit Warning */}
      {isStorageFull && (
        <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-600 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-lg text-yellow-200">Storage Limit Reached</h3>
              <p className="text-yellow-100 mt-1">
                You&apos;ve reached your 10MB storage limit. Upgrade to premium to unlock unlimited storage and continue uploading your images.
              </p>
              <Link
                href="/settings"
                className="mt-3 inline-block py-2 px-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg text-sm font-medium"
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          {/* Step 1: File Upload */}
          {currentStep === 1 && (
            <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Select Images to Upload</h2>

              <div
                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center ${dragActive ? 'border-violet-500 bg-violet-900/20' : 'border-white/20 hover:border-violet-500/50'
                  } transition-all duration-300 cursor-pointer`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="p-4 bg-white/5 rounded-full mb-4">
                  <Upload className="w-8 h-8 text-violet-400" />
                </div>

                <h3 className="text-lg font-medium mb-2">Drag & Drop your images here</h3>
                <p className="text-gray-400 text-center mb-6 max-w-md">
                  Upload high-quality images in JPG, PNG, or WebP format.
                  Maximum file size: 15MB per image.
                </p>

                <button className="py-2.5 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Browse Files
                </button>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Upload Guidelines</h3>
                  <button className="text-violet-400 text-sm flex items-center gap-1">
                    <HelpCircle className="w-4 h-4" />
                    Help
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: 'High Quality', description: 'Minimum 1200px on the longest side', icon: <Eye /> },
                    { title: 'Original Content', description: 'Must own rights to the content', icon: <Info /> },
                    { title: 'Be Creative', description: 'Showcase your unique perspective', icon: <Sparkles /> }
                  ].map((guideline, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                          {guideline.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{guideline.title}</h4>
                          <p className="text-xs text-gray-400 mt-1">{guideline.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Image Details */}
          {currentStep === 2 && (
            <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Image Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={imageDetails.title}
                      onChange={handleChange}
                      maxLength={100}
                      placeholder="Give your image a catchy title"
                      className="w-full bg-zinc-800/50 border border-white/10 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      value={imageDetails.description}
                      onChange={handleChange}
                      maxLength={500}
                      placeholder="Describe your image in detail..."
                      className="w-full bg-zinc-800/50 border border-white/10 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500 transition h-24 resize-none"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      name="category"
                      value={imageDetails.category}
                      onChange={handleChange}
                      className="w-full bg-zinc-800/50 border border-white/10 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedTags.map(tag => (
                        <div key={tag} className="bg-white/10 rounded-full px-3 py-1 text-sm flex items-center gap-1">
                          {tag}
                          <button onClick={() => removeTag(tag)} className="ml-1 text-gray-400 hover:text-white">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputTag}
                        onChange={(e) => setInputTag(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleTagAdd(inputTag)}
                        placeholder="Add tags"
                        className="flex-1 bg-zinc-800/50 border border-white/10 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-sm"
                      />
                      <button
                        onClick={() => handleTagAdd(inputTag)}
                        className="bg-white/10 hover:bg-white/20 rounded-lg px-3 flex items-center justify-center"
                      >
                        <PlusCircle className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-2">
                      <p className="text-xs text-gray-400 mb-1">Suggested tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedTags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleTagAdd(tag)}
                            className="bg-white/5 hover:bg-white/10 rounded-full px-3 py-1 text-xs"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Preview
                      {files.length > 1 && ` (${files.length} files)`}
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      {files.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-zinc-800 border border-white/10">
                            <img
                              src={file.preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Show upload status indicator */}
                            {file.uploading && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-t-transparent border-violet-500 rounded-full animate-spin"></div>
                              </div>
                            )}
                            
                            {file.error && (
                              <div className="absolute inset-0 bg-red-900/70 flex items-center justify-center">
                                <AlertCircle className="w-8 h-8 text-red-300" />
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <div className="text-xs text-gray-400 mt-1 truncate">
                            {file.name} ({file.size} MB)
                            {file.error && <span className="text-red-400 ml-1">- {file.error}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Add error display for step 2 */}
              {uploadError && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-600 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-100">{uploadError}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Final Settings */}
          {currentStep === 3 && (
            <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Publishing Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Visibility</label>
                    <div className="space-y-3">
                      {[
                        { id: 'public', icon: <Globe />, title: 'Public', description: 'Visible to everyone' },
                        { id: 'followers', icon: <Users />, title: 'Followers Only', description: 'Only visible to your followers' },
                        { id: 'private', icon: <Lock />, title: 'Private', description: 'Only visible to you' }
                      ].map(option => (
                        <div
                          key={option.id}
                          onClick={() => setSelectedVisibility(option.id)}
                          className={`p-4 rounded-lg cursor-pointer flex items-start gap-3 border ${selectedVisibility === option.id
                            ? 'border-violet-500 bg-violet-900/20'
                            : 'border-white/10 hover:bg-white/5'
                            } transition-colors`}
                        >
                          <div className={`p-2 rounded-lg ${selectedVisibility === option.id ? 'bg-violet-500' : 'bg-white/10'}`}>
                            {option.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{option.title}</h4>
                            <p className="text-sm text-gray-400">{option.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">License</label>
                    <select
                      name="license"
                      value={imageDetails.license}
                      onChange={handleChange}
                      className="w-full bg-zinc-800/50 border border-white/10 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                    >
                      {licenses.map(license => (
                        <option key={license.id} value={license.id}>{license.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-2">
                      {licenses.find(l => l.id === imageDetails.license)?.description}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Advanced Settings</label>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Tag className="w-5 h-5 text-gray-400" />
                          <div>
                            <h4 className="text-sm font-medium">Enable Alt Text</h4>
                            <p className="text-xs text-gray-400">Improve accessibility</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-zinc-700 peer-focus:ring-2 peer-focus:ring-violet-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Sliders className="w-5 h-5 text-gray-400" />
                          <div>
                            <h4 className="text-sm font-medium">Show EXIF Data</h4>
                            <p className="text-xs text-gray-400">Display camera information</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-zinc-700 peer-focus:ring-2 peer-focus:ring-violet-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-5 h-5 text-gray-400" />
                          <div>
                            <h4 className="text-sm font-medium">Allow Comments</h4>
                            <p className="text-xs text-gray-400">Enable community feedback</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={commentsAllowed}
                            onChange={(e) => setCommentsAllowed(e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-zinc-700 peer-focus:ring-2 peer-focus:ring-violet-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
        </div>


        <div className="col-span-12 lg:col-span-4">
          {/* Right sidebar */}
          {currentStep < 4 && (
            <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
              <h3 className="font-medium mb-4">Upload Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Files Selected:</span>
                  <span>{files.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Total Size:</span>
                  <span>
                    {files.length > 0
                      ? `${files.reduce((total, file) => total + parseFloat(file.size), 0).toFixed(2)} MB`
                      : '0 MB'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Category:</span>
                  <span>
                    {imageDetails.category
                      ? categories.find(c => c.id === imageDetails.category)?.name
                      : 'Not selected'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">License:</span>
                  <span>
                    {imageDetails.license
                      ? licenses.find(l => l.id === imageDetails.license)?.name
                      : 'Not selected'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Visibility:</span>
                  <span className="capitalize">{selectedVisibility}</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 pb-2">
                <h4 className="text-sm font-medium mb-3">Upload Progress</h4>

                {files.map((file, index) => (
                  <div key={index} className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400 truncate max-w-[180px]">{file.name}</span>
                      <span>{file.progress}%</span>
                    </div>

                    <div className="w-full bg-zinc-800 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${file.error
                          ? 'bg-red-500'
                          : file.uploaded
                            ? 'bg-green-500'
                            : 'bg-violet-500'
                          }`}
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>

                    {file.error && (
                      <p className="text-xs text-red-400 mt-1">{file.error}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 mt-4">
                <h4 className="text-sm font-medium mb-3">Need Help?</h4>
                <div className="text-sm text-gray-400">
                  <p className="mb-2">
                    If you&apos;re having trouble uploading your images, check out our
                    <a href="#" className="text-violet-400 hover:text-violet-300 ml-1">upload guide</a>.
                  </p>
                  <p>
                    Still need assistance?
                    <a href="#" className="text-violet-400 hover:text-violet-300 ml-1">Contact support</a>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {currentStep === 4 && (
        <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-10 text-center mx-auto max-w-4xl">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold mb-3">Upload Complete!</h2>
          <p className="text-gray-300 mb-8 max-w-md mx-auto">
            Your images have been successfully uploaded and are now being processed.They&apos;ll be available on your profile shortly. Thank you for contributing to our community!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={"/feed"} className="py-2.5 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2">
              <Grid className="w-4 h-4" />
              Go to My Gallery
            </Link>
            <button
              onClick={() => {
                setFiles([]);
                setCurrentStep(1);
                setSelectedTags([]);
                setImageDetails({
                  title: '',
                  description: '',
                  category: 'portrait',
                  license: 'standard'
                });
              }}
              className="py-2.5 px-6 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload More Images
            </button>
          </div>
        </div>
      )}

      {/* Add error display for step 3 and general errors */}
      {uploadError && currentStep !== 2 && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-100">{uploadError}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      {currentStep < 4 && (
        <div className="mt-8 flex justify-between">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1 || isUploading}
            className={`py-2.5 px-6 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${currentStep === 1 || isUploading
                ? 'bg-zinc-800/50 text-gray-500 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
          >
            Back
          </button>

          <button
            onClick={handleNextStep}
            disabled={files.length === 0 || isUploading || isStorageFull || (files.length > 0 && files.some(f => f.error)) || (currentStep === 2 && (!imageDetails.title || !imageDetails.description))}
            className={`py-2.5 px-6 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              files.length === 0 || isUploading || isStorageFull || (files.length > 0 && files.some(f => f.error)) || (currentStep === 2 && (!imageDetails.title || !imageDetails.description))
                ? 'bg-zinc-800/50 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white'
            }`}
          >
            {isUploading ? 'Uploading...' : currentStep === 3 ? 'Upload Now' : 'Continue'}
            {isStorageFull && ' (Upgrade Required)'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
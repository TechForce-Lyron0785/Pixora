"use client"
import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  ImageIcon, 
  Sparkles, 
  X, 
  Plus, 
  Tag, 
  Globe, 
  Lock, 
  Users, 
  Filter, 
  Sliders, 
  Eye,
  PenTool,
  Wand2,
  Palette,
  SlidersHorizontal,
  Check,
  ChevronDown
} from 'lucide-react';

const ImageUploadPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [tags, setTags] = useState(['photography', 'digital art']);
  const [tagInput, setTagInput] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [visibility, setVisibility] = useState('public');
  const [currentStep, setCurrentStep] = useState(1);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);
  const dragRef = useRef(null);
  
  const filters = [
    { id: 'original', name: 'Original' },
    { id: 'neon', name: 'Neon Glow' },
    { id: 'vintage', name: 'Vintage' },
    { id: 'noir', name: 'Film Noir' },
    { id: 'vivid', name: 'Vivid' },
    { id: 'pastel', name: 'Pastel' }
  ];
  
  const editTools = [
    { id: 'filters', name: 'Filters', icon: <Filter className="w-5 h-5" /> },
    { id: 'adjust', name: 'Adjust', icon: <SlidersHorizontal className="w-5 h-5" /> },
    { id: 'draw', name: 'Draw', icon: <PenTool className="w-5 h-5" /> },
    { id: 'enhance', name: 'Enhance', icon: <Wand2 className="w-5 h-5" /> },
    { id: 'colors', name: 'Colors', icon: <Palette className="w-5 h-5" /> }
  ];
  
  // Simulating upload progress
  useEffect(() => {
    if (uploadedImage && uploadProgress < 100) {
      const timer = setTimeout(() => {
        setUploadProgress(prev => Math.min(prev + 5, 100));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [uploadedImage, uploadProgress]);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };
  
  const handleFiles = (file) => {
    setUploadedImage(file);
    setUploadProgress(0);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setCurrentStep(2);
    };
    reader.readAsDataURL(file);
  };
  
  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const renderUploadZone = () => (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div 
        ref={dragRef}
        className={`w-full max-w-3xl aspect-video rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden group ${
          dragActive ? 'border-violet-500 bg-violet-500/10' : 'border-gray-700 hover:border-violet-500/50 hover:bg-white/5'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input 
          ref={fileInputRef} 
          type="file" 
          className="hidden" 
          onChange={handleFileChange}
          accept="image/*"
        />
        
        {dragActive && 
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/20 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                <Upload className="w-8 h-8 text-violet-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Drop to Upload</h3>
              <p className="text-gray-300">Release your image to start creating</p>
            </div>
          </div>
        }
        
        <div className="relative z-0">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all duration-300">
            <ImageIcon className="w-10 h-10 text-gray-400 group-hover:text-violet-400 transition-colors duration-300" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">Upload your image</h3>
          <p className="text-gray-400 mb-6 text-center max-w-md">Drop your image here, or click to browse</p>
          
          <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto mb-6">
            {['PNG', 'JPG', 'GIF', 'WEBP', 'SVG'].map(format => (
              <span key={format} className="px-2 py-1 bg-white/5 rounded-md text-xs text-gray-400">
                {format}
              </span>
            ))}
          </div>
          
          <div className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg text-sm font-medium">
            Choose File
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="mt-8 text-center">
        <h3 className="text-lg font-medium text-white mb-3">Or try one of these creative options</h3>
        <div className="flex gap-4 justify-center">
          <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="p-3 rounded-lg bg-gradient-to-r from-violet-600/30 to-violet-600/10">
              <Wand2 className="w-5 h-5 text-violet-400" />
            </div>
            <span className="text-sm">AI Generate</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-600/30 to-emerald-600/10">
              <Globe className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm">From URL</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="p-3 rounded-lg bg-gradient-to-r from-amber-600/30 to-amber-600/10">
              <PenTool className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-sm">Create New</span>
          </button>
        </div>
      </div>
    </div>
  );
  
  const renderEditScreen = () => (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Edit Your Image</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentStep(1)} 
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentStep(3)} 
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-sm font-medium"
            >
              Continue
            </button>
          </div>
        </div>
        
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10">
          {imagePreview && (
            <img 
              src={imagePreview} 
              alt="Preview" 
              className={`w-full h-full object-contain ${activeFilter ? `filter-${activeFilter}` : ''}`}
            />
          )}
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id === 'original' ? null : filter.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                    (filter.id === 'original' && !activeFilter) || activeFilter === filter.id
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Glow effect that follows mouse position */}
          <div 
            className="absolute pointer-events-none w-64 h-64 rounded-full bg-violet-600/20 blur-3xl opacity-50 transition-all duration-100"
            style={{ 
              left: `${mousePosition.x - 128}px`, 
              top: `${mousePosition.y - 128}px`,
              opacity: currentEdit ? '0.5' : '0'
            }}
          ></div>
        </div>
        
        <div className="mt-4 flex justify-center">
          <div className="bg-zinc-900/90 border border-white/10 rounded-full flex p-1 gap-1">
            {editTools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setCurrentEdit(currentEdit === tool.id ? null : tool.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                  currentEdit === tool.id 
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' 
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                {tool.icon}
                <span>{tool.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Image Details</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title</label>
            <input 
              type="text" 
              placeholder="Give your image a title" 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-violet-500"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea 
              placeholder="Add a description..." 
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-lg text-sm">
                  #{tag}
                  <button onClick={() => handleRemoveTag(tag)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <input 
                type="text" 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
                placeholder="Add tags..." 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 pl-6 text-white focus:outline-none focus:border-violet-500"
              />
              <Tag className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Visibility</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'public', name: 'Public', icon: <Globe className="w-4 h-4" /> },
                { id: 'followers', name: 'Followers', icon: <Users className="w-4 h-4" /> },
                { id: 'private', name: 'Private', icon: <Lock className="w-4 h-4" /> }
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => setVisibility(option.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border ${
                    visibility === option.id
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  } transition-colors`}
                >
                  {option.icon}
                  <span className="text-xs">{option.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Category</label>
            <div className="relative">
              <select className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-violet-500 appearance-none">
                <option>Digital Art</option>
                <option>Photography</option>
                <option>3D Rendering</option>
                <option>Illustration</option>
                <option>Abstract</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderPublishScreen = () => (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Publish Your Image</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentStep(2)} 
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
          >
            Back to Edit
          </button>
          <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-sm font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Publish Now
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-xl overflow-hidden border border-white/10 relative">
            {imagePreview && (
              <img 
                src={imagePreview} 
                alt="Preview" 
                className={`w-full object-contain ${activeFilter ? `filter-${activeFilter}` : ''}`}
              />
            )}
            
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="p-2 rounded-lg bg-black/50 backdrop-blur-md hover:bg-black/70 transition-colors">
                <Eye className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-black/50 backdrop-blur-md hover:bg-black/70 transition-colors">
                <PenTool className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-3">Share Your Creation</h3>
              <div className="flex flex-wrap gap-3">
                {['Twitter', 'Facebook', 'Instagram', 'Pinterest'].map(platform => (
                  <button key={platform} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                    <span>{platform}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-3">Add to Collections</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: 'Favorites', color: 'bg-rose-500', count: 24 },
                  { name: 'Portfolio', color: 'bg-blue-500', count: 18 },
                  { name: 'Abstract', color: 'bg-amber-500', count: 12 },
                  { name: '+ New Collection', color: 'bg-violet-500', isAdd: true }
                ].map((collection, idx) => (
                  <button 
                    key={idx} 
                    className="rounded-lg p-3 bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-start"
                  >
                    <span className={`w-3 h-3 rounded-full ${collection.color} mb-2`}></span>
                    <span className="font-medium text-sm">{collection.name}</span>
                    {!collection.isAdd && <span className="text-xs text-gray-400">{collection.count} items</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Image Summary</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Title</p>
                <p className="font-medium">Untitled Image</p>
              </div>
              
              <div className="pt-2 border-t border-white/10">
                <p className="text-sm text-gray-400">Category</p>
                <p className="font-medium">Digital Art</p>
              </div>
              
              <div className="pt-2 border-t border-white/10">
                <p className="text-sm text-gray-400">Tags</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-white/10 rounded-md text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="pt-2 border-t border-white/10">
                <p className="text-sm text-gray-400">Visibility</p>
                <div className="flex items-center gap-2 mt-1">
                  {visibility === 'public' && <Globe className="w-4 h-4 text-green-400" />}
                  {visibility === 'followers' && <Users className="w-4 h-4 text-blue-400" />}
                  {visibility === 'private' && <Lock className="w-4 h-4 text-amber-400" />}
                  <span className="capitalize">{visibility}</span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-white/10">
                <p className="text-sm text-gray-400">License</p>
                <div className="flex items-center justify-between mt-1">
                  <span>All rights reserved</span>
                  <button className="text-xs text-violet-400">Change</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Preferences</h3>
            
            <div className="space-y-3">
              {[
                { id: 'comments', label: 'Allow comments', checked: true },
                { id: 'stats', label: 'Show stats publicly', checked: true },
                { id: 'download', label: 'Allow downloads', checked: false }
              ].map(option => (
                <div key={option.id} className="flex items-center justify-between">
                  <span className="text-sm">{option.label}</span>
                  <button className={`w-10 h-5 rounded-full relative ${option.checked ? 'bg-violet-600' : 'bg-white/20'}`}>
                    <span className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-all ${option.checked ? 'left-5' : 'left-0.5'}`}></span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Apply CSS styles for filters
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .filter-neon { filter: brightness(1.2) contrast(1.2) saturate(1.5) hue-rotate(5deg); }
      .filter-vintage { filter: sepia(0.4) contrast(0.9) saturate(0.8); }
      .filter-noir { filter: grayscale(1) contrast(1.4); }
      .filter-vivid { filter: brightness(1.1) contrast(1.3) saturate(1.5); }
      .filter-pastel { filter: brightness(1.1) contrast(0.8) saturate(0.8); }
    `;
    document.head.appendChild(style);
    
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-white/10 bg-zinc-900/60 backdrop-blur-lg flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg p-1.5 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold">Create New</h1>
          </div>
          
          <div className="hidden md:flex items-center">
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-xs">
              {currentStep}
            </div>
            <div className={`w-8 h-0.5 ${currentStep > 1 ? 'bg-violet-500' : 'bg-white/20'}`}></div>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${currentStep > 1 ? 'bg-violet-500' : 'bg-white/20'}`}>
              {currentStep > 1 && <Check className="w-3 h-3" />}
              {currentStep <= 1 && '2'}
            </div>
            <div className={`w-8 h-0.5 ${currentStep > 2 ? 'bg-violet-500' : 'bg-white/20'}`}></div>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${currentStep > 2 ? 'bg-violet-500' : 'bg-white/20'}`}>
              {currentStep > 2 && <Check className="w-3 h-3" />}
              {currentStep <= 2 && '3'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 rounded-lg bg-white/5 text-sm hover:bg-white/10 transition-colors">
            Save Draft
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-6 flex items-start justify-center overflow-y-auto">
        {currentStep === 1 && renderUploadZone()}
        {currentStep === 2 && renderEditScreen()}
        {currentStep === 3 && renderPublishScreen()}
      </div>
      
      {/* Fixed cursor effect */}
      {dragActive && (
        <div 
          className="fixed pointer-events-none w-20 h-20 rounded-full border-2 border-violet-500 z-50 opacity-70 -ml-10 -mt-10 flex items-center justify-center" 
          style={{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px` }}
        >
          <Upload className="w-6 h-6 text-violet-500" />
        </div>
      )}
    </div>
  );
};

export default ImageUploadPage;
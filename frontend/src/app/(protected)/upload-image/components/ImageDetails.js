"use client"
import { PlusCircle, X, AlertCircle } from 'lucide-react';

const ImageDetails = ({ 
  imageDetails, 
  handleChange, 
  files,
  selectedTags, 
  setSelectedTags, 
  inputTag, 
  setInputTag, 
  uploadError,
  removeFile,
  suggestedTags,
  categories 
}) => {
  const handleTagAdd = (tag) => {
    if (tag && !selectedTags.includes(tag) && selectedTags.length < 10) {
      setSelectedTags([...selectedTags, tag]);
      setInputTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  return (
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

      {/* Error display */}
      {uploadError && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-100">{uploadError}</p>
        </div>
      )}
    </div>
  );
};

export default ImageDetails; 
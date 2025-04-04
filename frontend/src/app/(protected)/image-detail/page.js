"use client"
import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  MessageSquare,
  BookmarkIcon,
  Share2,
  Download,
  MoreHorizontal,
  Eye,
  Calendar,
  Tag,
  MapPin,
  Info,
  Search,
  Bell,
  UserIcon,
  PlusCircle,
  Compass,
  Grid,
  TrendingUp,
  Clock,
  Settings,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  Star,
  Flag
} from 'lucide-react';

const ImageDetail = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Image data
  const imageDetails = {
    id: 1,
    title: "Cosmic Journey",
    description: "A surreal exploration of space and consciousness. This piece represents the human journey through the cosmos of mind and universe, where reality and dreams intertwine.",
    creator: "Sasha Nova",
    creatorAvatar: "/api/placeholder/40/40",
    uploadDate: "April 2, 2025",
    views: "14.3K",
    downloads: "2.1K",
    likes: isLiked ? "4,101" : "4,100",
    location: "Tokyo, Japan",
    camera: "Canon EOS R5",
    tags: ["Cosmic", "Space", "Surreal", "Abstract", "Universe"],
    image: "/api/placeholder/1000/700",
    categories: ["Abstract", "Digital Art", "Sci-Fi"],
  };

  // Related images
  const relatedImages = [
    { id: 1, image: "/api/placeholder/200/250", title: "Stellar Convergence", creator: "Sasha Nova" },
    { id: 2, image: "/api/placeholder/200/250", title: "Quantum Fields", creator: "Marcus Wave" },
    { id: 3, image: "/api/placeholder/200/250", title: "Nebula Dreams", creator: "Elena Bright" },
    { id: 4, image: "/api/placeholder/200/250", title: "Dark Matter", creator: "Robert Cosmos" },
  ];

  // Comments
  const comments = [
    {
      id: 1,
      name: "Alex Morgan",
      avatar: "/api/placeholder/40/40",
      comment: "This is absolutely breathtaking! The way you've captured the essence of cosmic energy is phenomenal.",
      time: "2h ago",
      likes: 42
    },
    {
      id: 2,
      name: "Maya Johnson",
      avatar: "/api/placeholder/40/40",
      comment: "I'm mesmerized by the color palette. Would love to know more about your creative process!",
      time: "5h ago",
      likes: 28,
      replies: [
        {
          id: 21,
          name: "Sasha Nova",
          avatar: "/api/placeholder/40/40",
          comment: "Thank you Maya! I started with deep blues and purples as a base and built the luminosity gradually with digital brushwork.",
          time: "3h ago",
          likes: 14
        }
      ]
    },
    {
      id: 3,
      name: "Julian Chen",
      avatar: "/api/placeholder/40/40",
      comment: "The depth in this piece is incredible. It feels like I could step right into another dimension.",
      time: "1d ago",
      likes: 35
    }
  ];

  return (
    <div className="p-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for images, creators, or collections..."
            className="bg-zinc-800/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-white placeholder-gray-400"
          />
        </div>

        <div className="flex items-center space-x-4 ml-4">
          <button className="bg-white/5 hover:bg-white/10 p-2 rounded-lg relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full transform translate-x-1 -translate-y-1"></span>
          </button>

          <button className="hidden md:flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 py-2 px-4 transition-all duration-300">
            <PlusCircle className="w-4 h-4" />
            <span>Create</span>
          </button>

          <button className="md:hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 p-2 rounded-lg">
            <PlusCircle className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 p-0.5">
            <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center">
              <UserIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Back navigation */}
      <div className="mb-6">
        <button className="flex items-center text-gray-400 hover:text-white transition-colors gap-1">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to explore</span>
        </button>
      </div>

      {/* Image detail layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main image and info */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Image container */}
          <div className="rounded-xl overflow-hidden bg-zinc-900 border border-white/10 relative group">
            <img
              src={imageDetails.image}
              alt={imageDetails.title}
              className="w-full object-cover"
            />

            {/* Overlay controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex justify-between items-center">
                <button className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition">
                  <Download className="w-5 h-5" />
                </button>

                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Fullscreen button */}
            <button className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition opacity-0 group-hover:opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
                <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
                <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
                <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
              </svg>
            </button>
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isLiked ? 'bg-rose-500/20 text-rose-400' : 'bg-white/5 hover:bg-white/10'} transition-colors`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-400' : ''}`} />
                <span>{imageDetails.likes}</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span>{comments.length}</span>
              </button>

              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isBookmarked ? 'bg-violet-500/20 text-violet-400' : 'bg-white/5 hover:bg-white/10'} transition-colors`}
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <BookmarkIcon className={`w-5 h-5 ${isBookmarked ? 'fill-violet-400' : ''}`} />
                <span>Save</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Image metadata */}
          <div className="rounded-xl bg-zinc-900/60 border border-white/10 p-6">
            <h1 className="text-2xl font-bold mb-2">{imageDetails.title}</h1>
            <p className="text-gray-300 mb-6">{imageDetails.description}</p>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-violet-500">
                  <img src={imageDetails.creatorAvatar} alt={imageDetails.creator} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium">{imageDetails.creator}</p>
                  <p className="text-sm text-gray-400">Pro Creator</p>
                </div>
              </div>

              <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-sm font-medium transition-all duration-300">
                Follow
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Upload Date</p>
                  <p className="text-sm">{imageDetails.uploadDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                <Eye className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Views</p>
                  <p className="text-sm">{imageDetails.views}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                <Download className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Downloads</p>
                  <p className="text-sm">{imageDetails.downloads}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Location</p>
                  <p className="text-sm">{imageDetails.location}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-medium mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {imageDetails.categories.map((category, idx) => (
                  <span key={idx} className="px-3 py-1 bg-violet-900/30 text-violet-300 rounded-full text-sm">
                    {category}
                  </span>
                ))}
              </div>

              <h3 className="text-lg font-medium mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {imageDetails.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-sm transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Comments section */}
          <div className="rounded-xl bg-zinc-900/60 border border-white/10 p-6">
            <h3 className="text-xl font-bold mb-6">Comments ({comments.length})</h3>

            {/* Comment input */}
            <div className="flex gap-3 mb-8">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img src="/api/placeholder/40/40" alt="Your avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="relative mb-2">
                  <textarea
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-white placeholder-gray-400"
                  />
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-sm font-medium transition-all duration-300">
                  Post Comment
                </button>
              </div>
            </div>

            {/* Comment list */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <img src={comment.avatar} alt={comment.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{comment.name}</p>
                          <p className="text-xs text-gray-400">{comment.time}</p>
                        </div>
                        <button className="p-1 text-gray-400 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="mt-2 text-gray-200">{comment.comment}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-white">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{comment.likes}</span>
                        </button>
                        <button className="text-sm text-gray-400 hover:text-white">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Nested replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-12 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            <img src={reply.avatar} alt={reply.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{reply.name}</p>
                                <p className="text-xs text-gray-400">{reply.time}</p>
                              </div>
                              <button className="p-1 text-gray-400 hover:text-white">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="mt-2 text-gray-200">{reply.comment}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-white">
                                <ThumbsUp className="w-4 h-4" />
                                <span>{reply.likes}</span>
                              </button>
                              <button className="text-sm text-gray-400 hover:text-white">
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Technical details */}
          <div className="rounded-xl bg-zinc-900/60 border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Technical Details</h3>
              <Info className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Camera</span>
                <span>{imageDetails.camera}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Dimensions</span>
                <span>3840 x 2160 px</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">File Size</span>
                <span>4.2 MB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Software</span>
                <span>Adobe Photoshop 2025</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Format</span>
                <span>JPEG</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Color Space</span>
                <span>sRGB</span>
              </div>
            </div>
          </div>

          {/* License info */}
          <div className="rounded-xl bg-zinc-900/60 border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/5 rounded-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10.5 15.5C10.5 14.5 11.1 14 12 14C12.9 14 13.5 14.5 13.5 15.5C13.5 16.5 12.9 17 12 17C11.1 17 10.5 16.5 10.5 15.5Z" fill="currentColor" />
                  <path d="M12 7V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">License Information</h3>
            </div>

            <div className="bg-white/5 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Standard License</span>
                <span className="text-emerald-400">Active</span>
              </div>
              <p className="text-sm text-gray-400 mb-3">Personal and commercial use with attribution required.</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Attribution</span>
                <span>Required</span>
              </div>
            </div>

            <button className="w-full py-2 text-center bg-white/5 hover:bg-white/10 rounded-lg text-violet-400 transition-colors">
              View full license details
            </button>
          </div>

          {/* Rating & reviews */}
          <div className="rounded-xl bg-zinc-900/60 border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Ratings & Reviews</h3>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">4.9</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs w-8">5★</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: '85%' }}></div>
                </div>
                <span className="text-xs text-gray-400">85%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-8">4★</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: '12%' }}></div>
                </div>
                <span className="text-xs text-gray-400">12%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-8">3★</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: '3%' }}></div>
                </div>
                <span className="text-xs text-gray-400">3%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-8">2★</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: '0%' }}></div>
                </div>
                <span className="text-xs text-gray-400">0%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-8">1★</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: '0%' }}></div>
                </div>
                <span className="text-xs text-gray-400">0%</span>
              </div>
            </div>

            <button className="w-full py-2 text-center bg-white/5 hover:bg-white/10 rounded-lg text-violet-400 transition-colors">
              Read all 124 reviews
            </button>
          </div>

          {/* Related images */}
          <div className="rounded-xl bg-zinc-900/60 border border-white/10 p-6">
            <h3 className="text-lg font-bold mb-4">More from this creator</h3>

            <div className="grid grid-cols-2 gap-3">
              {relatedImages.map((image) => (
                <div key={image.id} className="group cursor-pointer">
                  <div className="rounded-lg overflow-hidden mb-2 relative">
                    <img
                      src={image.image}
                      alt={image.title}
                      className="w-full aspect-[4/5] object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <div>
                        <h4 className="text-sm font-medium text-white">{image.title}</h4>
                        <p className="text-xs text-gray-300">{image.creator}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-2 text-center bg-white/5 hover:bg-white/10 rounded-lg text-violet-400 transition-colors mt-4">
              View all by this creator
            </button>
          </div>

          {/* Report section */}
          <div className="rounded-xl bg-zinc-900/60 border border-white/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <Flag className="w-4 h-4" />
              <span className="text-sm">Report content</span>
            </div>
            <button className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
              Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetail;
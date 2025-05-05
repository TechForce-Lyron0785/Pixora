"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, BookOpen, Image, Users, Calendar, Shield, PlusCircle, Share2, Lock, Globe } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  CollectionHeader,
  CollectionImages,
  RemoveImageDialog,
  DeleteCollectionDialog,
  CollaboratorsDialog
} from './components';
import { formatDistanceToNow } from 'date-fns';

const CollectionDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const api = useApi();

  // State management
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState(null);
  const [images, setImages] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCollaboratorsDialog, setShowCollaboratorsDialog] = useState(false);
  const [showRemoveImageDialog, setShowRemoveImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [notification, setNotification] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const collectionId = params.id;
  
  // Fetch collection details and images
  useEffect(() => {
    const fetchCollectionDetails = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/collections/${collectionId}`);
        
        if (data.success) {
          setCollection(data.data);
          setImages(data.data.images || []);
          setCollaborators(data.data.collaborators || []);
          
          // Check if user is owner or editor
          if (user && data.data.user) {
            setIsOwner(user._id === data.data.user._id);
            
            // Check if user is a collaborator with editor role
            const userCollaborator = data.data.collaborators?.find(
              collab => collab.user._id === user._id
            );
            setIsEditor(userCollaborator?.role === 'editor');
          }
        } else {
          router.push('/collections');
        }
      } catch (error) {
        console.error('Failed to fetch collection details:', error);
        router.push('/collections');
      } finally {
        setLoading(false);
      }
    };
    
    if (collectionId) {
      fetchCollectionDetails();
    }
  }, [collectionId, user]);

  // Handle removing an image from the collection
  const handleRemoveImage = async () => {
    if (!selectedImage) return;
    
    try {
      const { data } = await api.delete(`/api/collections/${collectionId}/images/${selectedImage._id}`);
      
      if (data.success) {
        // Update images state by removing the selected image
        setImages(images.filter(img => img._id !== selectedImage._id));
        
        // Show success notification
        setNotification({
          type: 'success',
          message: 'Image successfully removed from collection'
        });
        
        // Auto-dismiss notification after 3 seconds
        setTimeout(() => setNotification(null), 3000);
        
        // Close dialog
        setShowRemoveImageDialog(false);
        setSelectedImage(null);
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Failed to remove image'
        });
      }
    } catch (error) {
      console.error('Failed to remove image:', error);
      setNotification({
        type: 'error',
        message: 'An error occurred while removing the image'
      });
    }
  };

  // Handle deleting the entire collection
  const handleDeleteCollection = async () => {
    try {
      const { data } = await api.delete(`/api/collections/${collectionId}`);
      
      if (data.success) {
        setNotification({
          type: 'success',
          message: 'Collection successfully deleted'
        });
        
        // Navigate back after a brief delay
        setTimeout(() => router.push('/collections'), 1500);
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Failed to delete collection'
        });
      }
    } catch (error) {
      console.error('Failed to delete collection:', error);
      setNotification({
        type: 'error',
        message: 'An error occurred while deleting the collection'
      });
    }
  };

  // Handle sharing collection
  const handleShareCollection = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    
    setNotification({
      type: 'success',
      message: 'Collection URL copied to clipboard'
    });
    
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter images by category
  const getFilteredImages = () => {
    if (activeCategory === 'all') return images;
    return images.filter(img => 
      img.tags && img.tags.some(tag => tag.toLowerCase().includes(activeCategory.toLowerCase()))
    );
  };

  // Get unique categories from images
  const getImageCategories = () => {
    const categories = new Set(['all']);
    images.forEach(img => {
      if (img.tags) {
        img.tags.forEach(tag => categories.add(tag));
      }
    });
    return Array.from(categories);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-b from-zinc-900 to-zinc-950">
        <Loader2 className="w-12 h-12 animate-spin text-violet-500" />
        <p className="mt-4 text-zinc-400 font-medium">Loading collection...</p>
      </div>
    );
  }

  // Not found state
  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-12 bg-gradient-to-b from-zinc-900 to-zinc-950 min-h-screen">
        <Alert variant="destructive" className="mb-6 bg-red-900/20 border border-red-800 text-white">
          <AlertDescription>Collection not found or you don&apos;t have permission to view it.</AlertDescription>
        </Alert>
        <Button 
          onClick={() => router.push('/collections')}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          Back to Collections
        </Button>
      </div>
    );
  }

  const filteredImages = getFilteredImages();
  const categories = getImageCategories();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 pb-20">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg max-w-md animate-in slide-in-from-top duration-300 border ${
          notification.type === 'success' 
            ? 'bg-emerald-900/80 border-emerald-600 text-white' 
            : 'bg-red-900/80 border-red-600 text-white'
        }`}>
          <p>{notification.message}</p>
        </div>
      )}
      
      {/* Hero Section */}
      <div className="relative">
        {/* Gradient overlay for the header background */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 to-zinc-950 h-60 w-full"></div>
        
        {/* Collection header with background */}
        <div className="relative z-10 pt-12 pb-6 px-6 md:px-12 max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Collection thumbnail */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 shadow-xl bg-zinc-800 w-24 h-24 md:w-32 md:h-32">
              {collection.coverImage ? (
                <img 
                  src={collection.coverImage} 
                  alt={collection.name} 
                  className="w-full h-full object-cover"
                />
              ) : images[0]?.imageUrl ? (
                <img 
                  src={images[0].imageUrl} 
                  alt={collection.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-800/40 to-fuchsia-800/40">
                  <BookOpen className="w-12 h-12 text-white/60" />
                </div>
              )}
            </div>
            
            {/* Collection info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{collection.name}</h1>
                {collection.isPrivate ? (
                  <Lock className="w-5 h-5 text-amber-400" />
                ) : (
                  <Globe className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              
              <p className="text-zinc-400 text-sm md:text-base mb-4">
                {collection.description || "No description provided for this collection."}
              </p>
              
              {/* Collection stats */}
              <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-1">
                  <Image className="w-4 h-4" />
                  <span>{images.length} Images</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{collaborators.length} Collaborators</span>
                </div>
                
                {collection.createdAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Created {formatDistanceToNow(new Date(collection.createdAt))} ago</span>
                  </div>
                )}
                
                {isOwner && (
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-violet-400" />
                    <span className="text-violet-400">Owner</span>
                  </div>
                )}
                
                {isEditor && !isOwner && (
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400">Editor</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              {(isOwner || isEditor) && (
                <Button 
                  onClick={() => router.push(`/upload-image?collection=${collectionId}`)}
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Images
                </Button>
              )}
              
              <Button 
                onClick={handleShareCollection}
                variant="outline"
                className="border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              
              {isOwner && (
                <>
                  <Button 
                    onClick={() => setShowCollaboratorsDialog(true)}
                    variant="outline"
                    className="border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Manage Collaborators
                  </Button>
                  
                  <Button 
                    onClick={() => setShowDeleteDialog(true)}
                    variant="destructive"
                    className="bg-red-900/30 hover:bg-red-900/60 border border-red-800/50"
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="px-6 md:px-12 max-w-screen-2xl mx-auto mt-8">
        {/* Category filters */}
        {categories.length > 1 && (
          <div className="mb-8 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 pb-2">
              {categories.map(category => (
                <Button 
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  className={activeCategory === category 
                    ? "bg-violet-600 hover:bg-violet-700 text-white" 
                    : "border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10"
                  }
                >
                  {category === 'all' ? 'All' : `#${category}`}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* View mode toggle */}
        <div className="flex justify-between items-center mb-6 pt-8">
          <h2 className="text-xl font-bold text-white">
            {activeCategory === 'all' 
              ? `All Images (${filteredImages.length})` 
              : `#${activeCategory} (${filteredImages.length})`
            }
          </h2>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => setViewMode('grid')}
              variant={viewMode === 'grid' ? "default" : "outline"}
              size="sm"
              className={viewMode === 'grid'
                ? "bg-violet-600 hover:bg-violet-700 text-white"
                : "border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10"
              }
            >
              Grid
            </Button>
            
            <Button
              onClick={() => setViewMode('list')}
              variant={viewMode === 'list' ? "default" : "outline"}
              size="sm"
              className={viewMode === 'list'
                ? "bg-violet-600 hover:bg-violet-700 text-white"
                : "border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10"
              }
            >
              List
            </Button>
          </div>
        </div>
        
        {/* Collection Images */}
        <CollectionImages 
          images={filteredImages}
          loading={loading}
          isOwner={isOwner}
          isEditor={isEditor}
          collectionId={collectionId}
          viewMode={viewMode}
          onImageOptions={(image) => {
            setSelectedImage(image);
            setShowRemoveImageDialog(true);
          }}
          onAddImagesClick={() => router.push(`/upload-image?collection=${collectionId}`)}
        />
        
        {/* Empty state */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <Image className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
            <h3 className="text-xl font-medium mb-2 text-white">No images in this collection</h3>
            {activeCategory !== 'all' ? (
              <p className="text-zinc-400 mb-6">No images with tag #{activeCategory} found</p>
            ) : (isOwner || isEditor) ? (
              <>
                <p className="text-zinc-400 mb-6">Upload some images to get started</p>
                <Button
                  onClick={() => router.push(`/upload-image?collection=${collectionId}`)}
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
                >
                  Upload Images
                </Button>
              </>
            ) : (
              <p className="text-zinc-400">This collection is empty</p>
            )}
          </div>
        )}
      </div>
      
      {/* Dialogs */}
      <RemoveImageDialog 
        isOpen={showRemoveImageDialog}
        onOpenChange={setShowRemoveImageDialog}
        selectedImage={selectedImage}
        onConfirm={handleRemoveImage}
        onCancel={() => {
          setShowRemoveImageDialog(false);
          setSelectedImage(null);
        }}
      />
      
      <DeleteCollectionDialog 
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        collection={collection}
        images={images}
        onConfirm={handleDeleteCollection}
        onCancel={() => setShowDeleteDialog(false)}
      />
      
      <CollaboratorsDialog 
        isOpen={showCollaboratorsDialog}
        onOpenChange={setShowCollaboratorsDialog}
        collection={collection}
        collaborators={collaborators}
        isOwner={isOwner}
        onRemoveCollaborator={(userId) => console.log('Remove collaborator:', userId)}
        onAddCollaborator={() => console.log('Add collaborator')}
      />
    </div>
  );
};

export default CollectionDetailPage; 
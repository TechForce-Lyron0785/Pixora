"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MoreHorizontal,
  Pencil,
  Trash2,
  Share2,
  Eye,
  EyeOff,
  Users,
  Grid,
  Loader2,
  Plus,
  UserPlus,
  Filter,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollections } from '@/hooks/useCollections';
import { useApi } from '@/hooks/useApi';
// import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import MasonryGrid from '@/components/layouts/MasonryGrid';

const CollectionDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  // const { toast } = useToast();
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
            setIsOwner(user._id === data.data.user);
            
            // Check if user is a collaborator with editor role
            const userCollaborator = data.data.collaborators?.find(
              collab => collab.user._id === user._id
            );
            setIsEditor(userCollaborator?.role === 'editor');
          }
        } else {
          // toast({
          //   variant: "destructive",
          //   title: "Error",
          //   description: "Failed to fetch collection details",
          // });
          router.push('/collections');
        }
      } catch (error) {
        // toast({
        //   variant: "destructive",
        //   title: "Error",
        //   description: error.message || "Failed to fetch collection details",
        // });
        router.push('/collections');
      } finally {
        setLoading(false);
      }
    };
    
    if (collectionId) {
      fetchCollectionDetails();
    }
  }, [collectionId, user]);

  // Handle the different visibility options
  const getVisibilityDisplay = () => {
    if (!collection) return null;
    
    switch (collection.visibility) {
      case 'public':
        return { icon: <Eye className="h-4 w-4 text-green-400" />, label: 'Public' };
      case 'private':
        return { icon: <EyeOff className="h-4 w-4 text-gray-400" />, label: 'Private' };
      case 'shared':
        return { icon: <Users className="h-4 w-4 text-blue-400" />, label: 'Shared' };
      default:
        return { icon: <Eye className="h-4 w-4" />, label: 'Public' };
    }
  };

  // Handle removing an image from the collection
  const handleRemoveImage = async () => {
    if (!selectedImage) return;
    
    try {
      const { data } = await api.delete(`/api/collections/${collectionId}/images/${selectedImage._id}`);
      
      if (data.success) {
        // Update images state by removing the selected image
        setImages(images.filter(img => img._id !== selectedImage._id));
        
        // Close dialog
        setShowRemoveImageDialog(false);
        setSelectedImage(null);
        
        // toast({
        //   title: "Success",
        //   description: "Image removed from collection",
        // });
      } else {
        // toast({
        //   variant: "destructive",
        //   title: "Error",
        //   description: "Failed to remove image from collection",
        // });
      }
    } catch (error) {
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: error.message || "Failed to remove image from collection",
      // });
    }
  };

  // Handle deleting the entire collection
  const handleDeleteCollection = async () => {
    try {
      const { data } = await api.delete(`/api/collections/${collectionId}`);
      
      if (data.success) {
        // toast({
        //   title: "Success",
        //   description: "Collection deleted successfully",
        // });
        router.push('/collections');
      } else {
        // toast({
        //   variant: "destructive",
        //   title: "Error",
        //   description: "Failed to delete collection",
        // });
      }
    } catch (error) {
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: error.message || "Failed to delete collection",
      // });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading collection...</p>
      </div>
    );
  }

  // Not found state
  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>Collection not found or you don&apos;t have permission to view it.</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push('/collections')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Collections
        </Button>
      </div>
    );
  }

  // Format dates
  const updatedAtFormatted = collection.updatedAt
    ? formatDistanceToNow(new Date(collection.updatedAt), { addSuffix: true })
    : '';
  const createdAtFormatted = collection.createdAt
    ? formatDistanceToNow(new Date(collection.createdAt), { addSuffix: true })
    : '';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header navigation */}
      <Button
        variant="outline"
        size="sm"
        className="mb-6"
        onClick={() => router.push('/collections')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Collections
      </Button>

      {/* Collection Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {collection.name}
              {collection.isStarred && (
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              )}
            </h1>
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-xs">
              {getVisibilityDisplay().icon}
              <span>{getVisibilityDisplay().label}</span>
            </span>
          </div>
          {collection.description && (
            <p className="text-muted-foreground mt-2 max-w-xl">{collection.description}</p>
          )}
          
          <div className="flex flex-wrap mt-3 gap-2">
            {collection.tags && collection.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary/10 text-primary-foreground rounded-sm text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <span>Updated {updatedAtFormatted}</span>
            <span>Created {createdAtFormatted}</span>
            <span>{collection.imageCount || images.length} images</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {(isOwner || isEditor) && (
            <Button variant="outline" onClick={() => router.push(`/upload-image?collection=${collectionId}`)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Images
            </Button>
          )}
          
          {collaborators.length > 0 || isOwner ? (
            <Button 
              variant="outline" 
              onClick={() => setShowCollaboratorsDialog(true)}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Collaborators</span>
              <span className="inline sm:hidden">{collaborators.length}</span>
            </Button>
          ) : null}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwner && (
                <>
                  <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Collection
                  </DropdownMenuItem>
                  {collection.visibility !== 'public' && (
                    <DropdownMenuItem onClick={() => {/* Handle sharing */}}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Collection
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Collection
                  </DropdownMenuItem>
                </>
              )}
              {!isOwner && (
                <DropdownMenuItem onClick={() => {/* Handle leaving */}}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Leave Collection
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      {/* Collection Images */}
      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-muted/30 rounded-lg border border-border">
          <Grid className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No images yet</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            This collection doesn&apos;t have any images yet. Start adding images to your collection.
          </p>
          {(isOwner || isEditor) && (
            <Button onClick={() => router.push(`/upload-image?collection=${collectionId}`)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Images
            </Button>
          )}
        </div>
      ) : (
        <div>
          <MasonryGrid 
            images={images} 
            loading={loading}
            onImageOptions={(image) => {
              setSelectedImage(image);
              setShowRemoveImageDialog(true);
            }}
          />
        </div>
      )}
      
      {/* Remove Image Dialog */}
      <Dialog open={showRemoveImageDialog} onOpenChange={setShowRemoveImageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Image from Collection</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this image from the collection? The image will still be available in your gallery.
            </DialogDescription>
          </DialogHeader>
          
          {selectedImage && (
            <div className="py-4">
              <div className="aspect-video relative overflow-hidden rounded-lg mb-3">
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="font-medium">{selectedImage.title}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowRemoveImageDialog(false);
                setSelectedImage(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRemoveImage}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Collection Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Collection</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this collection? This action cannot be undone.
              The images will remain in your gallery.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="font-medium">{collection.name}</p>
            <p className="text-muted-foreground text-sm mt-1">
              {images.length} images will be removed from this collection.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCollection}>
              Delete Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Collaborators Dialog */}
      <Dialog open={showCollaboratorsDialog} onOpenChange={setShowCollaboratorsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Collaborators</DialogTitle>
            <DialogDescription>
              People who can access this collection
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {collection.user && (
              <div className="flex items-center justify-between p-2 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    {collection.user.profilePicture ? (
                      <Image
                        src={collection.user.profilePicture}
                        alt={collection.user.username || 'Owner'}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {(collection.user.username || 'Owner').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{collection.user.username || 'Owner'}</p>
                    <p className="text-xs text-muted-foreground">Owner</p>
                  </div>
                </div>
              </div>
            )}
            
            {collaborators.length > 0 ? (
              collaborators.map((collaborator) => (
                <div 
                  key={collaborator.user._id} 
                  className="flex items-center justify-between p-2 rounded-md mt-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      {collaborator.user.profilePicture ? (
                        <Image
                          src={collaborator.user.profilePicture}
                          alt={collaborator.user.username}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {collaborator.user.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{collaborator.user.username}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {collaborator.role}
                      </p>
                    </div>
                  </div>
                  
                  {isOwner && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive"
                      //onClick={() => handleRemoveCollaborator(collaborator.user._id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No collaborators yet</p>
              </div>
            )}
            
            {isOwner && (
              <div className="mt-4">
                <Button className="w-full" onClick={() => {/* Handle adding collaborators */}}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Collaborators
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollectionDetailPage; 
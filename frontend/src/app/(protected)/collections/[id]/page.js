"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
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
        
        // Close dialog
        setShowRemoveImageDialog(false);
        setSelectedImage(null);
      } else {
        console.error('Failed to remove image:', data.message);
      }
    } catch (error) {
      console.error('Failed to remove image:', error);
    }
  };

  // Handle deleting the entire collection
  const handleDeleteCollection = async () => {
    try {
      const { data } = await api.delete(`/api/collections/${collectionId}`);
      
      if (data.success) {
        router.push('/collections');
      } else {
        console.error('Failed to delete collection:', data.message);
      }
    } catch (error) {
      console.error('Failed to delete collection:', error);
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
        <Button onClick={() => router.push('/collections')}>
          Back to Collections
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Collection Header */}
      <CollectionHeader 
        collection={collection}
        isOwner={isOwner}
        isEditor={isEditor}
        collaborators={collaborators}
        onBackClick={() => router.push('/collections')}
        onAddImagesClick={() => router.push(`/upload-image?collection=${collectionId}`)}
        onShowCollaboratorsClick={() => setShowCollaboratorsDialog(true)}
        onShowEditDialog={() => setShowEditDialog(true)}
        onShowDeleteDialog={() => setShowDeleteDialog(true)}
      />
      
      {/* Collection Images */}
      <CollectionImages 
        images={images}
        loading={loading}
        isOwner={isOwner}
        isEditor={isEditor}
        collectionId={collectionId}
        onImageOptions={(image) => {
          setSelectedImage(image);
          setShowRemoveImageDialog(true);
        }}
        onAddImagesClick={() => router.push(`/upload-image?collection=${collectionId}`)}
      />
      
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
      
      {/* Edit Collection Dialog - Would need to be implemented */}
    </div>
  );
};

export default CollectionDetailPage; 
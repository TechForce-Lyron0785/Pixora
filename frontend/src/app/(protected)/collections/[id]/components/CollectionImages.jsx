import React from 'react';
import { Grid, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MasonryGrid from '@/components/layouts/MasonryGrid';

const CollectionImages = ({
  images,
  loading,
  isOwner,
  isEditor,
  collectionId,
  onImageOptions,
  onAddImagesClick
}) => {
  // Empty state
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-muted/30 rounded-lg border border-border">
        <Grid className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No images yet</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          This collection doesn&apos;t have any images yet. Start adding images to your collection.
        </p>
        {(isOwner || isEditor) && (
          <Button onClick={onAddImagesClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Images
          </Button>
        )}
      </div>
    );
  }
  
  // Images grid
  return (
    <div>
      <MasonryGrid 
        images={images} 
        loading={loading}
        onImageOptions={onImageOptions}
      />
    </div>
  );
};

export default CollectionImages; 
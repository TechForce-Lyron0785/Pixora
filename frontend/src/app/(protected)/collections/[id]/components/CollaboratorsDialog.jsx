import React from 'react';
import Image from 'next/image';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const CollaboratorsDialog = ({
  isOpen,
  onOpenChange,
  collection,
  collaborators,
  isOwner,
  onRemoveCollaborator,
  onAddCollaborator,
}) => {
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Collaborators</DialogTitle>
          <DialogDescription>
            People who can access this collection
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {collection?.user && (
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
          
          {collaborators?.length > 0 ? (
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
                    size="sm" 
                    className="text-destructive"
                    onClick={() => onRemoveCollaborator?.(collaborator.user._id)}
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
              <Button className="w-full" onClick={onAddCollaborator}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Collaborators
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollaboratorsDialog; 
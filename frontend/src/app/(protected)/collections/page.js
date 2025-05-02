"use client"
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Search,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Globe,
  Users,
  ChevronDown,
  MoreHorizontal,
  FolderPlus,
  Image as ImageIcon,
  ArrowRight,
  X,
  Star,
  UserPlus,
  Download,
  Eye,
  EyeOff,
  Share2,
  Layout,
  List,
  SlidersHorizontal,
  Filter,
  Clock,
  Calendar,
  Heart,
  Link,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollections } from '@/hooks/useCollections';
// import { useToast } from '@/components/ui/use-toast';
import CollectionCard from '@/components/cards/CollectionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const CollectionsPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollectionForShare, setSelectedCollectionForShare] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [collectionToEdit, setCollectionToEdit] = useState(null);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  
  // New collection form state
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    visibility: 'private',
    tags: '',
  });
  
  // Hooks
  const { 
    collections, 
    loading, 
    loadingMore,
    hasMore,
    fetchCollections, 
    loadMoreCollections,
    createCollection, 
    updateCollection, 
    deleteCollection 
  } = useCollections();
  // const { toast } = useToast();
  
  // Fetch collections on mount and when sort/filter changes
  useEffect(() => {
    fetchCollections({
      sortBy: sortOption,
      sortOrder: sortOrder,
      search: searchQuery
    });
  }, [sortOption, sortOrder, filter]);
  
  // Handle search query changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCollections({
        search: searchQuery,
        sortBy: sortOption,
        sortOrder: sortOrder
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Filter collections based on visibility
  const getFilteredCollections = () => {
    if (filter === 'all') return collections;
    return collections.filter(collection => collection.visibility === filter);
  };
  
  // Handle creating a new collection
  const handleCreateCollection = async () => {
    if (!newCollection.name.trim()) {
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: "Collection name is required",
      // });
      return;
    }
    
    try {
      // Convert tags string to array
      const tagsArray = newCollection.tags 
        ? newCollection.tags.split(',').map(tag => tag.trim().toLowerCase())
        : [];
      
      const createdCollection = await createCollection({
        name: newCollection.name,
        description: newCollection.description,
        visibility: newCollection.visibility,
        tags: tagsArray,
      });
      
      if (createdCollection) {
        // Reset form and close modal
        setNewCollection({
          name: '',
          description: '',
          visibility: 'private',
          tags: '',
        });
        setShowCreateModal(false);
        
        // Refresh collections list
        fetchCollections();
        
        // toast({
        //   title: "Success",
        //   description: "Collection created successfully",
        // });
      }
    } catch (error) {
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: error.message || "Failed to create collection",
      // });
    }
  };
  
  // Handle updating a collection
  const handleUpdateCollection = async () => {
    if (!collectionToEdit || !collectionToEdit.name.trim()) {
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: "Collection name is required",
      // });
      return;
    }
    
    try {
      // Convert tags string to array if it's a string
      const tagsArray = typeof collectionToEdit.tags === 'string'
        ? collectionToEdit.tags.split(',').map(tag => tag.trim().toLowerCase())
        : collectionToEdit.tags;
      
      const updatedCollection = await updateCollection(collectionToEdit._id, {
        name: collectionToEdit.name,
        description: collectionToEdit.description,
        visibility: collectionToEdit.visibility,
        tags: tagsArray,
        isStarred: collectionToEdit.isStarred,
      });
      
      if (updatedCollection) {
        setShowEditModal(false);
        
        // Refresh collections list
        fetchCollections();
        
        // toast({
        //   title: "Success",
        //   description: "Collection updated successfully",
        // });
      }
    } catch (error) {
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: error.message || "Failed to update collection",
      // });
    }
  };
  
  // Handle deleting a collection
  const handleConfirmDelete = async () => {
    if (!collectionToDelete) return;
    
    try {
      const success = await deleteCollection(collectionToDelete._id);
      
      if (success) {
        setShowDeleteConfirm(false);
        setCollectionToDelete(null);
        
        // toast({
        //   title: "Success",
        //   description: "Collection deleted successfully",
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
  
  // Handle collection edit button
  const handleEditCollection = (collection) => {
    // Convert tags array to string for the form
    const collectionWithStringTags = {
      ...collection,
      tags: Array.isArray(collection.tags) ? collection.tags.join(', ') : ''
    };
    
    setCollectionToEdit(collectionWithStringTags);
    setShowEditModal(true);
  };
  
  // Handle collection delete button
  const handleDeleteCollection = (collection) => {
    setCollectionToDelete(collection);
    setShowDeleteConfirm(true);
  };
  
  // Handle starring/unstarring a collection
  const handleToggleStar = async (collection) => {
    try {
      await updateCollection(collection._id, {
        isStarred: !collection.isStarred
      });
      
      // Refresh collections to show updated state
      fetchCollections();
      
      // toast({
      //   title: "Success",
      //   description: collection.isStarred 
      //     ? "Collection removed from favorites" 
      //     : "Collection added to favorites",
      // });
    } catch (error) {
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: error.message || "Failed to update collection",
      // });
    }
  };
  
  // Handle load more collections
  const handleLoadMore = () => {
    loadMoreCollections({
      sortBy: sortOption,
      sortOrder: sortOrder,
      search: searchQuery
    });
  };
  
  // Loading state
  if (loading && collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading collections...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Collections</h1>
          <p className="text-muted-foreground mt-1">
            Organize and manage your image collections
          </p>
        </div>
        
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Collection
        </Button>
      </div>
      
      {/* Search and filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
        <div className="md:col-span-6 lg:col-span-7">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search collections..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="md:col-span-3 lg:col-span-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>
                    {sortOption === 'updatedAt' && sortOrder === 'desc' && 'Recently Updated'}
                    {sortOption === 'updatedAt' && sortOrder === 'asc' && 'Oldest Updated'}
                    {sortOption === 'name' && sortOrder === 'asc' && 'Name (A-Z)'}
                    {sortOption === 'name' && sortOrder === 'desc' && 'Name (Z-A)'}
                    {sortOption === 'imageCount' && sortOrder === 'desc' && 'Most Images'}
                    {sortOption === 'imageCount' && sortOrder === 'asc' && 'Fewest Images'}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => { setSortOption('updatedAt'); setSortOrder('desc'); }}>
                Recently Updated
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortOption('updatedAt'); setSortOrder('asc'); }}>
                Oldest Updated
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortOption('name'); setSortOrder('asc'); }}>
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortOption('name'); setSortOrder('desc'); }}>
                Name (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortOption('imageCount'); setSortOrder('desc'); }}>
                Most Images
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortOption('imageCount'); setSortOrder('asc'); }}>
                Fewest Images
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="md:col-span-3 lg:col-span-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="capitalize">{filter === 'all' ? 'All' : filter}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setFilter('all')}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('public')}>
                <Eye className="h-4 w-4 mr-2" />
                Public
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('private')}>
                <EyeOff className="h-4 w-4 mr-2" />
                Private
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('shared')}>
                <Users className="h-4 w-4 mr-2" />
                Shared
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Collections grid */}
      {getFilteredCollections().length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-muted/30 rounded-lg border border-border">
          <FolderPlus className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No collections found</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            {searchQuery 
              ? `No collections matching "${searchQuery}"`
              : "Start organizing your images by creating a new collection"}
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            Create a Collection
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {getFilteredCollections().map((collection) => (
                <CollectionCard
                  key={collection._id}
                  collection={collection}
                  onEdit={handleEditCollection}
                  onDelete={handleDeleteCollection}
                  onToggleStar={handleToggleStar}
                />
              ))}
            </AnimatePresence>
          </div>
          
          {/* Load more button */}
          {hasMore && (
            <div className="flex justify-center mt-10">
              <Button 
                variant="outline" 
                onClick={handleLoadMore} 
                disabled={loadingMore}
                className="flex items-center gap-2"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Load More Collections
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
      
      {/* Create Collection Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogDescription>
              Create a new collection to organize your images
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Collection Name</Label>
              <Input
                id="name"
                placeholder="Enter collection name"
                value={newCollection.name}
                onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe your collection..."
                rows={3}
                value={newCollection.description}
                onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                value={newCollection.visibility}
                onValueChange={(value) => setNewCollection({ ...newCollection, visibility: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <EyeOff className="h-4 w-4" />
                      <span>Private (Only you)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>Public (Everyone)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="shared">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Shared (Collaborators)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="landscape, nature, abstract..."
                value={newCollection.tags}
                onChange={(e) => setNewCollection({ ...newCollection, tags: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCollection}>
              Create Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Collection Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          
          {collectionToEdit && (
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="edit-name">Collection Name</Label>
                <Input
                  id="edit-name"
                  placeholder="Enter collection name"
                  value={collectionToEdit.name}
                  onChange={(e) => setCollectionToEdit({ ...collectionToEdit, name: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description">Description (optional)</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Describe your collection..."
                  rows={3}
                  value={collectionToEdit.description || ''}
                  onChange={(e) => setCollectionToEdit({ ...collectionToEdit, description: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-visibility">Visibility</Label>
                <Select
                  value={collectionToEdit.visibility}
                  onValueChange={(value) => setCollectionToEdit({ ...collectionToEdit, visibility: value })}
                >
                  <SelectTrigger id="edit-visibility">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-4 w-4" />
                        <span>Private (Only you)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>Public (Everyone)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="shared">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Shared (Collaborators)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input
                  id="edit-tags"
                  placeholder="landscape, nature, abstract..."
                  value={collectionToEdit.tags}
                  onChange={(e) => setCollectionToEdit({ ...collectionToEdit, tags: e.target.value })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="star"
                  checked={collectionToEdit.isStarred}
                  onCheckedChange={(checked) => 
                    setCollectionToEdit({ ...collectionToEdit, isStarred: !!checked })
                  }
                />
                <label
                  htmlFor="star"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Star this collection
                </label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCollection}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this collection? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {collectionToDelete && (
            <div className="py-4">
              <p className="font-medium">{collectionToDelete.name}</p>
              <p className="text-muted-foreground text-sm mt-1">
                {collectionToDelete.imageCount} images will be removed from this collection.
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollectionsPage;
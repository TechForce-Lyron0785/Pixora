import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MoreHorizontal, 
  Eye, 
  EyeOff, 
  Users, 
  Pencil, 
  Trash2, 
  Star, 
  Grid,
  MessageSquare,
  Heart,
  Calendar
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const DEFAULT_COVER = '/images/placeholder-collection.jpg';

const CollectionCard = ({ 
  collection, 
  onDelete, 
  onEdit, 
  onToggleStar,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Handle visibility icon display
  const getVisibilityIcon = () => {
    switch (collection.visibility) {
      case 'public':
        return <Eye className="h-4 w-4 text-green-400" />;
      case 'private':
        return <EyeOff className="h-4 w-4 text-gray-400" />;
      case 'shared':
        return <Users className="h-4 w-4 text-blue-400" />;
      default:
        return <Eye className="h-4 w-4 text-green-400" />;
    }
  };
  
  // Format the last updated time
  const formattedTime = collection.updatedAt 
    ? formatDistanceToNow(new Date(collection.updatedAt), { addSuffix: true })
    : '';
  
  // Handle card actions
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(collection);
  };
  
  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) onEdit(collection);
  };
  
  const handleToggleStar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleStar) onToggleStar(collection);
  };
  
  return (
    <Link href={`/collections/${collection._id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`group relative overflow-hidden rounded-xl bg-background border border-border hover:border-primary/70 transition-all ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Collection Cover Image */}
        <div className="aspect-[4/3] w-full relative overflow-hidden">
          <Image
            src={collection.coverImage || DEFAULT_COVER}
            alt={collection.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
          
          {/* Status badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-black/70 backdrop-blur-sm">
              {getVisibilityIcon()}
              <span className="capitalize">{collection.visibility}</span>
            </span>
            
            {collection.collaborators?.length > 0 && (
              <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-black/70 backdrop-blur-sm">
                <Users className="h-3 w-3" />
                {collection.collaborators.length}
              </span>
            )}
          </div>
          
          {/* Star icon */}
          <button
            onClick={handleToggleStar}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <Star 
              className={`h-4 w-4 ${collection.isStarred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
            />
          </button>
          
          {/* Image count badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-black/70 backdrop-blur-sm">
            <Grid className="h-3 w-3" />
            <span>{collection.imageCount || 0} images</span>
          </div>
          
          {/* Actions menu */}
          <div className="absolute bottom-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit collection
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete collection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Collection info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg truncate">{collection.name}</h3>
          {collection.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {collection.description}
            </p>
          )}
          
          {/* Collection metadata */}
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formattedTime}
              </span>
            </div>
            
            {collection.tags && collection.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {collection.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-1.5 py-0.5 bg-primary/10 text-primary-foreground rounded-sm text-[10px]"
                  >
                    {tag}
                  </span>
                ))}
                {collection.tags.length > 3 && (
                  <span className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded-sm text-[10px]">
                    +{collection.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CollectionCard; 
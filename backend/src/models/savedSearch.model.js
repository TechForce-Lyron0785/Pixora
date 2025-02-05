// models/savedSearch.model.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

// Saved Search schema definition
const savedSearchSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model who saved the search
      required: true,
    },
    searchQuery: {
      type: String,
      required: true, // The actual search query or keywords
      trim: true,
      maxlength: 500, // Limiting the length of the search query
    },
    filters: {
      tags: {
        type: [String], // Array of tags the user searched for
        default: [],
      },
      dateRange: {
        from: Date, // From date for image search
        to: Date, // To date for image search
      },
      imageType: {
        type: String,
        enum: ['photo', 'illustration', 'vector'], // Image types the user may want to filter by
        default: 'photo',
      },
      sortBy: {
        type: String,
        enum: ['date', 'popularity'], // Sorting option for search results
        default: 'popularity',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now, // Timestamp for when the search was saved
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Method to create a saved search
savedSearchSchema.statics.createSavedSearch = async function (userId, searchQuery, filters) {
  const savedSearch = new this({
    user: userId,
    searchQuery,
    filters,
  });

  return savedSearch.save();
};

// Method to fetch saved searches by user
savedSearchSchema.statics.getSavedSearchesByUser = async function (userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Method to delete a saved search
savedSearchSchema.statics.deleteSavedSearch = async function (savedSearchId) {
  const savedSearch = await this.findByIdAndDelete(savedSearchId);

  if (!savedSearch) {
    throw new Error('Saved search not found');
  }

  return savedSearch;
};

// Create the Saved Search model
const SavedSearch = mongoose.model('SavedSearch', savedSearchSchema);

export {SavedSearch};

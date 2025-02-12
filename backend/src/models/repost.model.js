import mongoose from 'mongoose';
const { Schema } = mongoose;

const repostSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who reposted
      required: true
    },
    image: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Image', // Reference to the image being reposted
      required: true
    },
    caption: {
      type: String,
      maxlength: 500 // Optional caption for the repost
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields
  }
);

// Compound index to prevent duplicate reposts
repostSchema.index({ user: 1, image: 1 }, { unique: true });

// Middleware to increment repostCount on Image model when repost is created
repostSchema.pre('save', async function(next) {
  if (this.isNew) {
    await mongoose.model('Image').findByIdAndUpdate(
      this.image,
      { $inc: { repostCount: 1 } }
    );
  }
  next();
});

// Middleware to decrement repostCount on Image model when repost is deleted
repostSchema.pre('remove', async function(next) {
  await mongoose.model('Image').findByIdAndUpdate(
    this.image,
    { $inc: { repostCount: -1 } }
  );
  next();
});

export const Repost = mongoose.model('Repost', repostSchema);

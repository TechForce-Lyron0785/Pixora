// models/report.model.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

// Report schema definition
const reportSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User who made the report
      required: true,
    },
    reportedContent: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // The content being reported could be either an image or comment
      // We will use a generic field to reference either Image or Comment
      refPath: 'reportedContentModel', // This dynamic reference field will decide the model (Image or Comment)
    },
    reportedContentModel: {
      type: String,
      enum: ['Image', 'Comment'], // Denotes whether the reported content is an Image or Comment
      required: true,
    },
    reason: {
      type: String,
      required: true, // Reason for the report (e.g., offensive content, spam, etc.)
      maxlength: 500, // Limit the length of the reason for practical use
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'], // Status of the report
      default: 'pending', // Default status is pending
    },
    createdAt: {
      type: Date,
      default: Date.now, // Timestamp for when the report was created
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Timestamp for when the report status was updated
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Method to create a new report
reportSchema.statics.createReport = async function (userId, reportedContentId, reportedContentModel, reason) {
  const report = new this({
    user: userId,
    reportedContent: reportedContentId,
    reportedContentModel,
    reason,
  });

  return report.save();
};

// Method to update the report status
reportSchema.statics.updateReportStatus = async function (reportId, newStatus) {
  const report = await this.findByIdAndUpdate(reportId, { status: newStatus, updatedAt: Date.now() }, { new: true });
  
  if (!report) {
    throw new Error('Report not found');
  }
  
  return report;
};

// Method to fetch reports with specific filters
reportSchema.statics.getReportsByStatus = async function (status) {
  return this.find({ status }).populate('user').populate('reportedContent');
};

// Create the Report model
const Report = mongoose.model('Report', reportSchema);

export {Report};

import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFeedback extends Document {
  project: Types.ObjectId | any;
  name: string;
  email?: string;
  message: string;
  rating?: number;
  approved: boolean;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    approved: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);

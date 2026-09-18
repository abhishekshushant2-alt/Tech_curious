import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStep {
  stepNumber: number;
  title: string;
  description: string;
  image?: string;
}

export interface IComponent {
  name: string;
  quantity: string;
  link?: string;
}

export interface ISourceCode {
  filename: string;
  language: string;
  code: string;
}

export interface IProject extends Document {
  title: string;
  slug: string;
  category: Types.ObjectId | any;
  thumbnailImage: string;
  detailImages: string[];
  shortDescription: string;
  fullDescription: string;
  steps: IStep[];
  components: IComponent[];
  sourceCode: ISourceCode[];
  youtubeLink?: string;
  instagramLink?: string;
  likeCount: number;
  likedBy: string[];
  viewCount: number;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    thumbnailImage: { type: String, required: true },
    detailImages: [{ type: String }],
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    steps: [
      {
        stepNumber: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String },
      },
    ],
    components: [
      {
        name: { type: String, required: true },
        quantity: { type: String, required: true },
        link: { type: String },
      },
    ],
    sourceCode: [
      {
        filename: { type: String, required: true },
        language: { type: String, default: 'cpp' },
        code: { type: String, required: true },
      },
    ],
    youtubeLink: { type: String, default: '' },
    instagramLink: { type: String, default: '' },
    likeCount: { type: Number, default: 0 },
    likedBy: [{ type: String }],
    viewCount: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
  },
  { timestamps: true }
);

ProjectSchema.index({ title: 'text', shortDescription: 'text' });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);

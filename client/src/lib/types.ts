export interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt?: string;
}

export interface Step {
  stepNumber: number;
  title: string;
  description: string;
  image?: string;
}

export interface ComponentItem {
  name: string;
  quantity: string;
  link?: string;
}

export interface SourceCodeItem {
  filename: string;
  language: string;
  code: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  category: Category | string;
  thumbnailImage: string;
  detailImages?: string[];
  shortDescription: string;
  fullDescription: string;
  steps: Step[];
  components: ComponentItem[];
  sourceCode: SourceCodeItem[];
  youtubeLink?: string;
  instagramLink?: string;
  likeCount: number;
  likedBy?: string[];
  viewCount: number;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt?: string;
}

export interface Feedback {
  _id: string;
  project: string | { _id: string; title: string; slug: string };
  name: string;
  email?: string;
  message: string;
  rating?: number;
  approved: boolean;
  createdAt: string;
}

export interface AdminUser {
  email: string;
  role: 'admin';
}

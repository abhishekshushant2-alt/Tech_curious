import mongoose, { Schema, Document } from 'mongoose';

export interface IOtpSession extends Document {
  email: string;
  otpHash: string;
  expiresAt: Date;
  verified: boolean;
}

const OtpSessionSchema = new Schema<IOtpSession>({
  email: { type: String, required: true, lowercase: true, trim: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true, expires: 0 }, // MongoDB TTL index (expires automatically at expiresAt)
  verified: { type: Boolean, default: false },
});

export const OtpSession = mongoose.model<IOtpSession>('OtpSession', OtpSessionSchema);

import crypto from 'crypto';

export const generateOtp = (): string => {
  // Generate cryptographically secure 6-digit number
  const buffer = crypto.randomBytes(3);
  const num = (buffer.readUIntBE(0, 3) % 900000) + 100000;
  return num.toString();
};

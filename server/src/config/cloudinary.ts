import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  console.log('☁️  Cloudinary configured successfully.');
} else {
  console.log('ℹ️  Cloudinary credentials not provided. Direct URLs or fallback image processing will be used.');
}

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder = 'tech-curious'
): Promise<string> => {
  if (!cloudName || !apiKey || !apiSecret) {
    // If Cloudinary is not configured, generate a high quality data URI or mock URL
    const base64 = buffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        if (result?.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Cloudinary did not return a secure URL.'));
        }
      }
    );

    (uploadStream as any).end(buffer);
  });
};

export default cloudinary;

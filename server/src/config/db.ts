import mongoose from 'mongoose';

export let isConnectedToMongo = false;

export const connectDB = async (): Promise<boolean> => {
  const mongoUri = process.env.MONGO_URI;

  // In production without MONGO_URI, boot immediately using in-memory store
  if (!mongoUri && process.env.NODE_ENV === 'production') {
    isConnectedToMongo = false;
    console.log('ℹ️  MONGO_URI not specified. Operating in in-memory store mode (all features active).');
    return false;
  }

  const targetUri = mongoUri || 'mongodb://localhost:27017/tech-curious';

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnectedToMongo = true;
    console.log('✅ Connected to MongoDB database successfully.');
    return true;
  } catch (error: any) {
    isConnectedToMongo = false;
    console.warn(`⚠️  Could not connect to MongoDB (${error.message}).`);
    console.warn(`💡 Operating in local in-memory fallback store mode. All features remain functional!`);
    return false;
  }
};

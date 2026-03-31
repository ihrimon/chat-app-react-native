import mongoose from 'mongoose';
import envConfig from './env.config';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(envConfig.database_uri as string);
    console.log('MongoDB connected successfully');
  } catch (error: any) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;

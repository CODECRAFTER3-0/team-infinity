import mongoose from 'mongoose';
import { syncAppIndexes } from '../utils/syncIndexes.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // options not strictly needed in Mongoose 6+, but good practice to keep it clean
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    if (process.env.NODE_ENV === 'development') {
      await syncAppIndexes();
      console.log('MongoDB indexes synced for development');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

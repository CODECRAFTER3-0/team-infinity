import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import { syncAppIndexes } from '../utils/syncIndexes.js';

dotenv.config();

const run = async () => {
  await connectDB();
  await syncAppIndexes();
  console.log('Database indexes synced successfully.');
  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error('Index sync failed:', error);
  await mongoose.connection.close();
  process.exit(1);
});

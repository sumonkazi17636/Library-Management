import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import bookRoutes from './Routes/book.routes';
import borrowRoutes from './Routes/borrow.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Library Management API is working!' });
});

// Connect to MongoDB only once
let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI!);
  isConnected = true;
  console.log('Connected to MongoDB');
};

// Export the app (Vercel will handle requests)
export default app;

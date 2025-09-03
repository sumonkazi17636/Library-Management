import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import bookRoutes from './Routes/book.routes';
import borrowRoutes from './Routes/borrow.routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Library Management API is working!',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint (doesn't require DB connection)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB only if MONGODB_URI exists
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  // Don't crash the server, just log the error
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      // Don't crash the server for connection errors
    });
}

// Export for Vercel
export default app;
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
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Library Management API is working!' });
});

// Health check endpoint (doesn't require DB connection)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB only if MONGODB_URI exists
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  // You might want to start the server even without DB connection
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} (without MongoDB)`);
  });
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB'); 
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      // Start server even if DB connection fails
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} (MongoDB connection failed)`);
      });
    });
}

// Export for other modules (like tests)
export default app;




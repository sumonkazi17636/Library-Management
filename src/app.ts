import express from 'express';
import cors from 'cors';
import bookRoutes from '../src/Routes/book.routes'
import borrowRoutes from '../src/Routes/borrow.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    success: false,
    error: { name: 'NotFoundError' }
  });
});

export default app;
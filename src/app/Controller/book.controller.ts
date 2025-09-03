import { Request, Response } from 'express';
import { Book } from '../Models/book.model';

// Create a new book
export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = new Book(req.body);
    const savedBook = await book.save();
    
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: savedBook
    });
  } catch (error: any) {
    res.status(400).json({
      message: 'Failed to create book',
      success: false,
      error: error
    });
  }
};

// Get all books with filtering and sorting
export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filter, sortBy = 'createdAt', sort = 'desc', limit = '10' } = req.query;
    
    const query: any = {};
    if (filter) {
      query.genre = filter;
    }
    
    const sortOptions: any = {};
    sortOptions[sortBy as string] = sort === 'desc' ? -1 : 1;
    
    const books = await Book.find(query)
      .sort(sortOptions)
      .limit(Number(limit));
    
    res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      data: books
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Failed to retrieve books',
      success: false,
      error: error
    });
  }
};

// Get book by ID
export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findById(req.params.bookId);
    
    if (!book) {
      res.status(404).json({
        message: 'Book not found',
        success: false,
        error: { name: 'NotFoundError' }
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Book retrieved successfully',
      data: book
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Failed to retrieve book',
      success: false,
      error: error
    });
  }
};

// Update book
export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.bookId,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!book) {
      res.status(404).json({
        message: 'Book not found',
        success: false,
        error: { name: 'NotFoundError' }
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error: any) {
    res.status(400).json({
      message: 'Failed to update book',
      success: false,
      error: error
    });
  }
};

// Delete book
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findByIdAndDelete(req.params.bookId);
    
    if (!book) {
      res.status(404).json({
        message: 'Book not found',
        success: false,
        error: { name: 'NotFoundError' }
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: null
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Failed to delete book',
      success: false,
      error: error
    });
  }
};
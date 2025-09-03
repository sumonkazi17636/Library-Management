import { Request, Response } from 'express';
import { Borrow } from '../Models/borrow.model';
import { Book } from '../Models/book.model';

// Borrow a book
export const borrowBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { book, quantity, dueDate } = req.body;
    
    // Check if book exists
    const bookDoc = await Book.findById(book);
    if (!bookDoc) {
      res.status(404).json({
        message: 'Book not found',
        success: false,
        error: { name: 'NotFoundError' }
      });
      return;
    }
    
    // Check if book has enough copies and is available
    // Using direct property access instead of instance method
    if (bookDoc.copies < quantity || !bookDoc.available) {
      res.status(400).json({
        message: 'Not enough copies available',
        success: false,
        error: { name: 'ValidationError' }
      });
      return;
    }
    
    // Create borrow record
    const borrow = new Borrow({
      book,
      quantity,
      dueDate: new Date(dueDate)
    });
    
    const savedBorrow = await borrow.save();
    
    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: savedBorrow
    });
  } catch (error: any) {
    res.status(400).json({
      message: 'Failed to borrow book',
      success: false,
      error: error
    });
  }
};

// Get borrowed books summary using aggregation
export const getBorrowedBooksSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: '$book',
          totalQuantity: { $sum: '$quantity' }
        }
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookDetails'
        }
      },
      {
        $unwind: '$bookDetails'
      },
      {
        $project: {
          _id: 0,
          book: {
            title: '$bookDetails.title',
            isbn: '$bookDetails.isbn'
          },
          totalQuantity: 1
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      message: 'Borrowed books summary retrieved successfully',
      data: summary
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Failed to retrieve borrowed books summary',
      success: false,
      error: error
    });
  }
};
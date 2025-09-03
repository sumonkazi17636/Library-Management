import { Schema, model, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  genre: 'FICTION' | 'NON_FICTION' | 'SCIENCE' | 'HISTORY' | 'BIOGRAPHY' | 'FANTASY';
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    maxlength: [50, 'Author name cannot exceed 50 characters']
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    enum: {
      values: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'],
      message: 'Genre must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY'
    }
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    validate: {
      validator: function(v: string) {
        return /^(?:\d{10}|\d{13})$/.test(v);
      },
      message: 'ISBN must be 10 or 13 digits'
    }
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  copies: {
    type: Number,
    required: [true, 'Copies count is required'],
    min: [0, 'Copies must be a positive number']
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Static method to update availability
bookSchema.statics.updateAvailability = async function(bookId: string) {
  const book = await this.findById(bookId);
  if (book) {
    book.available = book.copies > 0;
    await book.save();
  }
};

// Instance method to check if copies can be borrowed
bookSchema.methods.canBorrow = function(quantity: number): boolean {
  return this.copies >= quantity && this.available;
};

// Middleware to update availability before saving
bookSchema.pre('save', function(next) {
  this.available = this.copies > 0;
  next();
});

export const Book = model<IBook>('Book', bookSchema);
import { Schema, model, Document, Types } from 'mongoose';
import { Book, IBook } from './book.model';

export interface IBorrow extends Document {
  book: Types.ObjectId | IBook;
  quantity: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const borrowSchema = new Schema<IBorrow>({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book reference is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    validate: {
      validator: function(v: Date) {
        return v > new Date();
      },
      message: 'Due date must be in the future'
    }
  }
}, {
  timestamps: true
});

// Middleware to update book copies after borrowing
borrowSchema.post('save', async function() {
  const book = await Book.findById(this.book);
  if (book) {
    book.copies -= this.quantity;
    await book.save();
    
    // Update availability using the static method - FIXED
    // Cast to any to bypass TypeScript type checking issues
    await (Book as any).updateAvailability(this.book.toString());
  }
});

export const Borrow = model<IBorrow>('Borrow', borrowSchema);
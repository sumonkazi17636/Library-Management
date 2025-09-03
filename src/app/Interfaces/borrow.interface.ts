import { Document, Types } from 'mongoose';
import { IBook } from './book.interface';

export interface IBorrow extends Document {
  book: Types.ObjectId | IBook;
  quantity: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
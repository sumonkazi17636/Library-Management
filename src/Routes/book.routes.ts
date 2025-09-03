import express from 'express';
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook
} from '../app/Controller/book.controller';

const router = express.Router();

router.post('/', createBook);
router.get('/', getBooks);
router.get('/:bookId', getBookById);
router.put('/:bookId', updateBook);
router.delete('/:bookId', deleteBook);

export default router;
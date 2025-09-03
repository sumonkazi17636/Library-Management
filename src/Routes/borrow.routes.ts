import express from 'express';
import {
  borrowBook,
  getBorrowedBooksSummary
} from '../app/Controller/borrow.controller';

const router = express.Router();

router.post('/', borrowBook);
router.get('/', getBorrowedBooksSummary);

export default router;
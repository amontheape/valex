import { Router } from 'express';
import cardRouter from './cardRouter.js';
import purchaseRouter from './purchaseRouter.js';

const router = Router();

router.use(cardRouter);
router.use(purchaseRouter);

export default router;
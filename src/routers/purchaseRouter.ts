import { Router } from 'express';
import * as controller from '../controllers/purchaseController.js';
import validateSchema from '../middlewares/validateSchema.js';
import purchaseSchema from '../schemas/purchaseSchema.js';

const purchaseRouter = Router();

purchaseRouter.post('/purchase/cards/:id', validateSchema(purchaseSchema), controller.createPurchase);

export default purchaseRouter;
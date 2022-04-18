import { Router } from 'express';
import validateApiKey from '../middlewares/validateApiKey.js';
import validateSchema from '../middlewares/validateSchema.js';
import * as controller from '../controllers/cardController.js';

const cardRouter = Router();

cardRouter.post('/cards', validateSchema, validateApiKey, controller.createCard);
cardRouter.put('/cards/:id/activate', validateSchema, controller.activateCard);

export default cardRouter;
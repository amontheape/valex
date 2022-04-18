import { Router } from 'express';
import validateApiKey from '../middlewares/validateApiKey.js';
import validateSchema from '../middlewares/validateSchema.js';
import * as controller from '../controllers/cardController.js';
import cardSchema from '../schemas/cardSchema.js';
import activationSchema from '../schemas/activationSchema.js';
import rechargeSchema from '../schemas/rechargeSchema.js';

const cardRouter = Router();

cardRouter.post('/cards', validateSchema(cardSchema), validateApiKey, controller.createCard);
cardRouter.get('/cards/:id', controller.getNetWorth);
cardRouter.put('/cards/:id/activate', validateSchema(activationSchema), controller.activateCard);
cardRouter.put('/cards/:id/recharge', validateSchema(rechargeSchema), validateApiKey, controller.rechargeCard);

export default cardRouter;
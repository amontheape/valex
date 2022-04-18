import { Request, Response } from 'express';
import * as purchaseService from '../services/purchaseService.js';

export async function createPurchase( req: Request, res: Response ) {
  const cardId = req.params.id;
  const purchaseInfo = req.body;
  await purchaseService.createPurchase( {...purchaseInfo, cardId } );
  res.sendStatus(200);
}
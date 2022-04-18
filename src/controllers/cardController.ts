import { Request, Response } from 'express';
import * as cardService from '../services/cardService.js';

export async function createCard( req: Request, res: Response) {
  const newCard = req.body;
  await cardService.createCard(newCard);
  res.sendStatus(201);
}
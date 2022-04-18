import { Request, Response } from 'express';
import * as cardService from '../services/cardService.js';

export async function createCard( req: Request, res: Response ) {
  const newCard = req.body;
  await cardService.createCard(newCard);
  res.sendStatus(201);
}

export async function activateCard( req: Request, res: Response ) {
  const cardId = req.params.id;
  const card = req.body;
  await cardService.activateCard({...card, cardId});
  res.sendStatus(201);
}
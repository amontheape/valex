import bcrypt from 'bcrypt';
import { calcBalance, getPayments, getRecharges, validateCard } from "./cardService.js";
import * as paymentRepository from '../repositories/paymentRepository.js';
import * as businessRepository from '../repositories/businessRepository.js';

/*** main services ***/

export async function createPurchase( purchaseInfo: any ) {
  const { businessId, amount, cardId } = purchaseInfo;
  const card = await validateCard( parseInt(cardId) );
  await validatePurchase( card, purchaseInfo )
  await paymentRepository.insert( { cardId, businessId, amount } )   

}

/*** agregate functions ***/

async function validatePurchase( card: any, purchaseInfo: any ) {
  if ( !bcrypt.compareSync(purchaseInfo.password, card.password) ) throw { type: 'unauthorized', message: 'wrong password'};
  if ( purchaseInfo.amount <= 0 ) throw { type: 'bad_request', message: 'invalid process amount'};
  await checkBusiness(purchaseInfo.businessId, card);
  await checkBalance(card.id, purchaseInfo.amount); 
}

async function checkBusiness( id: number, card: any) {
  const business = await businessRepository.findById(id);
  if ( !business ) throw { type: 'not_found', message: 'business not found'};
  if ( card.type !== business.type ) throw { type: 'unprocessable_entity', message: 'invalid card type' };
  return ;
}

async function checkBalance(cardId : number, amount: number) {
  let payments = await getPayments( cardId );
  if ( payments.length === 0 ) payments = [];
  let recharges = await getRecharges( cardId );
  if ( recharges.length === 0 ) recharges = [];
  const balance = calcBalance( payments, recharges);
  if ( balance < amount ) throw { type: 'bad_request', message: 'insufficient balance'}
  return ;
}
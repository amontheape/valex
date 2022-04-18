import * as cardRepository from '../repositories/cardRepository.js';
import * as employeeRepository from '../repositories/employeeRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';
import * as rechargeRepository from '../repositories/rechargeRepository.js';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

/*** main services ***/

export async function createCard( newCard: any ) {
  const employee = await checkEmployee( newCard.employeeId );
  await checkType( newCard.type, newCard.employeeId );
  const cardholderName = formatName(employee);
  const { number, securityCode, expirationDate } = generateRandomCard();

  await cardRepository.insert({
    employeeId: newCard.employeeId,
    number,
    cardholderName,
    securityCode,
    expirationDate,
    isVirtual: false,
    isBlocked: true,
    type: newCard.type
  })
}

export async function activateCard( cardInfo: any ) {
  const card: any = await validateCard( parseInt(cardInfo.cardId) );
  if ( card.password ) throw { type: 'bad_request', message: 'This card has already been activated' };
  if ( !bcrypt.compareSync(cardInfo.CVV, card.securityCode) ) throw { type: 'unauthorized', message: 'CVV does not match card-id' };

  const hashedPassword = bcrypt.hashSync(cardInfo.password, 10);

  await cardRepository.update(cardInfo.cardId, {...card, password: hashedPassword});
}

export async function getNetWorth( cardId: number ) {
  await checkCardExistence( cardId );
  const payments = getPayments( cardId );
  const recharges = getRecharges( cardId );
  const balance = calcBalance( payments, recharges );
  return {balance, transactions: payments, recharges }
}

export async function rechargeCard( cardId: number, amount: number) {
  await validateCard( cardId );
  await rechargeRepository.insert( {cardId, amount} );
}

/*** agregate functions ***/

// creation related functions:
async function checkEmployee( id: number ) {
  const employeeExists = await employeeRepository.findById( id );
  if (!employeeExists) throw { type: 'not_found', message: 'Employee not found' };

  return employeeExists.fullName;
}

async function checkType( type: cardRepository.TransactionTypes, employeeId: number ) {
  const typeExists = await cardRepository.findByTypeAndEmployeeId( type, employeeId );
  if (typeExists) throw { type: 'conflict', message: 'Employee may only have 1 card of each type' };
}

function formatName( fullName: string ) {
  const splits = fullName.split(' ');

  return splits.map( ( name: string, index: number ) => {
    if ( index === 0 || index === splits.length-1 ) return name.toUpperCase();
    else if ( name.length > 2 ) return name[0].toUpperCase();
  }).join(' ');
}

function generateRandomCard() {
    const number = faker.finance.creditCardNumber('mastercard');
    const hashedSecurityCode = bcrypt.hashSync(faker.finance.creditCardCVV(), 10);
    const expirationDate = dayjs().add(5, "year").format("MM/YY");

  return { number, securityCode: hashedSecurityCode, expirationDate }
}

// activation related functions:

async function validateCard( cardId: number ) {
  const card = await checkCardExistence(cardId);
  await checkCardExpiration(card.expirationDate);
  if ( card.isVirtual ) throw { type: 'unprocessable_entity', message: 'Operation not available for virtual card' };
  return card;
}

async function checkCardExistence( cardId: number ) {
  const card = await cardRepository.findById(cardId);
  if ( !card ) throw { type: 'not_found', message: 'Card-id is not registered' };

  return card;
}

async function checkCardExpiration( expirationDate: string ) {
  if ( dayjs(expirationDate).isBefore(dayjs().format("MM/YY")) ) throw { type: 'bad_request', message: 'Card is expired' }
  return ;
}

// Net Worth related functions: 

async function getPayments( cardId: number ) {
  return await paymentRepository.findByCardId(cardId);
}

async function getRecharges( cardId: number ) {
  return await rechargeRepository.findByCardId(cardId);
}

function calcBalance( payments: any, recharges: any ) {
  const totalPayments = payments.reduce( (acc: number, cur: any) => acc += cur.amount );
  const totalRecharges = recharges.reduce( (acc: number, cur: any) => acc += cur.amount );

  return totalRecharges - totalPayments;
}
import * as cardRepository from '../repositories/cardRepository.js';
import * as employeeRepository from '../repositories/employeeRepository.js';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

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

async function checkType( type: cardRepository.TransactionTypes, employeeId: number ) {
  const typeExists = await cardRepository.findByTypeAndEmployeeId( type, employeeId );
  if (typeExists) throw { type: 'conflict', message: 'Employee may only have 1 card of each type' };
}

async function checkEmployee( id: number ) {
  const employeeExists = await employeeRepository.findById( id );
  if (!employeeExists) throw { type: 'not_found', message: 'Employee not found' };

  return employeeExists.fullName;
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
import * as companyRepository from '../repositories/companyRepository.js';

export async function validateKey(apiKey: string) {
  const company = await companyRepository.findByApiKey(apiKey);
  if(!company) throw { type: 'unauthorized', message: 'Invalid api key'};

  return company;
}
import { NextFunction, Request, Response } from "express";

export default async function errorHandler(error: any, req: Request, res: Response, next: NextFunction ) {
  switch(error.type){
    case 'bad_request' :
      return res.status(400).send(error.message);
    case 'unauthorized' :
      return res.status(401).send(error.message);
    case 'not_found' :
      return res.status(404).send(error.message);
    case 'conflict' :
      return res.status(409).send(error.message);
    case 'unprocessable_entity' :
      return res.status(422).send(error.message);
    default :
      return res.status(500).send(error.message);
  }
}
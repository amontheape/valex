import { NextFunction, Request, Response } from "express";

export default async function errorHandler(error, req: Request, res: Response ) {
  switch(error.type){
    case 'bad_request' :
      return res.status(400);
    case 'unauthorized' :
      return res.status(401);
    case 'not_found' :
      return res.status(404);
    case 'conflict' :
      return res.status(409);
    case 'unprocessable_entity' :
      return res.status(422);
    default :
      return res.status(500);
  }
}
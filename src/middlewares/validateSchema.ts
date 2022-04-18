import { NextFunction, Request, Response } from "express"

export default function validateSchema( schema: any ) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate( req.body, {abortEarly: false} );
    if (validation.error) {
      return res.status(422).send(validation.error.details);
    }

    next();
  }
}
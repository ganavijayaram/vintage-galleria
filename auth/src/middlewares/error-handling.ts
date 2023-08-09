import { Request, Response, NextFunction } from "express"
import { RequestValidationError } from "../errors/request-validation-error"
import { DatabaseConnectionError } from "../errors/database-connetion-error"
import { CustomError } from "../errors/custom-error"


// our front end will be getting same error structure from all the different microservices.
// so that there is consistency and front will be able to handle the errors in the same fashion
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if(err instanceof CustomError) {
    console.log('Custom Error!!')
    return res.status(err.statusCode).send({errors: err.serializeErrors()})
  }
  else {
    console.log('Unknown Type Error!!')
    return res.status(400).send({errors: 'Unknown Type Error!!'})
  }
}
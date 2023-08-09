import { Request, Response, NextFunction } from "express"
import { RequestValidationError } from "../errors/request-validation-error"
import { DatabaseConnectionError } from "../errors/database-connetion-error"



// our front end will be getting same error structure from all the different microservices.
// so that there is consistency and front will be able to handle the errors in the same fashion
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if(err instanceof RequestValidationError) {
    console.log('Request Validation Error!!')
  }
  else if(err instanceof DatabaseConnectionError) {
    console.log('Database Connection Error!!')
  }
  else {
    console.log('Unknown Type Error!!')
  }
  res.status(400).send({
    "message": err.message
  })
}
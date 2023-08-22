//These imports are for typescript type validation
import { Request, Response, NextFunction } from "express";


import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

//This middleware is to cpature any validation error in the incoming requests

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
   //before we procees, if there are any errors during the validation, we are going to get those errors
   const errors = validationResult(req)

   if(!errors.isEmpty()) {
     //sending the errors as an array
     throw new RequestValidationError(errors.array())
   }
  //if we pass the above step, it measns go the next middleware in the chain or to the next route handler
  next()
}

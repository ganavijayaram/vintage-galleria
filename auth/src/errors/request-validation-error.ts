//Used for some validation error
import {ValidationError}from 'express-validator'


export class RequestValidationError extends Error {
  
  constructor(public errors: ValidationError[]) {
    super()
    //because we are extedning built in Error class
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }
}

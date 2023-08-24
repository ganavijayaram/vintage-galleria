export abstract class CustomError extends Error {
  abstract statusCode: number
  //return array of object which has message and optional field as properties
  abstract serializeErrors(): {message: string; field?: string}[]
  constructor(message: string) {
    super(message)
    //because we are extedning built in Error class
    Object.setPrototypeOf(this, CustomError.prototype)
  }

}
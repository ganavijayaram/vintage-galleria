import { Request, Response, NextFunction } from "express"


// our front end will be getting same error structure from all the different microservices.
// so that there is consistency and front will be able to handle the errors in the same fashion
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log("Error!")
  res.status(400).send({
    "message": err.message
  })
}
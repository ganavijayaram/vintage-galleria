import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'

interface UserPayload {
  id: string
  email: string
}

// we are trying to add currentUser as optional field of teh goblab Request
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //If the user is logged in we will get a request with JWT in the cookie, else empty if they user is loggin in 
  //if(!req.session?.jwt) -> this is an alternative way
  if(!req.session || !req.session.jwt) {
    //if session is not present if JWT is in not there go to the next middleware
    return next()
  }
  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload
    req.currentUser = payload
  }
  catch(err) {
  
  }
  next()
}

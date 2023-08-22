//Request and Response are the types to validate the req, res in the routes
import express, {Request, Response} from "express";
import jwt from 'jsonwebtoken'
//using the  express validator to validate the imcoming requests
import { body, validationResult } from "express-validator";

const router = express.Router()

router.get('/api/users/currentuser', (req, res) => {

  //If the user is logged in we will get a request with JWT in the cookie, else empty if they user is loggin in 
  //if(!req.session?.jwt) -> this is an alternative way
  if(!req.session || !req.session.jwt) {
    return res.send({currentUser: null})
  }
  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!)
    res.send({currentUser: payload})
  }
  catch(err) {
    res.send({currentUser: null})
  }

  
})


//renaming it because we will have multiple routers
export {router as currentUserRouter}
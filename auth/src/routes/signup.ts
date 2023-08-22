//Request and Response are the types to validate the req, res in the routes
import express, {Request, Response} from "express";

//using the  express validator to validate the imcoming requests
import { body, validationResult } from "express-validator";
// to create, send and verify Json web token
import jwt from 'jsonwebtoken';

//Custom error handlers
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connetion-error";
import { BadRequestError } from "../errors/bad-request-error";
import { validateRequest } from "../middlewares/validate-requests";


import { User } from "../models/user";

const router = express.Router()
/*
router.post('/api/users/signup', (req, res) => {
  res.send({"message": "Ganavi got an internship and fulltime!!!"})
})
*/
router.post('/api/users/signup',  [
  //checking is the body contains email
  body('email')
    //built in function for express to check if it is an email
    .isEmail()
    // if none of the above conditions are passes, will throw error with the following message
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({min: 4, max: 20})
    .withMessage('Password must be betweeb 4 and 20 characters')
    //Typescript needs to know the tyoe of the arguments and return type of the function
] ,
//callign the middleware where validaterequest logic is present
validateRequest,
async (req: Request, res: Response) => {

 

  //Check if the user with the email is already present
  const {email, password} = req.body
  //will return null if empty or will return the details if the user is present
  const existingUser = await User.findOne({email})
  if(existingUser) {
    
    throw new BadRequestError('Email is already in use!!!')
  }

  
  //cretaing user using the usermodel
  const user = User.build({email, password})
  //saving the user to the DB
  await user.save()

  // Generate JWT 
  //sign : payload, signature
  const userJwt = jwt.sign({
    id: user.id,
    email: user.email
    //! tells we have already done the check to see this particular env is present somewhere else
    // the reason we are doing it in the beginning of the application start up is, our application to should throw error in the beginniing
    // and notsomewhere in the beginning
  }, process.env.JWT_KEY!)
  // Store it on sesson object
  //here since req.session does not have jwt, we are redefingin the object
  //because typescript does not want us to assule req.session ahs jwt
  req.session = {
    jwt: userJwt
  }
  res.status(201).send(user)
})

//renaming it because we will have multiple routers
export {router as signupRouter}
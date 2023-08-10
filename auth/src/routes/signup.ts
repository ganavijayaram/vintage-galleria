//Request and Response are the types to validate the req, res in the routes
import express, {Request, Response} from "express";

//using the  express validator to validate the imcoming requests
import { body, validationResult } from "express-validator";

//Custom error handlers
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connetion-error";
import { BadRequestError } from "../errors/bad-request-error";


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
] ,async (req: Request, res: Response) => {

  //before we procees, if there are any errors during the validation, we are going to get those errors
  const errors = validationResult(req)

  if(!errors.isEmpty()) {
    //sending the errors as an array
    throw new RequestValidationError(errors.array())
  }

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

  res.status(201).send(user)
})

//renaming it because we will have multiple routers
export {router as signupRouter}
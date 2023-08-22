import express from "express";
import { body, validationResult } from "express-validator";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'


import { RequestValidationError } from "../errors/request-validation-error";
import { validateRequest } from "../middlewares/validate-requests";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/password";

const router = express.Router()

router.post('/api/users/signin', [
  body('email')
  .isEmail()
  .withMessage('Email must be valid'),
body('password')
  .trim()
  .notEmpty()
  .withMessage('Please enter Password')
], 
validateRequest,
async (req: Request, res: Response) => {
  //1. verify if the user exists
  //2. verify if the passwords match
 

  const {email, password} = req.body

  const existingUser =  await User.findOne({email})

  //During the validation, when we throw errors, we need to provide as little information as possible
  //so we are using the bas request instead of giving the actual detail
  if(!existingUser) {
    throw new BadRequestError('Invalid Credentials!')
  }
  
 
  const passwordMatch = await Password.compare(existingUser.password, password,)
 
  if(!passwordMatch) {
    throw new BadRequestError('Invalid Credentials!')
  }
 

  // Generate JWT , store it in cookie and send it to the user
  const userJwt = jwt.sign({
    id: existingUser.id,
    email: existingUser.email
  }, process.env.JWT_KEY!)
  req.session = {
    jwt: userJwt
  }
  //res.send("Ganavi got an internship and fulltime in signin!!!")
  res.status(200).send(existingUser)
  
})


//renaming it because we will have multiple routers
export {router as signinRouter}
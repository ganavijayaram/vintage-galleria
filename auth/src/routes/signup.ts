//Request and Response are the types to validate the req, res in the routes
import express, {Request, Response} from "express";

//using the  express validator to validate the imcoming requests
import { body, validationResult } from "express-validator";

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
] , (req: Request, res: Response) => {

  //before we procees, if there are any errors during the validation, we are going to get those errors
  const errors = validationResult(req)

  if(!errors.isEmpty()) {
    //sending the errors as an array
    return res.status(400).send(errors.array())
  }


  const {email, password} = req.body

  console.log("current-user(/api/users/signup):Creating user")
  
  res.send({"message": "Ganavi got an internship and fulltime!!!!!"})
})

//renaming it because we will have multiple routers
export {router as signupRouter}
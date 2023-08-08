//Request and Response are the types to validate the req, res in the routes
import express, {Request, Response} from "express";

//using the  express validator to validate the imcoming requests
import { body, validationResult } from "express-validator";

const router = express.Router()

router.get('/api/users/currentuser', (req, res) => {
  res.send("currentuser(/api/users/currentuser): Ganavi got coop and full time")
})


//renaming it because we will have multiple routers
export {router as currentUserRouter}
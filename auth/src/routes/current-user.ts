//Request and Response are the types to validate the req, res in the routes
import express, {Request, Response} from "express";
import jwt from 'jsonwebtoken'
//using the  express validator to validate the imcoming requests
import { body, validationResult } from "express-validator";
import { currentUser } from "../middlewares/current-user";
import { requireAuth } from "../middlewares/require-auth";

const router = express.Router()

router.get('/api/users/currentuser', currentUser, requireAuth, (req, res) => {

 res.send({currentUser: req.currentUser || null})

  
})


//renaming it because we will have multiple routers
export {router as currentUserRouter}
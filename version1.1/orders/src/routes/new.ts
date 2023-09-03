// this is for people who are trying to purchase the artifact
import { requireAuth, validateRequest } from '@vintagegalleria/common'
import express, {Request, Response} from 'express'
import { body } from 'express-validator'
import mongoose from 'mongoose'

const router = express.Router()

router.post('/api/orders/',
 requireAuth,
 [
  body('artifactId')
    .not()
    .isEmpty()
    // we are making sure that artifactId is mongoose verified Id, as we are 
    // storing the Id in the mongoose
    // but this will cause coupling, because right now we are usig the 
    // mongo to store, but what if later we are using someother database
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('ArtifactId has to be Present')
 ], 
 validateRequest, 
 async (req: Request, res: Response) => {
  res.send({"message": "Everything good is happening to Ganavi!"})
})

export {router as newOrderRouter}
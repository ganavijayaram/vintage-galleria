//this route is to create a new artifact
import express,  {Request, Response} from 'express'
import { body } from 'express-validator'


import { requireAuth, validateRequest } from '@vintagegalleria/common'
import { Artifact } from '../models/artifact'
import { ArtifactCreatedPublisher } from '../events/publishers/artifact-created-publishers'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

// adding the validation after authentication
//if not authenticted no point in validating
// then validateRequest is used to throw errors caught by the body
// body will check but will not throw error, instead it will accumulate in validationResult(req)

router.post('/api/artifacts', requireAuth, [
  body('title')
  // checks if the title is not provided
  .not()
  // checks if the title is empty
  .isEmpty()
  .withMessage('Please provide Title'),
  body('price')
    .isFloat({gt:0})
    .withMessage('Price must be greater than 0')
], validateRequest, async (req: Request, res: Response) => {

  const {title, price} = req.body

  const artifact = Artifact.build({
    title,
    price,
    // initaly it will throw an error because currentUser is set only if the user is signed in
    // so typescript will throw error
    // but we know that we have a middleware called requireAuth which will throw error if the user is not signed in
    // so we tell TS not worry by !
    userId: req.currentUser!.id
  })

  // saving the artifact into the database
  await artifact.save()

  //After we create an artifact we are publishing artifact-created to NATS
  // dont have to call .client() or .get()
  await new ArtifactCreatedPublisher(natsWrapper.client).publish({
    id: artifact.id,
    version: artifact.version,
    // we could just say title = title,
    // but what we send to database might be differnet what is saved to the datbase after validation
    title: artifact.title, 
    price: artifact.price,
    userId: artifact.userId
  })


  res.status(201).send(artifact)
})

// We are renaming it because, we will be creating many different router in different files and when
//we try to import them in our index/app, we might get confused
export {router as createArtifactRouter}
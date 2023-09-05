// this is for people who are trying to purchase the artifact
import { BadRequestError, NotFoundError, requireAuth, validateRequest, OrderStatus} from '@vintagegalleria/common'
import express, {Request, Response} from 'express'
import { body } from 'express-validator'
import mongoose from 'mongoose'

import { Artifact } from '../models/artifact'
import { Order } from '../models/orders'
import { natsWrapper } from '../nats-wrapper'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'

const router = express.Router()

// we could set as environment variable in kubernetes, so everytime we make changes in this file,
//  we dont have to deploy it
const EXPIRATION_WINDOW_SECONDS = 15

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
  const {artifactId} = req.body

  // Find the artifact the user is trying to order from the database
  const artifact =  await Artifact.findById(artifactId)
  if(!artifact) {
    throw new NotFoundError()
  }

  /* ensuring the artifact is not reserved
    if artifact is associated with a order, and the if that order status is not cancelled
    it means its reserved
    if status is cancelled then artifact can go back to the pool 

    To do this: we will run query on all order. find the order where artifact is the artifact above and 
    status of this order is not cancelled
   */

    const isReserved =  await artifact.isReserved()

    if(isReserved) {
      throw new BadRequestError('Artifact already Reserved')
    }

  // calculate the expiration data
  const expiration =  new Date()
  // advantacing tge
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

  // build the order and save to the DB
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    artifact: artifact
  })

  await order.save()

  // publish event that order is created
  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    status: order.status,
    userId: order.userId,
    // if we give date or covert date to strin, it will be in current timezone, we dont want that
    // we need the date to be in UTC
    expiresAt: order.expiresAt.toISOString(),
    artifact: {
      id: artifact.id,
      price: artifact.price
    }
  })

  res.status(201).send(order)
})

export {router as newOrderRouter}
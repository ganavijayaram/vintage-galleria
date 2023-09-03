import express, {Request, Response} from 'express'

import { NotAuthorizedError, NotFoundError, requireAuth } from '@vintagegalleria/common'
import { Order } from '../models/orders'

const router = express.Router()

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {

  // populate is used to get the associate artifact for the order fetched
  const order = await Order.findById(req.params.orderId).populate('artifact')

  if(!order) {
    throw new NotFoundError()
  }

  // if the user is not authorised to access the order
  if(order.userId != req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  res.send(order)
})

export {router as showOrderRouter}
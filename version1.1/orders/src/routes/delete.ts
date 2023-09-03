import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@vintagegalleria/common'
import express, {Request, Response} from 'express'
import { Order } from '../models/orders'

import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()


// NOT actually deleting it instead we are cancelling it
router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {

  
  const order = await Order.findById(req.params.orderId).populate('artifact')

  if(!order) {
    throw new NotFoundError()
  }

  // if the user is not authorised to access the order
  if(order.userId != req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  order.status = OrderStatus.Cancelled
  await order.save()


  // Publishing an event to say the order was cancelled
  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    artifact: {
      id: order.artifact.id
    }
  })
  res.status(204).send(order)

 
})

export {router as deleteOrderRouter}
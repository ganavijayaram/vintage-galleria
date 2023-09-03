import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@vintagegalleria/common'
import express, {Request, Response} from 'express'
import { Order } from '../models/orders'

const router = express.Router()


// NOT actually deleting it instead we are cancelling it
router.delete('/api/orders/delete', requireAuth, async (req: Request, res: Response) => {

  
  const order = await Order.findById(req.params.orderId)

  if(!order) {
    throw new NotFoundError()
  }

  // if the user is not authorised to access the order
  if(order.userId != req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  order.status = OrderStatus.Cancelled
  await order.save()

  res.status(204).send(order)

 
})

export {router as deleteOrderRouter}
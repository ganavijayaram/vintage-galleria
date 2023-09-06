import express,  { Request, Response} from 'express'
import { body } from 'express-validator'
import { 
  BadRequestError,
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth, 
  validateRequest,

} from '@vintagegalleria/common'
import { Order } from '../models/order'
import { stripe } from '../stripe'


const router = express.Router()

router.post('/api/payments', 
requireAuth,
[
  body('token')
    .not()
    .isEmpty(),
  body('orderId')
    .not()
    .isEmpty()
],
validateRequest,
async (req: Request, res: Response) => {
  const { token, orderId} = req.body

  // Find the order for the given orderId
  const order = await Order.findById(orderId)

  if(!order) {
    throw new NotFoundError()
  }

  // if the order does not belong to the current user throw error
  if(order.userId != req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  console.log('NEW ', order)

  // checki if order is not cancelled
  if(order.status === OrderStatus.Cancelled) {
    throw new BadRequestError('Order Expired')
  }


  await stripe.charges.create({
    currency: 'usd',
    // should be in cents
    amount: order.price * 100,
    source: token
  })

  res.status(201).send({success: true})
})

export {router as createChargeRouter}
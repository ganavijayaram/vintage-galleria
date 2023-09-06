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
import { Payment } from '../models/payments'
import { natsWrapper } from '../nats-wrapper'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'


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

  

  // checki if order is not cancelled
  if(order.status === OrderStatus.Cancelled) {
    throw new BadRequestError('Order Expired')
  }


  const charge = await stripe.charges.create({
    currency: 'usd',
    // should be in cents
    amount: order.price * 100,
    source: token
  })

  //Creating PAYMENT record
  const payment = Payment.build({
    orderId,
    stripeId: charge.id
  })

  

  await payment.save()

  // publishing payment created event
   new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    orderId: payment.orderId,
    stripeId: payment.stripeId
  })

  res.status(201).send({id: payment.id})
})

export {router as createChargeRouter}
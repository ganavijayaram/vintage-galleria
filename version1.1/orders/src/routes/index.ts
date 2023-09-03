import express, {Request, Response} from 'express'

//We are getting all the order associated with the user who is making the request
import { requireAuth } from '@vintagegalleria/common'
import { Order } from '../models/orders'

const router = express.Router()

router.get('/api/orders/', 
requireAuth, 
async (req: Request, res: Response) => {
  const orders = await Order.find({
    // we get the current User details in the requireAuth
    userId: req.currentUser!.id
  }).populate('artifact')

  res.send(orders)
})

export {router as indexOrderRouter}
import { OrderStatus } from '@vintagegalleria/common'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { stripe } from '../../stripe'

jest.mock('../../stripe')

it('return 404 when order does not exist', async() => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'ancd',
      orderId: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(404)
})

it('returns 401 when user is not authorised', async() => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 200,
    status: OrderStatus.Created
  })

  await order.save()



  await request(app)
  .post('/api/payments')
  .set('Cookie', global.signin())
  .send({
    token: 'ancd',
    orderId: order.id
  })
  .expect(401)
  
})

it('returns 400 if order id cancelled', async() => {
  const userId = new mongoose.Types.ObjectId().toHexString()
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: userId,
    price: 200,
    status: OrderStatus.Cancelled
  })

  await order.save()

  await request(app)
  .post('/api/payments')
  .set('Cookie', global.signin(userId))
  .send({
    token: 'ancd',
    orderId: order.id
  })
  .expect(400)

  
})

it('returns 204 with valid inputs', async () => {

  const userId = new mongoose.Types.ObjectId().toHexString()
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: userId,
    price: 200,
    status: OrderStatus.Created
  })

  await order.save()

  console.log('TESTTT ', order)

  await request(app)
  .post('/api/payments')
  .set('Cookie', global.signin(userId))
  .send({
    token: 'tok_visa',
    orderId: order.id
  })
  .expect(201)

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]

  expect (chargeOptions.source).toEqual('tok_visa')
  expect (chargeOptions.amount).toEqual(200*100)
  expect (chargeOptions.currency).toEqual('usd')
})

it('', () => {
  
})
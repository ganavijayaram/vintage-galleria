import request from 'supertest'

import { app } from '../../app'
import { Artifact } from '../../models/artifact'
import { Order, OrderStatus } from '../../models/orders'
import { natsWrapper } from '../../nats-wrapper'


it('marks order as cancelled', async() => {

  // create artifact
  const artifact = Artifact.build({
    title: 'Vase',
    price: 200
  })

  await artifact.save()

  //make request to create order
  const user = global.signin()
  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({artifactId: artifact.id})
    .expect(201)

    console.log(order)

  //make request to cancel order
  const cancelledOrder = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  //expect to see if the order is cancelled
  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

})

it('Emits a order cancelled event', async () => {
  // create artifact
  const artifact = Artifact.build({
    title: 'Vase',
    price: 200
  })

  await artifact.save()

  //make request to create order
  const user = global.signin()
  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({artifactId: artifact.id})
    .expect(201)

    console.log(order)

  //make request to cancel order
  const cancelledOrder = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

 

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
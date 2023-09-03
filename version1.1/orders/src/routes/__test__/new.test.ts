import request from "supertest"
import mongoose from "mongoose"

import  {app} from '../../app'
import { Order, OrderStatus } from "../../models/orders"
import { Artifact } from "../../models/artifact"
import { natsWrapper } from "../../nats-wrapper"

it('returns error id artifact does not exist', async () => {
  // generating valid mongoose id
  const artifactId =  new mongoose.Types.ObjectId()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({artifactId})
    .expect(404)
})

it('returns error if the artifact is reserved', async () => {

  // creating artifact and saving in the DB
  const artifact = Artifact.build({
    title: 'Vase',
    price: 200
  })
  await artifact.save()

  // creating order and associating it with the above artifact
  const order = Order.build({
    userId: 'abcdef',
    artifact: artifact,
    status: OrderStatus.Created,
    expiresAt: new Date()
  })

  await order.save()

  // actual testing
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({artifactId: artifact.id})
    .expect(400)
  
})

it('reserves an artifact', async () => {
  // creating artifact and saving in the DB
  const artifact = Artifact.build({
    title: 'Vase',
    price: 200
  })
  await artifact.save()

  
  // actual testing
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({artifactId: artifact.id})
    .expect(201)
  
  
})

// we are not using the real natswrapper and we are using the mock one
it('emits an order event', async () => {
   // creating artifact and saving in the DB
   const artifact = Artifact.build({
    title: 'Vase',
    price: 200
  })
  await artifact.save()

  
  // actual testing
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({artifactId: artifact.id})
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

})
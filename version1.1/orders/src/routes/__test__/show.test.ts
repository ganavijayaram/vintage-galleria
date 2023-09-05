import { OrderStatus } from '@vintagegalleria/common'
import mongoose from 'mongoose'
import request from 'supertest'

import { app } from '../../app' 
import { Artifact } from '../../models/artifact'
import { Order } from '../../models/orders'

it('fetches the order', async () => {
  // create artifact
  const artifactOne = await Artifact.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Vase',
    price: 200
  })

await artifactOne.save()

//build order with artifact
const user = global.signin()
const {body: order} = await request(app)
  .post('/api/orders')
  .set('Cookie', user)
  .send({artifactId: artifactOne.id})
  .expect(201)

//fetch the order
const {body: fetchorder} = await request(app)
  .get(`/api/orders/${order.id}`)
  .set('Cookie', user)
  .send()
  .expect(200)

expect(fetchorder.id).toEqual(order.id)

})


it('returns error if accesising someone elses order', async () => {
  // create artifact
  const artifactOne = await Artifact.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Vase',
    price: 200
  })

await artifactOne.save()

//build order with artifact
const userOne = global.signin()
const userTwo = global.signin()
const {body: order} = await request(app)
  .post('/api/orders')
  .set('Cookie', userOne)
  .send({artifactId: artifactOne.id})
  .expect(201)

//fetch the order
const {body: fetchorder} = await request(app)
  .get(`/api/orders/${order.id}`)
  .set('Cookie', userTwo)
  .send()
  .expect(401)



})
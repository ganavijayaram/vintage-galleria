import request from 'supertest'

import { app } from '../../app'
import { Order } from '../../models/orders'
import { Artifact } from '../../models/artifact'


const buildAtrifact = async () => {
  const artifact = Artifact.build({
    title: 'Vase',
    price: 200
  })

  await artifact.save()

  return artifact
}


it('Fetches user for a particular user', async () => {
  // create 3 artifacts
  const artifactOne = await buildAtrifact()
  const artifactTwo = await buildAtrifact()
  const artifactThree = await buildAtrifact()

  // create 1 order as user #1
  const userOne = global.signin()

  const {body: orderOne} = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({artifactId: artifactOne.id})
    .expect(201)

  // create 2 orders as user #2
  const userTwo = global.signin()

  const {body: orderTwo} = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({artifactId: artifactTwo.id})
    .expect(201)

  // we are getting only the body of the reponse and renaming it to orderThree
  const {body: orderThree} = await request(app)
  .post('/api/orders')
  .set('Cookie', userTwo)
  .send({artifactId: artifactThree.id})
  .expect(201)


  // make request to get orders for user #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200)

  // make sure  we get orders of user #2
  expect(response.body.length).toEqual(2)
  expect(response.body[0].id).toEqual(orderTwo.id)
  expect(response.body[1].id).toEqual(orderThree.id)
  expect(response.body[0].artifact.id).toEqual(artifactTwo.id)
  expect(response.body[1].artifact.id).toEqual(artifactThree.id)
})

it('', async () => {
  
})
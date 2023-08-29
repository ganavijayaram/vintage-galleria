import request from 'supertest'
import {app} from '../../app'
import { Artifact } from '../../models/artifact'
import { natsWrapper } from '../../nats-wrapper'

it('Has a route handler to listen to /api/artifacts for post request',async () => {
  const response = await request(app)
    .post('/api/artifacts')
    .send({})

    /// because in app, we ahve defined saying if we get requests to route which are not defined, we will throw error
    //404. so which means w should have a oruter handler and which evetuall return 200 or 400 but not 404
    expect(response.status).not.toEqual(404)

})

it('can be accessed only if user is signed in else return 401',async () => {
  const response = await request(app)
    .post('/api/artifacts')
    .send({}) // here we are not sending any signed in info like cookies or anything

    // in our custom not-authorised handler we send 401 when user is not authorised to access something, when
    // he is not signed in or when he is not allowed to access a particular page
    expect(response.statusCode).toEqual(401)
  
})

it('returns other than 401 when user is signed in',async () => {
  const response = await request(app)
    .post('/api/artifacts')
    .set('Cookie', global.signin())
    .send({}) // sending some authentication

   
    expect(response.statusCode).not.toEqual(401)
  
})

it('returns error if invalid title is provided',async () => {

   await request(app)
    .post('/api/artifacts')
    .set('Cookie', global.signin())
    .send({
      title: '', // sending empty email
      price: 10
    })
    .expect(400)

    await request(app)
    .post('/api/artifacts')
    .set('Cookie', global.signin())
    .send({
      //not sending the email at all
      price: 10
    })
    .expect(400)
  
})

it('returns error if invalid price is provided',async () => {
  await request(app)
    .post('/api/artifacts')
    .set('Cookie', global.signin())
    .send({
      title: 'abcd', // sending empty email
      price: -10
    })
    .expect(400)

    await request(app)
    .post('/api/artifacts')
    .set('Cookie', global.signin())
    .send({
      //not sending the email at all
      title: 'abcd'
    })
    .expect(400)
  
  
})

it('Creates an artificate with valid inputs',async () => {
  // Here we are also checking if the artifact was saved in to our database
  let artifacts =  await Artifact.find({})
  // before each test we make sure to clear the data in the mongo db, hence this should return 0
  expect(artifacts.length).toEqual(0)

  const price = 10
  const title = 'abcd'

  await request(app)
  .post('/api/artifacts')
  .set('Cookie', global.signin())
  .send({
    title: title,
    price: price
  })
  .expect(201)

  artifacts =  await Artifact.find({})
  //now the the number of records should increase by 1
  expect(artifacts.length).toEqual(1)
  expect(artifacts[0].price).toEqual(price)
  expect(artifacts[0].title).toEqual(title)
})

it('publishes an event', async() => {
  const price = 10
  const title = 'abcd'

  await request(app)
  .post('/api/artifacts')
  .set('Cookie', global.signin())
  .send({
    title: title,
    price: price
  })
  .expect(201)

expect(natsWrapper.client.publish).toHaveBeenCalled()
})
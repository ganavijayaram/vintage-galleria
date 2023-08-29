import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { response } from 'express'
import { natsWrapper } from '../../nats-wrapper'

it('returns 404 if given ID does not exist', async() => {

  //Generating valid mongoose db ID
  const id = new mongoose.Types.ObjectId().toHexString()

  await request(app)
  .put(`/api/artifacts/${id}`)
  .set('Cookie', global.signin())
  .send({
    title: 'abcd',
    price: 23
  })
  .expect(404)
})

it('returns 401 if user not authenticated', async() => {

     //Generating valid mongoose db ID
  const id = new mongoose.Types.ObjectId().toHexString()

  await request(app)
  .put(`/api/artifacts/${id}`)
  .send({
    title: 'abcd',
    price: 22
  })
  .expect(401)
  
})

it('returns 401 if user does not own the artifact', async() => {
  
  //Generating valid mongoose db ID
  const id = new mongoose.Types.ObjectId().toHexString()

  const response = await request(app)
  .post(`/api/artifacts`)
  .set('Cookie', global.signin())
  .send({
    title: 'abcd',
    price: 21
  })
  

  await request(app)
    .put(`/api/artifacts/${response.body.id}`)
    .set('Cookie', global.signin()) //here were getting the cookie with a different id, which is what we need for this test
    .send({
      title: 'abcd1',
      price: 100
    })
    .expect(401)

})

it('returns 400 if invalid title or price', async() => {

  const cookie = global.signin()

  const response = await request(app)
    .post(`/api/artifacts`)
    .set('Cookie', cookie)
    .send({
      title: 'abcd',
      price: 24
    })
  
    await request(app)
    .put(`/api/artifacts/${response.body.id}`)
    .set('Cookie', cookie) //here were using the cookie of the user who created hte artifact
    .send({
      title: '',
      price: 1001
    })
    .expect(400)

    await request(app)
    .put(`/api/artifacts/${response.body.id}`)
    .set('Cookie', cookie) //here were using the cookie of the user who created hte artifact
    .send({
      title: 'abcd',
      price: -10
    })
    .expect(400)

  
})

it('returns 200 Updates ticket when valid inputs are given', async() => {
  
  const cookie = global.signin()

  const response = await request(app)
    .post('/api/artifacts')
    .set('Cookie', cookie)
    .send({
      title: 'abcd',
      price: 26
    })
    

    await request(app)
    .put(`/api/artifacts/${response.body.id}`)
    .set('Cookie', cookie) //here were using the cookie of the user who created hte artifact
    .send({
      title: 'abcd',
      price: 1002
    })
    .expect(200)

    const artifactResponse = await request(app)
      .get(`/api/artifacts/${response.body.id}`)
      .send()

    expect(artifactResponse.body.title).toEqual('abcd')
    expect(artifactResponse.body.price).toEqual(1002)

})

it('publishes an event', async() => {
  const cookie = global.signin()

  const response = await request(app)
    .post('/api/artifacts')
    .set('Cookie', cookie)
    .send({
      title: 'abcd',
      price: 26
    })
    

    await request(app)
    .put(`/api/artifacts/${response.body.id}`)
    .set('Cookie', cookie) //here were using the cookie of the user who created hte artifact
    .send({
      title: 'abcd',
      price: 1002
    })
    .expect(200)
expect(natsWrapper.client.publish).toHaveBeenCalled()
})
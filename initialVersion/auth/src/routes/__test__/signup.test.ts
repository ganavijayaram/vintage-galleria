// Supertest is the one which helps us to fake request to our application
import { response } from 'express'
import request from 'supertest'
import { app } from '../../app'

//description and then callback function
it('returns 201 on successful signup', async() => {
  return request(app)
    //method and URL
    .post('/api/users/signup')
    // body of the request
    .send({
      email: 'ganavi1@gmail.com',
      password: 'ganavi1'
    })
    // what to expect from the route
    .expect(201)
})

it('returns a 400 with an invalid email', async() => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'ganavi1',
      password: 'ganavi1'
    })
    .expect(400)
})

it('returns a 400 with an missing email', async() => {
  return request(app)
    .post('/api/users/signup')
    .send({
      password: 'ganavi1'
    })
    .expect(400)
})

it('returns a 400 with an missing password', async() => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'ganavi1',
    })
    .expect(400)
})

it('returns a 400 with an invalidpassword', async() => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'ganavi1',
      password: '1'
    })
    .expect(400)
})

it('returns a 400 with an duplicate emails', async() => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'ganavi1@gmail.com',
      password: 'ganavi1'
    })
    .expect(201)

    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'ganavi1@gmail.com',
        password: 'ganavi1'
      })
      .expect(400)
})


it('sets cookie after successful signup', async() => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'ganavi1@gmail.com',
      password: 'ganavi1'
    })
    .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined()
  })
import { response } from "express";
import request from "supertest";
import { app } from "../../app";

it('fails when non exisitng email is entered', async() => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: "ganavi1@gmail.com",
      password: 'ganavi1'
    })
    .expect(400)
})

it('fails when incorrect password is entered', async() => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "ganavi1@gmail.com",
      password: 'ganavi1'
    })
    .expect(201)

  await request(app)
    .post('/api/users/signin')
    .send({
      email: "ganavi1@gmail.com",
      password: 'ganavi'
    })
    .expect(400)
})


it('Responds with cookie when Successful signin', async() => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "ganavi1@gmail.com",
      password: 'ganavi1'
    })
    .expect(201)

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: "ganavi1@gmail.com",
      password: 'ganavi1'
    })
    .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined()
})
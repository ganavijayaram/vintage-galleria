import { response } from "express";
import request from "supertest";
import { app } from "../../app";


it('Responds with details of the current user', async() => {
  const signupResponse  = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'ganavi1@gmail.com',
      password: 'ganavi1'
    })
    .expect(201)

    const cookie = signupResponse.get('Set-Cookie')

    
    const response = await request(app)
    .get('/api/users/currentuser')
    // cookie will not be included in the follow up request as how it used to happen 
    // when requests were made with browser and postman
    .set('Cookie', cookie)
    .send()
    .expect(200)

    console.log(response.body, cookie)

   expect(response.body.currentUser.email).toEqual('ganavi1@gmail.com')

})
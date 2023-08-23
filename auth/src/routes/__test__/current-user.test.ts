import { awaitExpression } from "@babel/types";
import { response } from "express";
import request from "supertest";
import { app } from "../../app";


it('Responds with details of the current user', async() => {
  
    const cookie = await global.signin()

    const response = await request(app)
    .get('/api/users/currentuser')
    // cookie will not be included in the follow up request as how it used to happen 
    // when requests were made with browser and postman
    .set('Cookie', cookie)
    .send()
    .expect(200)


   expect(response.body.currentUser.email).toEqual('ganavi1@gmail.com')

})

it('Responds with null if not authenticated', async() => {
  
  const cookie = await global.signin() 

  const response = await request(app)
  .get('/api/users/currentuser')
  // cookie will not be included in the follow up request as how it used to happen 
  // when requests were made with browser and postman
  .send()
  .expect(401) //CHECK THIS


 expect(response.body.currentUser).toEqual(undefined)

})
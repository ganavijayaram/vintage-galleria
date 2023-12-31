import request from "supertest";
import { app } from "../../app";

it('clears cookie after signout', async() => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'ganavi1@gmail.com',
      password: 'ganavi1'
    })
    .expect(201)

    const response = await request(app)
      .post('/api/users/signout')
      .send({}) // beacuse post
      .expect(200)

      //console.log(response.get('Set-Cookie'))
      expect(response.get('Set-Cookie')[0]).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly')
})
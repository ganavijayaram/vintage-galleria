import request from 'supertest'
import {app} from '../../app'
import mongoose from 'mongoose'

it('returns artifact is found', async() => {

  const price = 10
  const title = "abcd"

  //sending the post
  const response = await request(app)
  .post('/api/artifacts')
  .set('Cookie', global.signin())
  .send({
    title,
   price
  })
  .expect(201)

// getting the post
const artifactResponse = await request(app)
.get(`/api/artifacts/${response.body.id}`)
.send()
.expect(200)

expect(artifactResponse.body.title).toEqual(title)
expect(artifactResponse.body.price).toEqual(price)
  
})


it('returns 404 if artifact is not found', async() => {
  
  //to generate valid mongoose id
  const id = new mongoose.Types.ObjectId().toHexString()

  const response = await request(app)
  .get(`/api/artifacts/${id}`)
  //.set('Cookie')
  .send()
  .expect(404)

})


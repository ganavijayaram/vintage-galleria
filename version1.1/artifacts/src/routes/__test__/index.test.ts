// To get all the artifacts
import request from "supertest";
import { app } from "../../app";


const createArtifact = () => {
   return request(app)
    .post('/api/artifacts')
    .set('Cookie', global.signin())
    .send({
      title: "abcd",
      price: 10
    })
    
}

it('fetch all artifacts', async() => {
  
await createArtifact()
await createArtifact()
await createArtifact()

const reponse = await request(app)
.get('/api/artifacts')
.send()
.expect(200)
    
expect(reponse.body.length).toEqual(3)
})
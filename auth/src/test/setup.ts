import request  from 'supertest'
import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'

declare global {
  var  signin: () => Promise<string[]>
}


let mongo: any
//perform this before runnning any of the test cases
beforeAll(async() => {
  // since we are defining the env in the pods, and now running our test on our local setup, we dont have access
  // to the env variables, and hence we are definig it here
  process.env.JWT_KEY = 'abcd'
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri, {})

})

//peform this before each of the test cases
beforeEach(async() => {
  //get all the connections of the mongoose
  const collections = await mongoose.connection.db.collections()

   //delete all the mongoose collections(data)
  for(let collection of collections) {
    await collection.deleteMany({})
  }
})

//this is to close all the connections
afterAll(async() => {
  if(mongo) {
    await mongo.stop()
  }
  await mongoose.connection.close()
})

global.signin = async() => {
  const email = 'ganavi1@gmail.com'
  const password = 'ganavi1'

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email, password
    })
    .expect(201)

    const cookie = response.get('Set-Cookie')

    return cookie
}


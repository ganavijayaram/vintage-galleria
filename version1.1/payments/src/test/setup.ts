import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken'


//Custom imports
import { app } from '../app';


declare global {
  var signin: (id?: string) => string[];
}

//when something is importing this file, it will use the mocks
jest.mock('../nats-wrapper')

process.env.STRIPE_KEY = 'sk_test_51NnPo9FSBDqb54pe7UKjODsCMVZozOLg0WfBPfoDai7IcQfh7BpysHK2qnkE1ovlZkOYyFBTNwCjtdw0aK85mrTz00s7ercgTi'



let mongo: any;
beforeAll(async () => {
  jest.clearAllMocks()
  process.env.JWT_KEY = 'abcd';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  //here we are trying to create our own session to fake authentication


  // Step 1: Building our JWT payload {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'ganavi@gmail.com'
  }


  // Step 2: create MY_JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)


  // Step 3: Build session objecrt {jwt: MY_JWT}
  const session = {jwt: token}

  // Step 4: Turn that session into JSON
  const sessionJSON = JSON.stringify(session)

  // Step 5: encode the json as base62
  const base64 = Buffer.from(sessionJSON).toString('base64')

  // Step 6: return string with encoded session
  return [`session=${base64}`];

};

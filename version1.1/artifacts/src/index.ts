import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';

import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    // the url is the address of the NATS SERVER
    // in our case it is the 
    await natsWrapper.connect('vintagegalleria', 'abcdef', 'http://nats-srv:4222')

    //Grafully shutting down 
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed')
      process.exit()
    })

    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    await mongoose.connect(process.env.MONGO_URI);

    console.log('Artifact: Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Artifact: Listening on port 3000!');
  });
};

start();

import Queue from 'bull'
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher'
import { natsWrapper } from '../nats-wrapper'

// properties which needs to be present inside the job
interface Payload {
  orderId: string
}

//first: name of the channel where we are sending the jobs
// second: options for connecting to the Redis server
const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    // contains the expiration-redis-srv the redis we want to connect to
    host: process.env.REDIS_HOST
  }
})

// Processing the job recevied by the Redis DB
// here we are going to publish an expiration complete event 
expirationQueue.process(async(job) => {
    console.log('publishing the expiration complete event  for orderId: ', job.data.orderId)
    await new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
    })
})

export { expirationQueue } 
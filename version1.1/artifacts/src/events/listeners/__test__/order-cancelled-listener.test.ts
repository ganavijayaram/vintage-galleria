import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from "@vintagegalleria/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Artifact } from "../../../models/artifact"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { OrderCreatedListener } from "../order-created-listener"

const setup = async () => {
  // Create instance of client
  const listener = new OrderCancelledListener(natsWrapper.client)

  // Create and save the artifact
  // cannot have orderId while cretaing artifact
  const artifact = Artifact.build({
    title: 'Vase',
    price: 200,
    userId: 'abcdef'
  })
  const orderId = new mongoose.Types.ObjectId().toHexString()
  artifact.set({orderId})

  await artifact.save()

  // create fake data
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    artifact: {
      id: artifact.id,
    }
  }

  // create fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  //return
  return { msg, data, artifact, listener, orderId}
}

it('Updates, publishes and acks', async () => {
  const { msg, data, artifact, listener, orderId} = await setup()

  await listener.onMessage(data, msg)

  const updatedArtifact = await Artifact.findById(artifact.id)

  expect(updatedArtifact!.orderId).toEqual(undefined)
  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})


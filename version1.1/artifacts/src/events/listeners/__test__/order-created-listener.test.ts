import { OrderCreatedEvent, OrderStatus } from "@vintagegalleria/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Artifact } from "../../../models/artifact"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"

const setup = async () => {
  // Create instance of client
  const listener = new OrderCreatedListener(natsWrapper.client)

  // Create and save the artifact
  const artifact = Artifact.build({
    title: 'Vase',
    price: 200,
    userId: 'abcdef'
  })
  await artifact.save()

  // create fake data
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: 'abcd',
    artifact: {
      id: artifact.id,
      price: artifact.price
    }
  }

  // create fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  //return
  return { msg, data, artifact, listener }
}

it('Sets the userId of the artifact', async () => {
  const { msg, data, artifact, listener } = await setup()

  await listener.onMessage(data, msg)

  const updatedArtifact = await Artifact.findById(artifact.id)

  expect(updatedArtifact!.orderId).toEqual(data.id)
})

it('acks the message', async () => {
  const { msg, data, artifact, listener } = await setup()

  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()

})

it('publishes an artifact updated event', async () => {
  const { msg, data, artifact, listener } = await setup()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

 const artifactUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[2][1])

 expect(data.id).toEqual(artifactUpdatedData.orderId)
  
})
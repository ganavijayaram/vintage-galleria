import { ArtifactCreatedEvent } from "@vintagegalleria/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Artifact } from "../../../models/artifact"
import { natsWrapper } from "../../../nats-wrapper"
import { ArtifactCreatedListener } from "../artifact-created-listener"

const setup = async () => {
  // create instance of listener
  const listener = new ArtifactCreatedListener(natsWrapper.client)

  // create fake event
  const data: ArtifactCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'vase',
    price: 200,
    userId: new mongoose.Types.ObjectId().toHexString()
  }

  // create fake msg
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener, data, msg}

}

it('creates and saves artifact', async () => {
  const {listener, data, msg} = await setup()
   // call onMessage with sake event and afke msg
   await listener.onMessage(data, msg)

  // assertions to make sure artiafct was created
  const artifact = await Artifact.findById(data.id)

  expect(artifact).toBeDefined()
  expect(artifact!.title).toEqual(data.title)
  expect(artifact!.price).toEqual(data.price)
})

it('acks the message', async () => {
  const {listener, data, msg} = await setup()
  // call onMessage with sake event and afke msg
  await listener.onMessage(data, msg)

  // assertions to make ack() to eb called
  expect(msg.ack).toHaveBeenCalled()
})



import { ArtifactUpdatedEvent } from "@vintagegalleria/common"
import mongoose from "mongoose"
import { Artifact } from "../../../models/artifact"
import { natsWrapper } from "../../../nats-wrapper"
import { ArtifactUpdatedListner } from "../artifact-updated-listener"

const setup = async () => {
  // create instance of listener
  const listener = new ArtifactUpdatedListner(natsWrapper.client)

  //cretae and save artifact
  const artifact = Artifact.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'vase',
    price: 200,
  })

  await artifact.save()

  // create fake event
  const data: ArtifactUpdatedEvent['data'] = {
    id: artifact.id,
    version: artifact.version + 1,
    title: 'new vase',
    price: 2001,
    userId: new mongoose.Types.ObjectId().toHexString()
  }

  // create fake msg
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener, data, msg, artifact}

}

it('finds updates and saves artifact', async () => {
  const {listener, data, msg, artifact} = await setup()
   // call onMessage with sake event and afke msg
   await listener.onMessage(data, msg)

  // assertions to make sure artiafct was created
  const updatedArtifact = await Artifact.findById(artifact.id)

  
  expect(updatedArtifact!.title).toEqual(data.title)
  expect(updatedArtifact!.price).toEqual(data.price)
  expect(updatedArtifact!.version).toEqual(data.version)
})

it('acks the message', async () => {
  const {listener, data, msg, artifact} = await setup()
  // call onMessage with sake event and afke msg
  await listener.onMessage(data, msg)

  // assertions to make ack() to eb called
  expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack for out of order event', async() => {
  const {listener, data, msg, artifact} = await setup()
  //making the event out of order
  data.version = 10
  try {
  // call onMessage with sake event and afke msg
  await listener.onMessage(data, msg)
  }
  catch(err) {

  }
  // assertions to make ack() to eb called
  expect(msg.ack).not.toHaveBeenCalled()
})
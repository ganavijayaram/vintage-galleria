import { ExpirationCompleteEvent } from "@vintagegalleria/common"
import mongoose from "mongoose"
import { Artifact } from "../../../models/artifact"
import { Order, OrderStatus } from "../../../models/orders"
import { natsWrapper } from "../../../nats-wrapper"
import { ExpirationCompleteListener } from "../expiration-complete-listener"

const setup = async() => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const artifact = Artifact.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Vase',
    price: 200
  })

  await artifact.save()

  const order = Order.build({
    userId: 'abcd',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    artifact: artifact.id
  })

  await order.save()

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {artifact, order, data, msg, listener}
}
it('updates the order status to cancelled', async () => {
  const {artifact, order, data, msg, listener} = await setup()
  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('Order Cancelled', async () => {
  const {artifact, order, data, msg, listener} = await setup()
  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  console.log((natsWrapper.client.publish as jest.Mock).mock.calls[1][1])

  //const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[2][1])

  

  //expect(eventData.id).toEqual(order.id)
})

it('ack the message', async () => {
  const {artifact, order, data, msg, listener} = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()

})
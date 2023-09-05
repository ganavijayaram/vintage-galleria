import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@vintagegalleria/common";
import { Message } from "node-nats-streaming";
import {queueGroupName} from './queue-group-name'
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName =  queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // When we receive an order-created event from the order service
    // we will queue the job int the redis server
    await expirationQueue.add({
      orderId: data.id
    })

    //sending ack
    msg.ack()
  }
}
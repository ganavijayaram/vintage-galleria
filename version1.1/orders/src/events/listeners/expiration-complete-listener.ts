import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from "@vintagegalleria/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { queueGroupName } from "./queue-group-name";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
  queueGroupName = queueGroupName;
  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
      // Get the order
      const order = await Order.findById(data.orderId).populate('artifact')

      if(!order) {
        throw new Error('Order not Found')
      }

      // After receiveing the event, we will change the order status as cancelled
      order.set({
        status: OrderStatus.Cancelled
        // because then later for all the cancelled orders we wont know what artiafct was assocuited with it
        // also in our order, we know if the order is in cancelled state then it means the artifact is not reserved
        // artifact: null 
      })

      await order.save()

      //console.log('DATTTAAA ', order.artifact.id, data.orderId, order)

      // Once we cancel we need to publish it 
      await new OrderCancelledPublisher(this.client).publish({
        id: order.id,
        version: order.version,
        artifact: {
            id: order.artifact.id
        }
      })

      msg.ack()

  }
  
  
}
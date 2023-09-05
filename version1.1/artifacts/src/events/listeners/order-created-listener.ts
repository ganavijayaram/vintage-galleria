 import { Listener, OrderCreatedEvent, Subjects } from "@vintagegalleria/common";
import { Message } from "node-nats-streaming";
import { Artifact } from "../../models/artifact";
import { queueGroupName } from "./queue-group-name";


 export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
   subject: Subjects.OrderCreated = Subjects.OrderCreated
   queueGroupName = queueGroupName;
   async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
      // Find the artifact the order is reserving
      const artifact = await Artifact.findById(data.artifact.id)

      // If no artifact then throw error
      if(!artifact) {
        throw new Error('Artifact not found')
      }

      // Mark the artifact as reserved by setting its orderId property
      artifact.set({orderId: data.id})

      // Save the artifact
      await artifact.save()

      //Act the message
      msg.ack()
   }
  
 }
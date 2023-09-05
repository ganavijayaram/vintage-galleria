 import { Listener, OrderCreatedEvent, Subjects } from "@vintagegalleria/common";
import { Message } from "node-nats-streaming";
import { Artifact } from "../../models/artifact";
import { ArtifactUpdatedPublisher } from "../publishers/artifact-updated-publisher";
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
      // here we are updating the artifact and hence we need to send Artifact-upadted event
      artifact.set({orderId: data.id})

      // Save the artifact
      await artifact.save()

      await new ArtifactUpdatedPublisher(this.client).publish({
        id: artifact.id,
        version: artifact.version,
        title: artifact.title,
        price: artifact.price,
        userId: artifact.userId,
        orderId: artifact.orderId
      })

      //Act the message
      msg.ack()
   }
  
 }
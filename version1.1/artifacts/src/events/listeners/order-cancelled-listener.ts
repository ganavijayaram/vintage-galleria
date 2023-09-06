import { Listener, OrderCancelledEvent, Subjects } from "@vintagegalleria/common";
import { Message } from "node-nats-streaming";
import { Artifact } from "../../models/artifact";
import { ArtifactUpdatedPublisher } from "../publishers/artifact-updated-publisher";
import { queueGroupName } from "./queue-group-name";


 export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
   subject: Subjects.OrderCancelled = Subjects.OrderCancelled
   queueGroupName = queueGroupName;
   async onMessage(data: OrderCancelledEvent['data'], msg: Message) {

    //console.log('DATAAAA ', data)

    const artifact = await Artifact.findById(data.artifact.id)
    //console.log('DATAAAA data and artifact', data, artifact)

    if(!artifact) {
      throw new Error('Artifact Not found')
    }

    // We are udpating the artifact and hence we have to publish the event
    artifact.set({orderId: undefined})

    await artifact.save()

    await new ArtifactUpdatedPublisher(this.client).publish({
      id: artifact.id,
      version: artifact.version,
      title: artifact.title,
      price: artifact.price,
      userId: artifact.userId,
      orderId: artifact.orderId
    })



    msg.ack()
   }
  
 }
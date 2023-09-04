import { Message } from "node-nats-streaming";

//Custom imports
import { Subjects, Listener, ArtifactCreatedEvent } from "@vintagegalleria/common";
import { Artifact } from "../../models/artifact";
import { queueGroupName } from "./queue-group-name";


export class ArtifactCreatedListener extends Listener<ArtifactCreatedEvent> {
  subject: Subjects.ArtifactCreated = Subjects.ArtifactCreated;
  queueGroupName =  queueGroupName;
  async onMessage(data: ArtifactCreatedEvent['data'], msg: Message) {
    const {id, title, price} = data
    const artifact = Artifact.build({
      id,
      title, 
      price
    })
    await artifact.save()
    msg.ack()
  }
}
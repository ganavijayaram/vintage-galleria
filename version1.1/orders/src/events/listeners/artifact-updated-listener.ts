import { Message } from "node-nats-streaming";

import { Subjects, Listener, ArtifactUpdatedEvent } from "@vintagegalleria/common";
import { Artifact } from "../../models/artifact";
import { queueGroupName } from "./queue-group-name";


export class ArtifactUpdatedListner extends Listener<ArtifactUpdatedEvent> {
  subject: Subjects.ArtifactUpdated = Subjects.ArtifactUpdated;
  queueGroupName = queueGroupName
  async onMessage(data: ArtifactUpdatedEvent['data'], msg: Message) {
      const {id, title, price, userId }  = data
      const artifact = await Artifact.findById(id)

      if(!artifact) {
        throw new Error('Artifact Not found')
      }
       
      artifact.set({title, price})
      await artifact.save()

      msg.ack()

  }
  
  
}
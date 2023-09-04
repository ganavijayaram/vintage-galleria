import { Message } from "node-nats-streaming";

import { Subjects, Listener, ArtifactUpdatedEvent } from "@vintagegalleria/common";
import { Artifact } from "../../models/artifact";
import { queueGroupName } from "./queue-group-name";


export class ArtifactUpdatedListner extends Listener<ArtifactUpdatedEvent> {
  subject: Subjects.ArtifactUpdated = Subjects.ArtifactUpdated;
  queueGroupName = queueGroupName
  async onMessage(data: ArtifactUpdatedEvent['data'], msg: Message) {
      const {id, title, price, userId }  = data

      // After inclduing the version field, we wil update only 
      // those records whose version number is 1 less than the current version
      const artifact = await Artifact.findOne({
        _id: data.id,
        version: data.version - 1
      })

      // after adidng version and we do not find the artiafct above, 
      // it now means we are processing the event out of order
      if(!artifact) {
        throw new Error('Artifact Not found')
      }
       
      artifact.set({title, price})
      await artifact.save()

      msg.ack()

  }
  
  
}
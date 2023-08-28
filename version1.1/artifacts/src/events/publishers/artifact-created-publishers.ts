import { Publisher, Subjects, ArtifactCreatedEvent } from "@vintagegalleria/common";

export class ArtifactCreatedPublisher extends Publisher<ArtifactCreatedEvent> {
  // we have to assign the type and the value beacuse we should never be able to change subject in the future
  subject: Subjects.ArtifactCreated = Subjects.ArtifactCreated;
  

}
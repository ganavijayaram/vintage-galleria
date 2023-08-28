import { ArtifactUpdatedEvent, Publisher, Subjects } from "@vintagegalleria/common";



export class ArtifactUpdatedPublisher extends Publisher<ArtifactUpdatedEvent> {
  subject: Subjects.ArtifactUpdated = Subjects.ArtifactUpdated;

}
import { ExpirationCompleteEvent, Publisher, Subjects } from "@vintagegalleria/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
  
}
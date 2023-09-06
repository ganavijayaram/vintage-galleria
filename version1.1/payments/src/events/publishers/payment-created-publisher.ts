import { PaymentCreatedEvent, Publisher, Subjects } from "@vintagegalleria/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
  
}
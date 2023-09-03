import { Publisher, OrderCreatedEvent, Subjects } from "@vintagegalleria/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}
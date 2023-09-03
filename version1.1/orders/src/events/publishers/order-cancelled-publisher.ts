import { Subjects, Publisher, OrderCancelledEvent } from "@vintagegalleria/common";

export class OrderCreatedPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
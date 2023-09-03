import { Subjects, Publisher, OrderCancelledEvent } from "@vintagegalleria/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
import { Listener, OrderCancelledEvent, Subjects } from "@vintagegalleria/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";


 export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
   subject: Subjects.OrderCancelled = Subjects.OrderCancelled
   queueGroupName = queueGroupName;
   onMessage(data: OrderCancelledEvent['data'], msg: Message) {

   }
  
 }
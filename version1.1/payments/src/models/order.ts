import { OrderStatus } from "@vintagegalleria/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// attributes while building the order
interface OrderAttrs {
  id: number
  status: OrderStatus
  version: number
  userId: string
  price: number
}

// Attributes which are the order has (mongo might had additional properties)
interface OrderDoc extends mongoose.Document {
 // no id, id is used only while building the order 
 // Document will already have id
  status: OrderStatus
  version: number
  userId: string
  price: number
}

// Properties the model has, like cutom methods
// in our case we have custom build method to build the 
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}


const orderSchema  = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    // double checking that values for status has to be from the OrderStatus
    enum: Object.values(OrderStatus),
  },
}, 
// sometime we might want to send this to other services
// and that time it is sent as a string 
// and when the JS does it automatically it will have ._id
// so we say, when you do JSON parse, we will chane ._id to .id
{
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

// to make version as the default versionKey and not the __v
orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status
  })
}
const Order = mongoose.model<OrderDoc, OrderModel>('Order',orderSchema)

export {Order}
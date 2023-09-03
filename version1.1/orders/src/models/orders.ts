import mongoose from 'mongoose'
import {OrderStatus} from '@vintagegalleria/common'

// properties which are needed to create an order
interface orderAttrs {
  userId: string // this is TS 
  status: OrderStatus
  expiresAt: Date
  artifact: ArtifactDoc
}

//properties which are end up in an order
// sometimes we will have mongoose put additional properties apart fro the one what we use for creating an order
interface orderDoc extends mongoose.Document{
    userId: string
    status: OrderStatus
    expiresAt: Date
    artifact: ArtifactDoc
}

interface orderModel extends mongoose.Model<orderDoc> {
  // takes orderAttrs and gives of type orderDoc
  build(attrs: orderAttrs): orderDoc

}


const orderSchema =  new mongoose.Schema({
  userId: {
    type: String, // this is JS datatype
    required: true
  },
  status: {
    type: String,
    required: true,
    // double checking that values for status has to be from the OrderStatus
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date
  },
  artifact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artifact'
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

orderSchema.statics.build = (attrs: orderAttrs) => {
  return new Order(attrs)
}

const Order = mongoose.model<orderDoc, orderModel>('Order', orderSchema)

export {Order}
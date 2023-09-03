// This is a model file for artifact which is associated with order

// we migth want to abstract data from the artifact model in the artifact folder and this folder
// but we should not be doing this, because this model here is only 
// for the order service to work with not for the artifact service
import mongoose from "mongoose";

// what attributes are given by the user while building
interface ArtifactAttrs {
  title: string
  price: number

}

// ArtifactAttrs + extra attributes added by mongo
export interface ArtifactDoc extends mongoose.Document {
  title: string
  price: number

}

interface ArtifactModel extends mongoose.Model<ArtifactDoc> {
  build(attrs: ArtifactAttrs): ArtifactDoc
}

const artifactSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    // Giving a minimum value for the price
    min: 0
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

artifactSchema.statics.build = (attrs: ArtifactAttrs) => {
  return new Artifact(attrs)
}

const Artifact =  mongoose.model<ArtifactDoc, ArtifactModel>('Artifact', artifactSchema)

export {Artifact}


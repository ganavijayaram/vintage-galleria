import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

//Attributes is what is neeed to build a new artifact
interface ArtifactAttrs {
  title: string //This is TS datatype
  price: number
  userId: string

}

//Doc will contain what is used to while creating new artifact
// (i.e all the fields from the attributes + additional fields automatically created by mongoose)
interface ArtifactDoc extends mongoose.Document{
  title: string  //This is TS datatype
  price: number
  userId: string
  // Doc contains extra arguments like __v, __id those which are not defined in the attributes
  // since we are telling that we are using version instead of __v for the version optimistic concurrency 
  // we need to add version here
  version: number
  // ? means optional, when we create an artifact, orderId is not necessary
  orderId?: string
}

interface ArtifactModel extends mongoose.Model<ArtifactDoc>{
  //We are creating this build method to make it easy to create artiafct
  //take attributes type parameter
  // returns ArtifactDoc
  build(attrs: ArtifactAttrs): ArtifactDoc
}


// Schema takes 2 parameters
//
const artifactSchema = new mongoose.Schema({
  title: {
    type: String, //This is by JS for the mongoose
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  orderId: {
    type: String
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
      
    }
  }
})

// Using the version field instead default __v for versioning for optimistic concurrency control
artifactSchema.set('versionKey', 'version')
artifactSchema.plugin(updateIfCurrentPlugin)

artifactSchema.statics.build = (attrs: ArtifactAttrs) => {
  return new Artifact(attrs)
}

const Artifact =  mongoose.model<ArtifactDoc, ArtifactModel> ('Artifact', artifactSchema)

export {Artifact}
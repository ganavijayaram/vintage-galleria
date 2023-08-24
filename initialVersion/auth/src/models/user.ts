import mongoose from "mongoose";
import { Password } from "../services/password";

//interface to describe the properties of the user
interface UserAttrs {
  email: string
  password: string
}

//schema is a way to tell all the different properties users is going to have while creating
const userSchema = new mongoose.Schema({
  email: {
    type: String, //This is not TypeScript type, it is JS type
    required: true
  },
  password: {
    type: String,
    required: true
  }
},
{
  password: {
    type: String,
    required: true
  },
  //turning the object into json of our way 
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.password
      delete ret.__v;
    }
  }
})

//before saving, we will be performing this function
//this is a middleware
userSchema.pre('save', async function(done) {
  if(this.isModified()) {
    const hashedPassword = await Password.toHash(this.get('password'))
    this.set('password', hashedPassword)
  }
  done()
})

//email and password are additional properties to the properties 
// added by the mongoose (mongoose.Document)
//this is beasically the return type for the User
interface UserDoc extends mongoose.Document {
  email: string
  password: string
}


//fixing mongoose and typsscript compatiability issues by using the model
// telling what methods we ahve while creating the user
//rerurn type is  UserDoc
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}

//instead of using the buildUser, where we had to export builduser as well
//herebuild will be a method on User model, so we can call using user.build({})
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)
/*
//example where it works
const user = User.build({
  email: "",
  password: ""
})
*/
/*
This is the usual way of creating a new user
//but we are not following this beacuse it will not do type checking
new User ({
  email: '',
  pass: 21324
  fsdfsdadf:afsadfasd
})
Anything can be passed to the user moedl, typescipt will not throw error, 
because whatever type e give is only for mongo and TS does not check anythign here
it defies the whole purpose of using typescript
*/
//export const User = mongoose.model('User', userSchema)
//or

//This is a hack, which will make sure that the right attributes 
//name and types are passed while creating a new user

/*
Better approach in the beginning
const buildUser = (attrs: UserAttrs) => {
  new User(attrs)
}

This is the way we are going to call the buildUser to create new User, instead of calling the new User directly
buildUser ({
  email: "dfds",
  password: "sdfbdf",
  //sfb: jdsfj will throw error
})
*/
export {User}
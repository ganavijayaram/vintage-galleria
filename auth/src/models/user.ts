import mongoose from "mongoose";

//schema is a way to tell all the different properties users is going to have
const userSchema = new mongoose.Schema({
  email: {
    type: String, //This is not TypeScript type, it is JS type
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

const User = mongoose.model('User', userSchema)
//export const User = mongoose.model('User', userSchema)
//or
export {User}
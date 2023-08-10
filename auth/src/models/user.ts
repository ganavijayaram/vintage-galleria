import mongoose from "mongoose";

//interface to describe the properties of the user
interface UserAttrs {
  email: string
  password: string
}

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
const buildUser = (attrs: UserAttrs) => {
  new User(attrs)
}
/*
This is the way we are going to call the buildUser to create new User, instead of calling the new User directly
buildUser ({
  email: "dfds",
  password: "sdfbdf",
  //sfb: jdsfj will throw error
})
*/
export {User, buildUser}
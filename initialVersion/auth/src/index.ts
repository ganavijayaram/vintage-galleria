import mongoose from "mongoose";
import { app } from "./app";
// we are creating this fucntion asyn because, some versions of node require asynch function if you use await
const start = async () => {
  //
  if( !process.env.JWT_KEY) {
    throw new Error('JWT_KWY is not defined')
  }
  //await mongoose.connect('mongodb://localhost') --> if db was running on localmachine
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
  }
 
  catch {
    console.error('DB error')
  }
  //Listenig to port 
app.listen(3000, () => {
  console.log('Listening on port 3000!!!')
})
} 


start()
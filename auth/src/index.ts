import  express  from "express";
import { json } from "body-parser";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handling";

const app = express()
app.use(json())


app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)
//this has to be in the end, if there are any errors in the above routes,
// it will come down through the stack of middlewares and execute appropriately
app.use(errorHandler)


//Listenig to port 
app.listen(3000, () => {
  console.log('Listening on port 3000!!!')
})
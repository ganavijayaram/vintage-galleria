//This file to only configure the app, whereas index is to start the app


import  express  from "express";
import { json } from "body-parser";
//if we have any async, and there is an error in that function, we need ot use next.
//this next is express spcific, so in order to overcome this behaviour we have this module, which will let us use async without next
import 'express-async-errors'
// for our DB

//for managing and handling cookies
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handling";
import { NotFoundError } from "./errors/not-found-error";

const app = express()
app.use(json())
// to tell express that after https there is proxy which will send the request, and has to be treated as if it is secure
// beacuse by default express thinks the proxy requests are not on https
// there is browser -> https -> proxy -> express application 
app.set('trust proxy', true)
app.use(
  cookieSession({
    // sicne we are not encrypting our cookies
    signed: false,
    //to chek if connection is on HTTPS 
    secure: process.env.NODE_ENV !== 'test'
  })
)


app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)


//for all the routes which are not defines, we have defined custom not found error, which is then handled by the errorHandler
app.all('*', async () => {
  throw new NotFoundError()
})

//this has to be in the end, if there are any errors in the above routes,
// it will come down through the stack of middlewares and execute appropriately
app.use(errorHandler)

export {app}
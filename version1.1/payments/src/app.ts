import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@vintagegalleria/common'
import { createChargeRouter } from './routes/new';

//importing the middlewares/routers from our routes folder


const app = express();
app.set('trust proxy', true);
app.use(json());

// this is to set the req.session and has be set before currentUser middleware
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);


// Attaching the custom routes to the app

//before creating an artificat, we need to check if the user is authenticated
app.use(currentUser)
app.use(createChargeRouter)


app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };

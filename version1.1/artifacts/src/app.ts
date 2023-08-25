import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@vintagegalleria/common'

//importing the middlewares/routers from our routes folder
import { createArtifactRouter } from './routes/new';
import { showArtifactRouter } from './routes/show';
import { indexArtifactRouter } from './routes';
import { updateArtifactRouter } from './routes/update';

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
app.use(createArtifactRouter)
app.use(showArtifactRouter)
app.use(indexArtifactRouter)
app.use(updateArtifactRouter)


app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };

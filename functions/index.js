import { onRequest } from 'firebase-functions/v2/https';
import express from 'express';
import cors from 'cors';

import pictureRoute from './routes/pictureRoute.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/pictures', pictureRoute);

// app.listen(config.port, () =>
//   console.log(`Server is live @ ${config.hostUrl}`),
// );

export const api = onRequest(app);

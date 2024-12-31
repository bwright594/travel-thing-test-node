import express from 'express';
import cors from 'cors';

import config from './config.js';
import pictureRoute from './routes/pictureRoute.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', pictureRoute);

app.listen(config.port, () =>
  console.log(`Server is live @ ${config.hostUrl}`),
);

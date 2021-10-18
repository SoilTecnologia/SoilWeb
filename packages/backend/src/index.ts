import express from 'express';
import cors from 'cors';
import router from './routes/router';
import * as raspberry from './raspberry';

const PORT = 3308;
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.listen(PORT, () => {
  console.info(`Server Listening on PORT ${PORT}`);
});

raspberry.start();
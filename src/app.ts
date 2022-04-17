import express, { json } from 'express';
import "express-async-errors";
import cors from 'cors';
import "dotenv/config";
import router from './routes/index.js'
import errorHandler from './middlewares/errorHandler.js';

const app = express();
app.use(json());
app.use(cors());
app.use(errorHandler);
app.use(router);

app.listen(process.env.PORT, ()=> {
  console.log(`Server running on port ${process.env.PORT}`)
});

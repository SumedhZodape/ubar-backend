import express from 'express';
import captainRouter from './routers/captainRouter.js'


const app = express();

app.use(express.json());
app.use("/api/captain/", captainRouter)

//http://localhost:8000/api/captain/register

export default app;
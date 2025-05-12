import express from 'express';
import captainRouter from './routers/captainRouter.js';
import adminRouter from './routers/adminRouter.js'
import cors from 'cors';


const app = express();

app.use(cors())
app.use(express.json());
app.use("/api/captain/", captainRouter);
app.use("/api/admin/", adminRouter)

//http://localhost:8000/api/captain/register

export default app;
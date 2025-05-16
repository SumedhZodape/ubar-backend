import express from 'express';
import captainRouter from './routers/captainRouter.js';
import adminRouter from './routers/adminRouter.js';
import userRouter from './routers/userRouter.js'
import cors from 'cors';


const app = express();

app.use(cors())
app.use(express.json());
app.use("/api/captain/", captainRouter);
app.use("/api/admin/", adminRouter);
app.use("/api/user/", userRouter)

//http://localhost:8000/api/captain/register

export default app;
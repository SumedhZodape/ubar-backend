import express from 'express';
import captainRouter from './routers/captainRouter.js';
import adminRouter from './routers/adminRouter.js';
import userRouter from './routers/userRouter.js'
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import { connectDB } from './config/database.js';



const app = express();
const server = http.createServer(app);



export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
})
app.use(cors())
app.use(express.json());


export const connectedUser = new Map();

io.on('connection', (socket)=>{
    console.log(socket.id)

    socket.on('register', (userId) =>{
        connectedUser.set(userId, socket.id);
        console.log(`Registered user ${userId} with socket ID ${socket.id}`)
    })

    socket.on('disconnect', () =>{
        for(et [userId, id] of connectedUser.entries()){
            if(id == socket.id){
                connectedUser.delete(userId)
            }
        }
        console.log('Client disconnected:', socket.id)
    })

})


app.use("/api/captain/", captainRouter);
app.use("/api/admin/", adminRouter);
app.use("/api/user/", userRouter)

//http://localhost:8000/api/captain/register


await connectDB()
server.listen(8000, ()=>{
    console.log("SERVER RUNNING...")
})

// export default server;
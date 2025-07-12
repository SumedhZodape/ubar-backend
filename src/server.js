import server from './app.js';
import { connectDB } from './config/database.js';


const startServer = async() =>{
    try {
        await connectDB()
        server.listen(8000, ()=>{
            console.log("SERVER RUNNING...")
        })
    } catch (error) {
        console.log("ERROR")
    }
}

startServer()
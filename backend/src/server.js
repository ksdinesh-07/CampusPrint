import app from "./app.js";
import { connect_db } from "./config/db.js"; 
import dotenv from 'dotenv';

dotenv.config();

const PORT=process.env.PORT || 5000

const start_server=async()=>{
    try{
        await connect_db();
        app.listen(PORT,()=>{
            console.log(`server is running on thr port ${PORT}`)
        })
    }catch(err){
        console.log('failed to start the server',err)
    }
}


start_server();
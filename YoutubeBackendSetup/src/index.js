// Appoeach 1 by index.js method which is a complete mess 


/*

import { connect } from "mongoose";

import mongoose from 'mongoose'
import { DB_NAME } from './constants';
import express from 'express'
const app=express()
// the semi-colon is for the syntax error purpose 
;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        // listener part
        app.on("error",(e)=>{
            console.log("ERR:",e);
            throw e            
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`);            
        })
    } catch (error) {
        console.error('Error:',error);
        throw error
    }
})()

*/

// Approach 2
// require('dotenv').config()
import dotenv from 'dotenv'
import connectDB from './db/index.js'
import { app } from './app.js'


dotenv.config({
    path:'./env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})









// connectDB()//it returns a promise
// .then(()=>{
//     app.listen(process.env.PORT || 6000,()=>{
//         console.log(`Server is running at port :${process.env.PORT}`);
//     })
//     app.on("error",(e)=>{
//     console.log("ERR:",e);
//     throw e            
//     })
// })
// .catch((e)=>{
//     console.log("MONGODB Connection Failed !! :",e);
//     throw e    
// })
import express from 'express'
import cors from 'cors'
// Cookies are small pieces of data that are stored on the client's browser.
/*
CORS(Cross-Origin Resource Sharing) is a middleware that allows your frontend application, 
which is hosted on a different domain or port, to make requests to your backend server. 
It's necessary to avoid browser security restrictions
`cookie-parser` is a middleware used with Express.js to parse cookies attached to the client's requests.
It makes the cookie data accessible in the `req.cookies` object, 
which allows your application to easily read and manage cookies sent by the client's browser.

*/

import cookieParser from 'cookie-parser'
const app=express();
//'use' is used for the middleware purposes
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

// configuration for the files 
// Middleware to parse incoming JSON requests
// `limit: "16kb"` restricts the JSON payload size to avoid abuse

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
// will be used to store the images and other things
app.use(express.static("public"))
// cookieParser -access cookie , CRUD operation ,Server reading
app.use(cookieParser())


// routes import 
import router from './routes/user.routes.js';

// routes declaration 
// we are using it because the as we separated all the files , so have to use the middlewares 
// so we have to use the app.use() instead of app.get() 

app.use("/api/v1/users",router)

// this means -> http://localhost:8000/api/v1/users/register


export {app} 
// Extract cookies from incoming requests and make them accessible in req.cookies
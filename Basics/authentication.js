const express=require("express")
const jwt=require("jsonwebtoken")

const jwtPassword="123456"  //A secret key used to sign and verify JWT
const app=express()

app.use(express.json())


const ALL_USER=[{
    username:"biswajitsahoo@gmail.com",
    password:"891dsf23",
    name:"BiswajitSahoo"
},
{
    username:"theconqueror@gmail.com",
    password:"jdfoih283r",
    name:"Gigachad"
},
{
    username:"babaYada@gmail.com",
    password:"sdhfafhu12",
    name:"John Wick"
}]

function userExists(username,password){
    for (let i = 0; i < ALL_USER.length; i++) {
        const element = ALL_USER[i];
        if(username===element.username && password===element.password) return true;
    }
    return false;
}

app.post('/signin',(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    if(!userExists(username,password)){
        return res.status(403).json({
            msg:"User doesn't exist in our in memory DB"
        })
    }
    
    var token=jwt.sign({username:username},jwtPassword);  //Creates a signed token using payload and secret.
    return res.json({
        token
    });
});

app.get("/user",(req,res)=>{
    const token=req.headers.authorization;
    const decoded=jwt.verify(token,jwtPassword);    //Verifies token integrity by recomputing and comparing the signature.
    const username=decoded.username;

    // only return the usernames except the above one
    const users=ALL_USER.filter(user=>user.username!==username)
    res.json({
        users
    })
        
    
})

app.listen(3001,()=>{
    console.log('server is running on 3001');
    
})

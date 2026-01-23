const express=require('express');
const zod=require("zod")

const app=express();

app.use(express.json());

// Without using the ZOD 

// app.post('/health-checkup',(req,res)=>{
//     const kidneys=req.body.kidneys;
//     const kidneyLength=kidneys.length;

//     res.send("You have "+kidneyLength+" kidneys");
// });

// app.use((err,req,res,next)=>{
//     // res.json({
//     //     msg:"Sorry somthing is up with our server!"
//     // })
//     res.status(500).send('An internal server error ocurred!')
// })

const schema=zod.array(zod.number());

const schemaZod=zod.object({
    email:zod.string(),
    password:zod.string(),
    country:zod.literal("IN").or(zod.literal("US")),
    kidneys:zod.array(zod.number())
})


app.post('/health-checkup',(req,res)=>{
    const kidneys=req.body.kidneys;
    
    const response=schema.safeParse(kidneys);

    if(!response.success){
        res.status(411).json({
            msg:"Kidney is invalid"
        })
    }else{
        res.send({
            response
        })
    }
});

app.listen(3001);

// const express = require('express');
// const app = express();
// const bodyParser=require('body-parser');
// const fs=require('fs');

// fs.readFile('testFile.txt','utf-8',function(err,data){
    
// })
// const port=3001;

// app.use(bodyParser.json())


// app.get('/cov', (req, res) => {
//     console.log(req.body);
//     res.send({
//         msg:{
//             "Biswa":90,
//             "Mena":82
//         }
//     });
// });

// app.listen(port, () => {
//     console.log('Server running on port 3001');
// });

const express=require('express');

const app=express();

const user=[{
    name:"john",
    kidneys:[{
        healthy:false
    }]
}]

app.use(express.json())

app.get('/',(req,res)=>{
    const userKindneys=user[0].kidneys;
    const numberOfKindneys=userKindneys.length;
    let numberOfHealthyKidney=0;
    for(let i=0;i<userKindneys.length;i++){
        if(userKindneys[i].healthy){
            numberOfHealthyKidney+=1;
        }
    }
    const numberOfUnhealthyKidney=numberOfKindneys-numberOfHealthyKidney;
    res.json({
        numberOfKindneys,numberOfHealthyKidney,numberOfUnhealthyKidney
    })
})

app.post('/',(req,res)=>{
    const isHealthy=req.body.isHealthy;
    user[0].kidneys.push({
        healthy:isHealthy
    })
    res.json({
        msg:"Post done!"
    })
        
})

app.put('/',(req,res)=>{
    for(let i=0;i<user[0].kidneys.length;i++){
        user[0].kidneys[i].healthy=true;
    }
    res.json({
        msg:"Updated!"
    })
})

app.delete('/',(req,res)=>{
    const newKidneys = [];
    if(isThereAtleastOneUnhealthyKidney()){
        for (let i = 0; i < user[0].kidneys.length; i++) {
            if (user[0].kidneys[i].healthy) {
                newKidneys.push({
                    healthy:true
                });
            }
        }
    
        user[0].kidneys = newKidneys;
        res.json({
            msg:"Done deletion!"
        })
    }
    else{
        res.statusCode(411).json({
            msg: "Wrong input!"
        });
    }
})


function isThereAtleastOneUnhealthyKidney() {
    for (let i = 0; i < user[0].kidneys.length; i++) {
        if (!user[0].kidneys[i].healthy) {
            return true;
        }
    }
    return false;
}


app.listen(3000,()=>{
    console.log('Server is running on the port 3000');
    
});
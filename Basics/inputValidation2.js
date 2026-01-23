const express=require("express");
const z=require("zod")

const app=express();

app.use(express.json());

function ValidateInput(obj){
    const schema=z.object({
        email:z.email(),
        password:z.string().min(8)
    })
    const output=schema.safeParse(obj);
    return output;
}


const output=ValidateInput({
    email:"bi897gmaiom",
    password:"wefwojkdnjksd"
});

console.log(output);

// app.get('/check-input',(req,res,next)=>{

// })


// app.use() runs for every request to the server

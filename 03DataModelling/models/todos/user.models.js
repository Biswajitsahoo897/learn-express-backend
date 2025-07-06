import mongoose from 'mongoose'

//Schema is a method which takes a object  
const userSchema=new mongoose.Schema(
{
    username:{
        type: String,
        required:true,
        unique:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    }

},{timestamps:true}
) 
// this is all known as data modelling 
// also have to export 

export const User=mongoose.model("User",userSchema)
// these 3 lines are mostly common in every project u will make in future
// but the "User" will converted into "users" (alll lowercase & makes it  plural)
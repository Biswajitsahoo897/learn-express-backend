import mongoose from "mongoose";

const hospitalWorkingHours=new mongoose.Schema({
    workingHours:{
        type:Number,
        required:true
    }
})

const docterSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    salary:{
        type:Number,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    experienceInYear:{
        type:Number,
        default:0
    },
    workInHospital:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Hospital"
        },
        {
            type:[hospitalWorkingHours]
        }
    ]
},{timestamps:true})

export const Docter=mongoose.model(
    'Docter',docterSchema
)
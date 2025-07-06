import mongoose from 'mongoose'

const todoSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    complete:{
        type:Boolean,
        default:false
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"//always give the same name as u gave to the usermodel last wala,and it is Mandatory
    },
    subTodos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"subTodo"
        }
    ]
},{timestamps:true})

export const  Todo=mongoose.model("Todo",todoSchema)
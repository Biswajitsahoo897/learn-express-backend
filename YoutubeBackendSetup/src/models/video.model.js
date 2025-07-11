import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchma=new Schema({
    videoFile:{
        type:String,//cloudinary URL 
        required:true
    },
    thumbnail:{
        type:String,//cloudinary URL 
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
    



},{timestamps:true})

// Add reusable behaviors to schemas
videoSchma.plugin(mongooseAggregatePaginate)

export const Video=mongoose.model("Video",videoSchma)
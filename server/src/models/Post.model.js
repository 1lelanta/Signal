import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    title:{
        type:String,
        required:true,
        trim:true,
    },
    content:{
        type:String,
        required:true,
    },
    tags:[
        {
            type:String,
        }
    ],

    valueTags:{
        insightful:{type:Number, default:0},
        wellResearched:{type:Number, default:0},
        practical:{type:Number, default:0},
        challenging:{type:Number, default:0},
        constructive:{type:Number, default:0}
    },
    depthScore:{
        type:Number,
        default:0,
    },
    reflectionExpiresAt:{
        type:Date,
    },
    isPublished:{
        type:Boolean,
        default:false,
    }
},
{timestamps:true}
);

export default mongoose.model("Post", postSchema)
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        post:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Post",
            required:true,

        },
        author:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        type:{
            type:String,
            enum:["question", "counter", "expansion", "evidence"],
            required:true,
        },
        content:{
            type:String,
            required:true,
        },
        depthScore:{
            type:Number,
            default:0,
        },
    },
    {timestamps:true}

)

export default mongoose.model("Comment", commentSchema);
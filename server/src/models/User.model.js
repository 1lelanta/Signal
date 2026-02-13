import mongoose from "mongoose";
const skillSchema = new mongoose.Schema({
    skill:{
        type: String,
        required: true
    },
    score:{
        type:Number,
        default:0,
    }
});

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type: String,
        required:true,
        minlength:6,
    },
    bio:{
        type:String,
        maxlength:500,
    },
    avatar:{
        type:String,
        default:"",
    },
    skills:[skillSchema],
    reputationScore:{
        type:Number,
        default:0
    },
    trustLevel:{
        type:String,
        enum:["newbie", "trusted", "Expert", "moderator"],
        default:"newbie",
    },
    isVerified:{
        type:Boolean,
        default:false,
    }
},
{timestamps: true}
);

export default mongoose.model("User", userSchema);
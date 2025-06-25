import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    files:[{type:mongoose.Schema.Types.ObjectId,ref:'file'}]
});

const userModel=mongoose.models.user||mongoose.model('user',userSchema);

export default userModel;
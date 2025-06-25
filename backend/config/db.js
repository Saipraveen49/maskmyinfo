import mongoose from "mongoose"

export const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://saiPraveen:saiPraveen@cluster0.hvcnpxk.mongodb.net/masked-app?retryWrites=true&w=majority').then(()=>console.log("DB connected"));
}

// 'mongodb+srv://saiPraveen:saiPraveen@masked-app.ea3s2.mongodb.net/masked-app'
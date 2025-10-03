import mongoose from 'mongoose'
import env from './env'

const connectDB =async ()=>{
    try {
        await mongoose.connect(env.MONGO_URI)
        console.log("MONGO DB connected");
    } catch (error : unknown) {

        if(error instanceof Error)
        console.error("Database connection error",error.message);
        else
        console.error("Database connection error",error)
        process.exit(1);
    }
}
export default connectDB;
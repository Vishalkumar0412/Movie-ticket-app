import  { Document, Schema, Types } from "mongoose";
interface IUSer extends Document {
    name:string;
    email:string;
    password:string;
    role:'USER' | 'ADMIN';
    bookingHistory:Types.ObjectId[];
}
const UserSchema =new Schema<IUSer>({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER'
    },
    bookingHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Booking"
        }
    ]

})


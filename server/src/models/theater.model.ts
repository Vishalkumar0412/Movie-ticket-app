import mongoose, { Document, Schema, Model } from "mongoose";
// import { required } from "zod/v4-mini";

export interface ITheater extends Document {
  name: string;             // e.g., "PVR Cinemas"
  city: string;             // e.g., "Gurgaon"
  address: string;             // e.g., "Gurgaon"
          // total number of screens
}

const TheaterSchema = new Schema<ITheater>(
  {
    name: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    address:{type:String,required:true},
    
  },
  { timestamps: true }
);

const Theater: Model<ITheater> = mongoose.model<ITheater>("Theater", TheaterSchema);

export default Theater;

import mongoose, { Document, Schema, Types, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profiePicture :string;
  role: "USER" | "ADMIN";
  bookingHistory: Types.ObjectId[];
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    profiePicture:{type:String},
    bookingHistory: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;

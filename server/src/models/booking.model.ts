import mongoose, { Document, Schema, Types, Model } from "mongoose";

export interface IBooking extends Document {
  user: Types.ObjectId;
  showtime: Types.ObjectId;
  seats: {
    seatId: Types.ObjectId;
    seatLabel: string;
  }[];
  totalPrice: number;
}

const BookingSchema = new Schema<IBooking>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  showtime: { type: Schema.Types.ObjectId, ref: "Showtime", required: true },
  seats: [
    {
      seatId: { type: Schema.Types.ObjectId, required: true },
      seatLabel: { type: String, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
}, { timestamps: true });

const Booking: Model<IBooking> = mongoose.model<IBooking>("Booking", BookingSchema);
export default Booking;

import mongoose, { Document, Schema, Types, Model } from "mongoose";

export interface IShowtime extends Document {
  movie: Types.ObjectId;
  theater: Types.ObjectId;
  screen: number;
  showTime: Date;
  seats: {
    seatLabel: string; // e.g., "A1", "B2"
    isBooked: boolean;
    _id:Types.ObjectId
  }[];
}

const ShowtimeSchema = new Schema<IShowtime>({
  movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
  theater: { type: Schema.Types.ObjectId, ref:"Theater",required: true },
  showTime: { type: Date, required: true },
  seats: [
    {
      seatLabel: { type: String, required: true },
      isBooked: { type: Boolean, default: false },
    },
  ],
}, { timestamps: true });
export type showTimeType=IShowtime
const Showtime: Model<IShowtime> = mongoose.model<IShowtime>("Showtime", ShowtimeSchema);
export default Showtime;

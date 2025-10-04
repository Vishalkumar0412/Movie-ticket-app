import mongoose, { Document, Schema, Types, Model } from "mongoose";

export interface IMovie extends Document {
  title: string;
  description: string;
  posterUrl :string;
  trailerUrl?: string
  genre: string;
  showtimes: Types.ObjectId[];
}

const MovieSchema = new Schema<IMovie>({
  title: { type: String, required: true, unique: true },
  posterUrl:{type:String, required:true},
  trailerUrl:{type:String},
  description: { type: String, required: true },
  genre: { type: String, required: true },
  showtimes: [{ type: Schema.Types.ObjectId, ref: "Showtime" }],
}, { timestamps: true });

const Movie: Model<IMovie> = mongoose.model<IMovie>("Movie", MovieSchema);
export type movieType=IMovie
export default Movie;

import { z } from "zod";
import { MovieGenre } from "../constraints/constraints";


export const addMovieSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),
  
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be at most 1000 characters"),

  posterUrl: z.string()
    .url("Poster must be a valid URL"),
  
  trailerUrl: z.string()
    .url("Trailer must be a valid URL")
    .optional(),

  genre: z.nativeEnum(MovieGenre)

  
});

export type AddMovieInput = z.infer<typeof addMovieSchema>;


export const seatSchema = z.object({
  seatLabel: z.string().min(1, "Seat label is required"), // e.g. "A1"
  isBooked: z.boolean().default(false), // default false
});

export const showtimeSchema = z.object({
  movie: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid movie ObjectId"), // ObjectId string
  theater: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid movie ObjectId"), // ObjectId string  
  showTime: z.coerce.date(), // accepts ISO string and coerces into Date
  rows:z.number().min(1,"Must have atleast one row"),
  cols:z.number().min(1,"Must have atleast one column"),
  
});
export type showTimeInput =z.infer<typeof showtimeSchema>
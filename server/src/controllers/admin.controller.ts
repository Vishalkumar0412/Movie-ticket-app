import { Request, Response } from "express";
import { ApiResponse } from "../shared/types/apiResponse.type";
import {
  AddMovieInput,
  addMovieSchema,
  showTimeInput,
  showtimeSchema,
} from "../shared/validator/admin.validators";
import Movie, { movieType } from "../models/movie.model";
import { generateSeats } from "../utills/genSeets";
import Showtime from "../models/showtime.model";
import Theater from "../models/theater.model";

export const addMovie = async (
  req: Request,
  res: Response<ApiResponse<unknown>>
) => {
  const result = addMovieSchema.safeParse(req.body);
  if (result.error) {
    return res.status(400).json({
      message: "validation error in add movie",
      success: false,
      errors: result.error.flatten().fieldErrors,
    });
  }
  try {
    const { title, genre, posterUrl, trailerUrl, description }: AddMovieInput =
      result.data;
    const movie: movieType = await Movie.create({
      title,
      genre,
      posterUrl,
      trailerUrl,
      description,
    });
    return res.status(200).json({
      message: "Movie added successfully",
      success: true,
      data: movie,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add movie",
      success: false,
    });
  }
};
export const addShowTime=async(req: Request,
  res: Response<ApiResponse<unknown>>)=>{
    const result =showtimeSchema.safeParse(req.body)
    if(result.error){
      return res.status(400).json({
        message:"validation error",
        success:false,
        errors:result.error.flatten().fieldErrors
      })
    }
    try {
      const movie= await Movie.findById(result.data.movie)
      if(!movie){
        return res.status(404).json({
          message:"Movie is not found",
          success:false
        })
      }
      const theater=await Theater.findById(result.data.theater)
      if(!theater){
        return res.status(404).json({
          message:"Theater is not found",
          success:false
        })
      }
      const {rows,cols}:showTimeInput=result.data
      const seats=generateSeats(rows,cols)
      const showTime= await Showtime.create({
        ...result.data,seats
      })
      return res.status(400).json({
        message:"successfully added seats",
        success:true,
        data:showTime
      })
    } catch (error) {
      return res.status(500).json({
        message:"server error in adding show time",
        success:false
      })
    }
  }
  export const addTheater = async (
  req: Request,
  res: Response<ApiResponse<unknown>>
) => {
  const { name, city, address } = req.body;

  if (!name || !city || !address) {
    return res.status(400).json({
      message: "All fields are required",
      success: false,
    });
  }

  try {
    const theater = await Theater.create(req.body);
    return res.status(201).json({
      message: "Theater added successfully",
      success: true,
      data: theater,
    });
  } catch (error: unknown) {
    let message = "Server error in adding theater";
    if (error instanceof Error) message = error.message;

    return res.status(500).json({
      message,
      success: false,
      errors: error,
    });
  }
};
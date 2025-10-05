import { Request, Response } from "express";
import { ApiResponse } from "../shared/types/apiResponse.type";
import Movie from "../models/movie.model";
import Theater from "../models/theater.model";

export const getMovies = async (
  req: Request,
  res: Response<ApiResponse<unknown>>
) => {
  try {
    const movies = await Movie.find({}).select('_id title');
    return res.status(200).json({
      message: "Movies fetched successfully",
      success: true,
      data: movies
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch movies",
      success: false
    });
  }
}

export const getTheaters = async (
  req: Request,
  res: Response<ApiResponse<unknown>>
) => {
  try {
    const theaters = await Theater.find({}).select('_id name city');
    return res.status(200).json({
      message: "Theaters fetched successfully",
      success: true,
      data: theaters
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch theaters",
      success: false
    });
  }
}
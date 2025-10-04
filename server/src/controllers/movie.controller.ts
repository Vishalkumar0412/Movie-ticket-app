import { Request, Response } from "express";
import { ApiResponse } from "../shared/types/apiResponse.type";
import Movie from "../models/movie.model";

export const checkMovies = async (
  req: Request,
  res: Response<ApiResponse<unknown>>
) => {
  try {
   const movies = await Movie.find().populate('showtimes')

    if (movies.length === 0) {
      return res.status(404).json({
        message: "No movies found",
        success: true,
        data: [],
      });
    }

    return res.status(200).json({
      message: "Movies fetched successfully",
      success: true,
      data: movies,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      message: "Server error in fetching movies",
      success: false,
      errors: error instanceof Error ? error.message : error,
    });
  }
};

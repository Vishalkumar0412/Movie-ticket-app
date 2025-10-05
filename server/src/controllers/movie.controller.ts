import { Request, Response } from "express";
import { ApiResponse } from "../shared/types/apiResponse.type";
import Movie from "../models/movie.model";
import Showtime from "../models/showtime.model";

export const checkMovies = async (
  req: Request,
  res: Response<ApiResponse<unknown>>
) => {
  try {
    const movies = await Movie.find().populate("showtimes");

    if (movies.length === 0) {
      return res.status(404).json({
        message: "No movies found",
        success: false,
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

export const checkShows = async (
  req: Request,
  res: Response<ApiResponse<unknown>>
) => {
  const { movieId } = req.params;

  if (!movieId) {
    return res.status(400).json({
      message: "Movie ID is required",
      success: false,
    });
  }

  try {
  const showTimes = await Showtime.find({ movie: movieId })
  .populate({ path: "movie",select:"title posterUrl genre description"})
  .populate({ path: "theater", select: "name address" });

    if (showTimes.length === 0) {
      return res.status(404).json({
        message: "No showtimes found for this movie",
        success: false,
        data: [],
      });
    }

    return res.status(200).json({
      message: "Showtimes fetched successfully",
      success: true,
      data: showTimes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error in fetching showtimes",
      success: false,
      errors: error instanceof Error ? error.message : error,
    });
  }
};

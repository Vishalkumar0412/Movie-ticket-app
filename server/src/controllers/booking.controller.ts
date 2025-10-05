import { Request, Response } from "express";
import mongoose from "mongoose";
import Showtime from "../models/showtime.model";
import Booking from "../models/booking.model";
import User from "../models/user.model";
import { ApiResponse } from "../shared/types/apiResponse.type";

// POST /booking/book-seat
// Books one or more seats atomically for a showtime, creates a Booking, and
// appends the booking to the user's booking history
export const bookSeat = async (
  req: Request,
  res: Response<ApiResponse<unknown>>
) => {
  const { showId, seatIds } = req.body as {
    showId?: string;
    seatIds?: string[];
  };

  if (!showId || !Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({
      message: "Show ID and seatIds[] are required",
      success: false,
    });
  }

  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      message: "User not authorized",
      success: false,
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const show = await Showtime.findById(showId).session(session);
    if (!show) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "Showtime not found",
        success: false,
      });
    }

    // Verify all requested seats exist and are not booked
    const seatIdStrings = new Set(seatIds.map((id) => id.toString()));
    const targetSeats = show.seats.filter((s) => seatIdStrings.has((s as any)._id.toString()));

    if (targetSeats.length !== seatIds.length) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "One or more seats not found",
        success: false,
      });
    }

    const anyAlreadyBooked = targetSeats.some((s) => s.isBooked === true);
    if (anyAlreadyBooked) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "One or more seats already booked",
        success: false,
      });
    }

    // Mark seats as booked
    show.seats = show.seats.map((s) => {
      const isTarget = seatIdStrings.has((s as any)._id.toString());
      return isTarget ? ({ ...(s as any), isBooked: true } as any) : s;
    });
    await show.save({ session });

    // Create Booking record
    const bookedSeats = targetSeats.map((s) => ({
      seatId: (s as any)._id,
      seatLabel: s.seatLabel,
    }));
    const seatPrice = Number(process.env.SEAT_PRICE ?? 200);
    const totalPrice = seatPrice * bookedSeats.length;

    const booking = await Booking.create([
      {
        user: new mongoose.Types.ObjectId(userId),
        showtime: show._id,
        seats: bookedSeats,
        totalPrice,
      },
    ], { session });

    // Append to user's booking history
    await User.findByIdAndUpdate(
      userId,
      { $push: { bookingHistory: booking[0]._id } },
      { session }
    );

    await session.commitTransaction();
    return res.status(200).json({
      message: "Seats booked successfully",
      success: true,
      data: {
        bookingId: booking[0]._id,
        showId: show._id,
        seatIds,
        totalPrice,
      },
    });
  } catch (error: unknown) {
    await session.abortTransaction();
    return res.status(500).json({
      message: "Server error while booking seats",
      success: false,
      errors: error instanceof Error ? error.message : error,
    });
  } finally {
    session.endSession();
  }
};

// GET /booking/my - fetch bookings for the current user
export const getMyBookings = async (
  req: Request,
  res: Response<ApiResponse<unknown>>
) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      message: "User not authorized",
      success: false,
    });
  }

  try {
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "showtime",
        populate: [
          { path: "movie", select: "title posterUrl genre description" },
          { path: "theater", select: "name address" },
        ],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Bookings fetched successfully",
      success: true,
      data: bookings,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      message: "Server error while fetching bookings",
      success: false,
      errors: error instanceof Error ? error.message : error,
    });
  }
};

import { z } from "zod";
import { MovieGenre } from "../constraints/constraints";

// Common schemas
export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

// User schemas
export const userLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const userRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email format").optional(),
  currentPassword: z.string().min(6).optional(),
  newPassword: z.string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .optional(),
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Current password is required when setting new password",
  path: ["currentPassword"],
});

// Movie schemas
export const addMovieSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),
  
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be at most 1000 characters"),

  posterUrl: z.string().url("Poster must be a valid URL"),
  
  trailerUrl: z.string().url("Trailer must be a valid URL").optional(),

  genre: z.nativeEnum(MovieGenre),
});

// Theater and Showtime schemas
export const theaterSchema = z.object({
  name: z.string().min(2, "Theater name must be at least 2 characters"),
  location: z.string().min(5, "Location must be at least 5 characters"),
  capacity: z.number().int().positive("Capacity must be a positive number"),
});

export const showtimeSchema = z.object({
  movie: objectIdSchema,
  theater: objectIdSchema,
  showTime: z.coerce.date(),
  rows: z.number().int().min(1, "Must have at least one row"),
  cols: z.number().int().min(1, "Must have at least one column"),
  price: z.number().positive("Price must be a positive number"),
});

// Booking schemas
export const bookingSchema = z.object({
  showtime: objectIdSchema,
  seats: z.array(z.object({
    row: z.number().int().min(0),
    col: z.number().int().min(0),
  })).min(1, "At least one seat must be selected"),
});

// File upload schemas
export const fileUploadSchema = z.object({
  file: z.custom<Express.Multer.File>()
    .refine((file) => file !== undefined, "File is required")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp", "video/mp4"].includes(file.mimetype),
      "File type not supported. Supported types: JPEG, PNG, WebP, MP4"
    )
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size must be less than 10MB"
    ),
});

// Response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.unknown().optional(),
  error: z.unknown().optional(),
});

// Types
export type UserLoginInput = z.infer<typeof userLoginSchema>;
export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddMovieInput = z.infer<typeof addMovieSchema>;
export type TheaterInput = z.infer<typeof theaterSchema>;
export type ShowtimeInput = z.infer<typeof showtimeSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ApiResponse = z.infer<typeof apiResponseSchema>;
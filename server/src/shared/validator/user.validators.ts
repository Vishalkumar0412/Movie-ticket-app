import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, { message: "The name must be at least 3 characters long" })
    .max(40, { message: "The name must not be longer than 40 characters" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, { message: "Password must include upper, lower, number, and special character" }),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email({ message: "Invalid email" }),
  password: z.string({ required_error: "Password is required" }),
});
export type loginInput= z.infer<typeof loginSchema>
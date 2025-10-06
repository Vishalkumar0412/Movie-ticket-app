import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, { message: "The name must be at least 3 characters long" })
    .max(40, { message: "The name must not be longer than 40 characters" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }).toLowerCase(),
  password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" })
      .refine((val) => /[a-z]/.test(val), { message: "At least one lowercase letter" })
      .refine((val) => /[A-Z]/.test(val), { message: "At least one uppercase letter" })
      .refine((val) => /\d/.test(val), { message: "At least one number" })
      .refine((val) => /[@$!%*?&]/.test(val), { message: "At least one special character" }),
    });

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email({ message: "Invalid email" }).toLowerCase(),
  password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" })

});
export type loginInput= z.infer<typeof loginSchema>
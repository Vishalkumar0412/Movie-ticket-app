import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  loginInput,
  loginSchema,
  SignupInput,
  signupSchema,
} from "../shared/validator/user.validators";
import { ApiResponse } from "../shared/types/apiResponse.type";
import z from "zod";
import User from "../models/user.model";
import { parse } from "path";
import { genToken } from "../utills/genToken";

export const signup = async (
  req: Request,
  res: Response<ApiResponse<unknown>>
) => {
  const parsed = signupSchema.safeParse(req.body);
  if (parsed.error) {
    return res.status(400).json({
      message: "validation error",
      errors: parsed.error.flatten().fieldErrors,
      success: false,
    });
  }

  try {
    const { name, email, password }: SignupInput = parsed.data;
    const exitUser = await User.findOne({ email });
    if (exitUser) {
      return res.status(400).json({
        message: "User is already registered by this email",
        success: false,
      });
    }
    const hashedPassowrd = await bcrypt.hash(password, 10);
    await User.create({
      email,
      password: hashedPassowrd,
      name,
    });
    return res.status(201).json({
      message: "User signup successfully",
      success: true,
    });
  } catch (error: unknown) {
    let message = "Server error in signup";

    if (error instanceof Error) {
      message = error.message;
    }

    return res.status(500).json({
      success: false,
      message,
      errors: error,
    });
  }
};

export const login = async (
  req: Request,
  res: Response<ApiResponse<null>>
) => {
  const result = loginSchema.safeParse(req.body);
  if (result.error) {
    return res.status(400).json({
      message: "validation error",
      errors: result.error.flatten().fieldErrors,
      success: false,
    });
  }
  try {
    const { email, password }: loginInput = result.data;
    const user=await User.findOne({email});
    if(!user){
      return res.status(400).json({message:"Email or password wrong",success:false})
    }
    const isPasswordMatch = await bcrypt.compare(password,user.password)
    if(!isPasswordMatch){
      return res.status(400).json({
        message:"Email or password wrong",
        success:false
      })
    }
   return await  genToken(user._id,res,`Welcome back ${user.name}`)
  } catch (error: unknown) {
    let message = "Server error In login";

    if (error instanceof Error) {
      message = error.message;
    }

    return res.status(500).json({
      success: false,
      message,
      errors: error,
    });
  }
};

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  loginInput,
  loginSchema,
  SignupInput,
  signupSchema,
} from "../shared/validator/user.validators";
import { ApiResponse } from "../shared/types/apiResponse.type";

import User from "../models/user.model";

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

export const login = async (req: Request, res: Response<ApiResponse<null>>) => {
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
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email or password wrong", success: false });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Email or password wrong",
        success: false,
      });
    }
    return  genToken(user._id,user.role, res, `Welcome back ${user.name}`);
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
export const getProfile = async (
  req: Request,
  res: Response<ApiResponse<unknown>>
) => {
  const userId=req.userId;
    if(!userId){
      return res.status(400).json({
        success:false,
        message:"user not authorized"
      })
    }
  try {
  const user=await User.findById(userId).select("-password")
  if(!user){
    return res.status(404).json({
      message:"user not found",
      success:false
    })
  }
  return res.status(200).json({
    message:"user fetched successfully",
    success:true,
    data:user
  })
  } catch (error) {
    return res.status(500).json({
      message:"server error in fetching user",
      success:false
    })
  }
};

export const logout = async (
  req: Request,
  res: Response<ApiResponse<null>>
) => {
  try {
    return res.status(200).cookie("token", "", {maxAge:0}).json({
            message:"Logged out successfully.",
            success:true
        })
    // return res.status(200).json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to logout', errors: error })
  }
}
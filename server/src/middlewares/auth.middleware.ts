import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../config/env";

// Extend Request interface safely
declare module "express-serve-static-core" {
  interface Request {
    userId?: string;  // make optional to avoid type errors
    role:"USER" |"ADMIN"
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;
   

    if (!token) {
      return res.status(401).json({
        message: "User not authorized",
        success: false,
      });
    }

    // Decode JWT
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload & {
      userId: string;
    };

    if (!decoded?.userId) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    req.userId = decoded.userId; 
    req.role=decoded.role
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Server error in verification of token",
      success: false,
      error: error instanceof Error ? error.message : error,
    });
  }
};

import { Response } from "express";
import jwt from 'jsonwebtoken'
import { ApiResponse } from "../shared/types/apiResponse.type";
import env from "../config/env";

export const genToken =  (
    userId: string | number | unknown,
    role: string,
    res: Response<ApiResponse<null>>,
    message: string
) => {
    try {
        const token = jwt.sign(
            { userId, role },
            env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, 
            
        });
        
        return res.status(200).json({
            message,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to generate token",
            success: false
        });
    }
}
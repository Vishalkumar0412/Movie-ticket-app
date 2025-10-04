import { Request, Response, NextFunction } from "express";

export const roleMiddleware =
  (...allowedRoles: ("USER" | "ADMIN")[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    // req.userRole should be set in authMiddleware
    if (!allowedRoles.includes(req.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You don't have access to this resource",
      });
    }
    next();
  };

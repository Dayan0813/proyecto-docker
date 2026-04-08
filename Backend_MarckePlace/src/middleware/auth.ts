import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/AuthRequest";

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token" });

  const parts = auth.split(" ");
  if (parts.length !== 2)
    return res.status(401).json({ message: "Invalid token" });

  const token = parts[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as any;

    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};


export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ message: "No user" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
};


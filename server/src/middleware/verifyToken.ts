import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export default function verifyToken(client: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
    let secret = "";

    if (client === "worker") {
      secret = process.env.JWT_SECRET_WORKER ?? "";
    } else if (client === "user") {
      secret = process.env.JWT_SECRET_USER ?? "";
    } else {
      res.status(400).send("Invalid client type.");
      return;
    }

    const token = req.headers["authorization"]?.replace("Bearer ", "");
    if (!token) {
      res.status(401).send("Access denied. No token provided.");
      return;
    }

   
      const valid = jwt.verify(token, secret);
      if (!valid) {
        res.status(401).send("Access denied. Invalid token.");
        return;
      }

      next(); // Call the next middleware or route handler
    } catch (error) {
      console.error("JWT Verification Error:", error);
      res.status(500).send("Internal server error.");
    }
  };
}

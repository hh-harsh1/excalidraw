import { JWT_SECRATE } from "@repo/backend-common/config";
import { Request, Response, NextFunction } from "express";
import JWT, { JwtPayload } from "jsonwebtoken";

export const middleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Authheader = req.headers.authorization;

    if (typeof Authheader !== "string" || !Authheader?.startsWith("Bearer ")) {
      res.status(500).json({
        message: "invalid headers",
      });
      return;
    }

    const token = Authheader.split(" ")[1]!;
    console.log("token : ", token);

    const decoded = JWT.verify(token, JWT_SECRATE);

    if (decoded) {
      req.id = (decoded as JwtPayload).id;
      next();
    } else {
      res.status(404).json({
        message: "Unauthorized",
      });
    }
  } catch (error) {
    res.json({
      error,
    });
  }
};

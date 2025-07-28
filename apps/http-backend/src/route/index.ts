import dotenv from "dotenv";
import JWT from "jsonwebtoken";
import b from "bcrypt";

import { Router } from "express";
import {
  createRoomSchema,
  signinSchema,
  signupSchema,
} from "@repo/common/types";

import { JWT_SECRATE } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";
import { middleware } from "../userMiddleware";

dotenv.config({ path: "../../.env" });

const router: Router = Router();

router.post("/signup", async (req, res) => {
  try {
    const body = req.body;

    const result = signupSchema.safeParse(body);

    if (!result.success) {
      res.status(500).json({
        message: "enter valid credantial....",
      });
      return;
    }

    b.hash(body.password, 10, async (err, res) => {
      if (err) {
        return;
      }
      await prismaClient.user.create({
        data: {
          name: result.data.name,
          email: result.data.email,
          password: res,
        },
      });
    });

    res.status(200).json({
      message: "successfully signup",
    });
  } catch (e) {
    res.status(500).json({
      message: "error while signup",
    });
    return;
  }
});

router.post("/signin", async (req, res) => {
  try {
    const body = req.body;

    const result = signinSchema.safeParse(body);

    if (!result.success) {
      res.status(500).json({
        message: "enter valid credantial....",
      });
      return;
    }

    const user = await prismaClient.user.findFirst({
      where: {
        name: result.data.name,
      },
    });

    if (!user) {
      res.status(404).json({
        message: "user not found",
      });
      return;
    }

    const hashpassword = await b.compare(body.password, user.password);

    if (!hashpassword) {
      res.status(500).json({
        message: "incorrect password",
      });
    }

    const token = JWT.sign({ id: user.id }, JWT_SECRATE);

    res.status(200).json({
      message: "successfully signin...",
      token,
    });
  } catch (error) {
    res.status(200).json({
      message: "error while signin...",
    });
    return;
  }
});

export default router;

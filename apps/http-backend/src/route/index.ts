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
import { connect } from "net";

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

router.post("/create", middleware, async (req, res) => {
  const body = req.body;
  const result = createRoomSchema.safeParse(body);

  if (!result.success) {
    res.status(500).json({
      message: "room name must have more than 3 characters",
    });
    return;
  }

  const response = await prismaClient.room.create({
    data: {
      slug: body.room,
      AdminId: req.id,
    },
  });

  res.status(200).json({
    message: "successfully created room",
    roomId: response.id,
  });
});

router.post("/invite", middleware, async (req, res) => {
  try {
    const roomId = req.body.roomId;

    console.log(req.id);

    const room_exsist = await prismaClient.room.findFirst({
      where: {
        id: Number(roomId),
      },
    });
    console.log(room_exsist);

    if (!room_exsist) {
      res.status(500).json({
        message: "room is not exsist...",
      });
    }

    const admin = await prismaClient.room.findFirst({
      where: {
        AdminId: req.id,
      },
    });

    console.log(admin);

    if (!admin) {
      res.status(500).json({
        message: "this room is not bellongs to you",
      });
    }

    res.status(200).json({
      link: `http://localhost:3000/canvas/${roomId}`,
    });
  } catch {
    res.status(500).json({
      message: "error while inviting...",
    });
  }
});

export default router;

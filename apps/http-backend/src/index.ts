import express from "express";
import cors from "cors";

import userRouter from "./route/index";
import { middleware } from "./userMiddleware";
import { createRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);

app.get("/chat/:room", async (req, res) => {
  const body = req.params.room;
  const result = createRoomSchema.safeParse(body);

  const chats = await prismaClient.chat.findMany({
    where: {
      roomId: Number(body),
    },
    orderBy: {
      id: "desc",
    },
    take: 50,
  });

  res.json({
    chats,
  });
});

app.listen(3001, () => {
  console.log("runnig on port 3000");
});

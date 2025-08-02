import { WebSocket, WebSocketServer } from "ws";
import JWT, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRATE } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface Room {
  socket: WebSocket;
  rooms: string[];
  usersId: string;
}

const Users: Room[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = JWT.verify(token, JWT_SECRATE);

    if (typeof decoded === "string") {
      return null;
    }

    if (!decoded || !decoded.id) {
      return null;
    }

    return decoded.id;
  } catch (error) {
    console.log(error);
    return null;
  }
}

wss.on("connection", (ws, request) => {
  try {
    const url = request.url;

    if (!url) {
      return;
    }

    const queryparams = new URLSearchParams(url.split("?")[1]);

    const token = queryparams.get("token") || "";

    const userAuthenticated = checkUser(token);

    if (!userAuthenticated) {
      ws.close();
      return;
    }

    Users.push({
      socket: ws,
      rooms: [],
      usersId: userAuthenticated,
    });

    ws.on("message", async (data) => {
      let parsedMessage;
      if (typeof parsedMessage !== "string") {
        parsedMessage = JSON.parse(data.toString());
      } else {
        parsedMessage = JSON.parse(data as unknown as string);
      }

      if (parsedMessage.type === "create_room") {
        const roomexsist = await prismaClient.room.findFirst({
          where: {
            slug: parsedMessage.room,
          },
        });

        if (roomexsist) {
          ws.send("room already exsist please enter unique room name");
          return;
        }

        const room = await prismaClient.room.create({
          data: {
            slug: parsedMessage.room,
            AdminId: userAuthenticated,
          },
        });

        ws.send(JSON.stringify(room));
      }

      if (parsedMessage.type === "join_room") {
        const user = Users.find((x) => x.socket == ws);
        console.log(parsedMessage.roomId);

        if (!user) {
          ws.send("user not found");
          return;
        }

        const user_exsist_inRoom = Users.find(
          (x) => x.socket === ws
        )?.rooms.includes(parsedMessage.roomId);

        if (user_exsist_inRoom) {
          ws.send("you have already join this room");
          return;
        }

        user.rooms.push(parsedMessage.roomId);
        ws.send("sucsessfully join");
      }

      if (parsedMessage.type === "leave_room") {
        const user_exsist = Users.find((x) => x.socket === ws);

        if (!user_exsist || user_exsist === undefined) {
          return;
        }

        const user_exsist_inRoom = user_exsist.rooms.find(
          (x) => x === parsedMessage.room
        );

        if (!user_exsist_inRoom) {
          ws.send("you have not join any rooom yet!");
        }

        user_exsist.rooms = user_exsist.rooms.filter(
          (x) => x === parsedMessage.room
        );
      }

      if (parsedMessage.type === "chat") {
        const message = parsedMessage.message;
        const room = parsedMessage.roomId;

        const result = await prismaClient.chat.create({
          data: {
            message: message,
            roomId: Number(room),
            userId: userAuthenticated,
          },
        });

        Users.forEach((user) => {
          if (user.rooms.includes(room)) {
            user.socket.send(
              JSON.stringify({
                type: "chat",
                message,
                room,
                result,
              })
            );
          }
        });
      }
    });
  } catch (error) {
    ws.on("error", () => {
      ws.send("error");
    });
  }
});

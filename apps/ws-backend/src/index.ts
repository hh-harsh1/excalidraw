import { WebSocket, WebSocketServer } from "ws";
import JWT, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRATE } from "@repo/backend-common/config";
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, request) => {
  const url = request.url;

  if (!url) {
    return;
  }

  const queryparams = new URLSearchParams(url.split("?")[1]);

  const token = queryparams.get("token") || "";

  const decoded = JWT.verify(token, JWT_SECRATE);

  if (!decoded || !(decoded as JwtPayload).id) {
    ws.send("Unauthorized");
    ws.close();
    return;
  }

  ws.on("message", (data) => {
    ws.send("hi there");
  });
});

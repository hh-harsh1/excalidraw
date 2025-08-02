"use client";
import React, { useEffect, useState } from "react";
import { WS_URL } from "../config/config";
import Canvas from "./Canvas";

function Roomcanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );
      setSocket(ws);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    return () => ws.close();
  }, []);

  if (!socket) {
    return <div>connecting to server....</div>;
  }

  return <Canvas socket={socket} roomId={roomId} />;
}

export default Roomcanvas;

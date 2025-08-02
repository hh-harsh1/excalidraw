"use client";
import React, { useEffect, useRef } from "react";
import initDraw from "../hook/initDraw";

function Canvas({ socket, roomId }: { roomId: string; socket: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current, socket, roomId);
    }
  }, [canvasRef]);

  return (
    <div className="h-screen w-full bg-black">
      <canvas
        ref={canvasRef}
        height={900}
        width={900}
        style={{
          backgroundColor: "white",
        }}
      ></canvas>
    </div>
  );
}

export default Canvas;

"use client";

import React, { useEffect, useRef, useState } from "react";
import ToolIcon from "../hook/icon/ToolIcon";
import {
  Circle,
  LetterText,
  LucideChartNoAxesColumn,
  Pencil,
  Square,
} from "lucide-react";
import { draw } from "../drawclass";
import { selectedShape } from "../types/types";

function Canvas({ socket, roomId }: { roomId: string; socket: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<selectedShape>(
    selectedShape.Circle
  );
  const [game, setGame] = useState<draw>();

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  window.addEventListener("resize", () => {
    game?.resize();
    game?.init();
  });

  useEffect(() => {
    if (canvasRef.current) {
      const g = new draw(canvasRef.current, socket, roomId);
      setGame(g);
    }
  }, [canvasRef]);

  return (
    <div className="relative h-[100%] w-[100%] bg-black">
      <div className="absolute mt-2  top-0 left-0  !h-[48px] w-[100%]  items-center justify-center !flex-none !flex-nowrap overflow-x-auto">
        <div className="h-[100%] max-w-[240px] mx-auto bg-[#232329] rounded-lg flex items-center justify-center gap-1">
          <ToolIcon
            activated={selectedTool === selectedShape.Circle}
            onClick={() => {
              setSelectedTool(selectedShape.Circle);
            }}
            icon={<Circle height={15} />}
          />
          <ToolIcon
            activated={selectedTool === selectedShape.Rectangle}
            onClick={() => {
              setSelectedTool(selectedShape.Rectangle);
            }}
            icon={<Square height={15} />}
          />

          <ToolIcon
            activated={selectedTool === selectedShape.Pencil}
            onClick={() => {
              setSelectedTool(selectedShape.Pencil);
            }}
            icon={<Pencil height={15} />}
          />
          <ToolIcon
            activated={selectedTool === selectedShape.Line}
            onClick={() => {
              setSelectedTool(selectedShape.Line);
            }}
            icon={<LucideChartNoAxesColumn height={15} />}
          />
          <ToolIcon
            activated={selectedTool === selectedShape.Text}
            onClick={() => {
              setSelectedTool(selectedShape.Text);
            }}
            icon={<LetterText height={15} />}
          />
        </div>
      </div>
      <canvas
        ref={canvasRef}
        height={window.innerHeight}
        width={window.innerHeight}
        style={{
          backgroundColor: "white",
          zIndex: 0,
        }}
      ></canvas>
    </div>
  );
}

export default Canvas;

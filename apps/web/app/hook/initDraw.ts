import { selectedShape } from "../component/Canvas";
import useChat from "./useChat";

type shape =
  | {
      type: selectedShape.Rectangle;
      x: number;
      y: number;
      height: number;
      width: number;
    }
  | {
      type: selectedShape.Circle;
      centerX: number;
      centerY: number;
      radius: number;
      width: number;
      height: number;
    };

let startX = 0;
let startY = 0;

export default async function (
  canvas: HTMLCanvasElement,
  socket: WebSocket,
  roomId: string
) {
  let shapes: shape[] = await useChat(roomId);

  const ctx = canvas?.getContext("2d");

  if (!ctx) {
    return;
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawShape(shapes, canvas, ctx!);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type == "chat") {
      const parsedmessage = JSON.parse(message.message);

      shapes.push(parsedmessage.shape);
      drawShape(shapes, canvas, ctx);
    }
  };

  drawShape(shapes, canvas, ctx);

  let click = false;

  canvas?.addEventListener("mousedown", (e) => {
    click = true;
    startX = e.clientX;
    startY = e.clientY;
    console.log(startX, startY);
  });

  canvas?.addEventListener("mouseup", (e) => {
    click = false;
    const height = e.clientY - startY;
    const width = e.clientX - startX;
    const centerX = startX + width / 2;
    const centerY = startY + height / 2;
    const radius = Math.max(width, height) / 2;

    //@ts-ignore
    const selectedTool = window.selectedTool;

    if (selectedTool === selectedShape.Rectangle) {
      const shape: shape = {
        //@ts-ignore
        type: window.selectedTool,
        x: startX,
        y: startY,
        height,
        width,
      };
      shapes.push(shape);
      socket.send(
        JSON.stringify({
          type: "chat",
          roomId: roomId,
          message: JSON.stringify({ shape }),
        })
      );
    } else if (selectedTool === selectedShape.Circle) {
      const shape: shape = {
        //@ts-ignore
        type: window.selectedTool,
        centerX: centerX,
        centerY: centerY,
        radius: radius,
        width,
        height,
      };

      shapes.push(shape);

      socket.send(
        JSON.stringify({
          type: "chat",
          roomId: roomId,
          message: JSON.stringify({ shape }),
        })
      );
    }
  });

  canvas?.addEventListener("mousemove", (e) => {
    if (click) {
      const height = e.clientY - startY;
      const width = e.clientX - startX;
      ctx.strokeStyle = "white";

      //@ts-ignore
      if (window.selectedTool === selectedShape.Circle) {
        drawShape(shapes, canvas, ctx);
        drawCircle(width, height, ctx);
        //@ts-ignore
      } else if (window.selectedTool === selectedShape.Rectangle) {
        drawShape(shapes, canvas, ctx);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "white";
        drawShape(shapes, canvas, ctx);
        ctx.strokeRect(startX, startY, width, height);
      }
    }
  });
}

function drawShape(
  allshape: shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "white";

  allshape.map((shape) => {
    if (shape.type === selectedShape.Rectangle) {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === selectedShape.Circle) {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();
    }
  });
}

function drawCircle(
  width: number,
  height: number,
  ctx: CanvasRenderingContext2D
) {
  const centerX = startX + width / 2;
  const centerY = startY + height / 2;
  console.log(centerX, centerY);
  const radius = Math.max(width, height) / 2;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
}

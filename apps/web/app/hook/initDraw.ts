import useChat from "./useChat";

type shape = {
  type: "rect" | "circle";
  x: number;
  y: number;
  height: number;
  width: number;
};

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
  let startX = 0;
  let startY = 0;

  canvas?.addEventListener("mousedown", (e) => {
    click = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas?.addEventListener("mouseup", (e) => {
    click = false;
    const height = e.clientY - startY;
    const width = e.clientX - startX;

    const shape: shape = {
      type: "rect",
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
  });

  canvas?.addEventListener("mousemove", (e) => {
    if (click) {
      const height = e.clientY - startY;
      const width = e.clientX - startX;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawShape(shapes, canvas, ctx);
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}

function drawShape(
  allshape: shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  allshape.map((shape) => {
    if (shape.type === "rect") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}

import useChat from "./hook/useChat";
import { selectedShape, shapes } from "./types/types";

export class draw {
  private canvas: HTMLCanvasElement;
  private socket: WebSocket;
  private roomId: string;
  private ctx: CanvasRenderingContext2D;
  private selectedTool = selectedShape.Rectangle;
  private clicked = false;
  private startX = 0;
  private startY = 0;
  private height = 0;
  private width = 0;
  private centerX = 0;
  private centerY = 0;
  private radius = 0;
  private moveX = 0;
  private moveY = 0;
  private exsistingShapes: shapes[] = [];

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string) {
    this.canvas = canvas;
    this.socket = socket;
    this.roomId = roomId;
    this.ctx = canvas.getContext("2d")!;
    this.resize();
    this.init();
    this.drawShpe();
    this.pushShape();
    this.initHandler();
  }

  setTool(selectedToolType: selectedShape) {
    this.selectedTool = selectedToolType;
  }

  async init() {
    this.exsistingShapes = await useChat(this.roomId);
    this.drawShpe();
    this.pushShape();
  }

  initHandler() {
    const rect = this.canvas.getBoundingClientRect();
    let isdraw: boolean;

    //@ts-ignore
    let drawnPath = [];

    this.canvas.addEventListener("mousedown", (e) => {
      this.clicked = true;
      this.drawShpe();
      isdraw = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
      if (this.selectedTool === selectedShape.Pencil) {
        let startsX = e.clientX - rect.left;
        let startsY = e.clientY - rect.top;
        if (this.clicked) {
          this.ctx.fillStyle = "black";
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.strokeStyle = "white";
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
          this.drawShpe();
          this.ctx.beginPath();
          this.ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
          drawnPath.push([{ x: startsX, y: startsY }]);
        }
      }
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.clicked) {
        if (this.selectedTool === selectedShape.Rectangle) {
          this.height = e.clientY - this.startY;
          this.width = e.clientX - this.startX;

          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.fillStyle = "black";
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.strokeStyle = "white";
          this.ctx.lineWidth = 3;
          this.drawShpe();
          this.ctx.strokeRect(
            this.startX,
            this.startY,
            this.width,
            this.height
          );
        } else if (this.selectedTool === selectedShape.Circle) {
          this.height = e.clientY - this.startY;
          this.width = e.clientX - this.startX;
          this.centerX = this.startX + this.width / 2;
          this.centerY = this.startY + this.height / 2;
          this.radius = Math.max(this.height, this.width) / 2;

          this.ctx.fillStyle = "black";
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

          this.ctx.strokeStyle = "white";
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
          this.drawShpe();
          this.ctx.beginPath();
          this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
          this.ctx.lineWidth = 3;
          this.ctx.stroke();
          this.ctx.closePath();
        } else if (this.selectedTool === selectedShape.Line) {
          this.moveX = e.clientX;
          this.moveY = e.clientY;

          this.ctx.beginPath();
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.fillStyle = "black";
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.strokeStyle = "white";
          this.drawShpe();
          this.ctx.moveTo(this.moveX, this.moveY);
          this.ctx.lineTo(this.startX, this.startY);
          this.ctx.lineWidth = 3;
          this.ctx.stroke();
        } else if (this.selectedTool === selectedShape.Pencil) {
          if (isdraw) {
            let currentX = e.clientX - rect.left;
            let currentY = e.clientY - rect.top;
            this.ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            this.ctx.lineWidth = 3;
            this.ctx.stroke();

            //@ts-ignore
            drawnPath[drawnPath.length - 1].push({ x: currentX, y: currentY });
          }
        }
      }
    });

    this.canvas.addEventListener("mouseup", (e) => {
      this.clicked = false;

      if (this.selectedTool === selectedShape.Rectangle) {
        const shape: shapes = {
          type: this.selectedTool,
          startX: this.startX,
          startY: this.startY,
          width: this.width,
          height: this.height,
        };
        this.exsistingShapes.push(shape);
        this.drawShpe();
        this.socket.send(
          JSON.stringify({
            type: "chat",
            roomId: this.roomId,
            message: JSON.stringify({ shape }),
          })
        );
      } else if (this.selectedTool === selectedShape.Circle) {
        const shape: shapes = {
          type: this.selectedTool,
          centerX: this.startX + this.width / 2,
          centerY: this.startY + this.height / 2,
          radius: Math.max(this.height, this.width) / 2,
          width: this.width,
          height: this.height,
        };
        this.exsistingShapes.push(shape);
        this.drawShpe();
        this.socket.send(
          JSON.stringify({
            type: "chat",
            roomId: this.roomId,
            message: JSON.stringify({ shape }),
          })
        );
      } else if (this.selectedTool === selectedShape.Pencil) {
        this.exsistingShapes.push({
          type: selectedShape.Pencil,
          //@ts-ignore
          path: drawnPath,
        });
        this.drawShpe();
        this.socket.send(
          JSON.stringify({
            type: "chat",
            roomId: this.roomId,
            message: JSON.stringify({
              shape: {
                type: selectedShape.Pencil,
                //@ts-ignore
                path: drawnPath,
              },
            }),
          })
        );
      } else if (this.selectedTool === selectedShape.Line) {
        const shape: shapes = {
          type: selectedShape.Line,
          moveX: this.moveX,
          moveY: this.moveY,
          endX: this.startX,
          endY: this.startY,
        };
        this.exsistingShapes.push(shape);
        this.drawShpe();
        this.socket.send(
          JSON.stringify({
            type: "chat",
            roomId: this.roomId,
            message: JSON.stringify({ shape }),
          })
        );
      }
    });
  }

  drawShpe() {
    this.ctx.fillStyle = "black";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.exsistingShapes.map((shape) => {
      if (shape.type === selectedShape.Rectangle) {
        this.ctx.strokeRect(
          shape.startX,
          shape.startY,
          shape.width,
          shape.height
        );
      } else if (shape.type === selectedShape.Circle) {
        this.ctx.beginPath();
        this.ctx.arc(
          shape.centerX,
          shape.centerY,
          shape.radius,
          0,
          Math.PI * 2
        );
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === selectedShape.Pencil) {
        shape.path.forEach((path: any) => {
          if (path.length > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(path[0].x, path[0].y);
          }
          for (let i = 0; i < path.length; i++) {
            this.ctx.lineTo(path[i].x, path[i].y);
          }
          this.ctx.stroke();
        });
      } else if (shape.type === selectedShape.Line) {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.moveX, shape.moveY);
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
      }
    });
  }

  pushShape() {
    this.socket.onmessage = (messages) => {
      const data = JSON.parse(messages.data);
      const shape = JSON.parse(data.message);
      if (shape.shape.type === selectedShape.Rectangle) {
        const shapes: shapes = {
          type: shape.shape.type,
          startX: shape.shape.startX,
          startY: shape.shape.startY,
          width: shape.shape.width,
          height: shape.shape.height,
        };
        this.exsistingShapes.push(shapes);
        this.drawShpe();
      } else if (shape.shape.type === selectedShape.Circle) {
        const shapes: shapes = {
          type: shape.shape.type,
          centerX: shape.shape.centerX,
          centerY: shape.shape.centerY,
          radius: Math.max(shape.shape.height, shape.shape.width) / 2,
          width: shape.shape.width,
          height: shape.shape.height,
        };
        this.exsistingShapes.push(shapes);
        this.drawShpe();
      } else if (shape.shape.type === selectedShape.Pencil) {
        const drwing = shape.shape.path;
        this.exsistingShapes.push({
          type: selectedShape.Pencil,
          //@ts-ignore
          path: drwing,
        });
        this.drawShpe();
      } else if (shape.shape.type === selectedShape.Line) {
        this.exsistingShapes.push({
          type: shape.shape.type,
          moveX: shape.shape.moveX,
          moveY: shape.shape.moveY,
          endX: shape.shape.endX,
          endY: shape.shape.endY,
        });
        this.drawShpe();
      }
    };
  }
  resize() {
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
  }
}

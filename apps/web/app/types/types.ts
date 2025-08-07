export enum selectedShape {
  Circle = "Circle",
  Rectangle = "Rectangle",
  Line = "Line",
  Pencil = "Pencil",
  Text = "Text",
}

export type shapes =
  | {
      type: selectedShape.Rectangle;
      startX: number;
      startY: number;
      height: number;
      width: number;
    }
  | {
      type: selectedShape.Circle;
      centerX: number;
      centerY: number;
      radius: number;
      height: number;
      width: number;
    }
  | {
      type: selectedShape.Pencil;
      path: [];
    }
  | {
      type: selectedShape.Line;
      moveX: number;
      moveY: number;
      endX: number;
      endY: number;
    };

export type exsistingShapes =
  | {
      type: selectedShape.Rectangle;
      startX: number;
      startY: number;
      height: number;
      width: number;
    }
  | {
      type: selectedShape.Circle;
      centerX: number;
      centerY: number;
      radius: number;
      height: number;
      width: number;
    };

export type pencilPath = {
  staretX: number;
  staretY: number;
};

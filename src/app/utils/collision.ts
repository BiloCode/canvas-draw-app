import { Position } from "../types/position";
import { BoxPoints } from "../types/box-points";

export const circleCollision = (circle: Position, radius: number, position: Position) => {
  const adyacent = Math.abs(circle.x - position.x);
  const opposite = Math.abs(circle.y - position.y);
  const distance = Math.sqrt(adyacent ** 2 + opposite ** 2);

  return distance - radius < 0;
};

export const rectCollision = (box: BoxPoints, position: Position) => {
  const { x, y } = position;
  const { x1, x2, y1, y2 } = box;

  const collisionVertical = y >= y1 && y <= y2;
  const collisionHorizontal = x >= x1 && x <= x2;

  return collisionVertical && collisionHorizontal;
};

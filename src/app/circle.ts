import PolygonSelect from "./polygon-select";

import { Position } from "./types/position";
import { circleCollision } from "./utils/collision";

class Circle extends PolygonSelect {
  private _radius: number;

  constructor(x: number, y: number, radius: number) {
    super();

    this._radius = radius;
    this._position = {
      x,
      y,
    };
  }

  setPosition(position: Position): void {
    this._position = position;
  }

  get radius() {
    return this._radius;
  }

  getCollisionPoints(position: Position): boolean {
    return circleCollision(this._position, this._radius, position);
  }

  getCollisionElement(position: Position): boolean {
    return circleCollision(this._position, this._radius, position);
  }
}

export default Circle;

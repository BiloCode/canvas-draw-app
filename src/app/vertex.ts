import Polygon from "./polygon";
import { Position } from "./types/position";
import { circleCollision } from "./utils/collision";

class Vertex extends Polygon {
  protected _size: number;

  constructor(x: number, y: number, size: number) {
    super();
    this._size = size;
    this._position = { x, y };
  }

  get size() {
    return this._size;
  }

  setPosition(position: Position): void {
    this._position = position;
  }

  getCollisionElement(position: Position): boolean {
    return circleCollision(this._position, this._size, position);
  }
}

export default Vertex;

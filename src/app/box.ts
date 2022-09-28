import Vertex from "./vertex";
import PolygonSelect from "./polygon-select";

import { BoxBounds } from "./types/bounds";
import { Position } from "./types/position";
import { BoxPoints } from "./types/box-points";
import { rectCollision } from "./utils/collision";
import { SPACE_BOUNDS, VERTEX_SIZE } from "./constants/polygon";
import { IPolygonCordinates } from "./interfaces/i-polygon-coordinates";

class Box extends PolygonSelect implements IPolygonCordinates<BoxPoints> {
  private _bounds: BoxBounds;

  constructor(data: Position & BoxBounds) {
    super();

    this._position = {
      x: data.x,
      y: data.y,
    };

    this._bounds = {
      width: data.width,
      height: data.height,
    };

    this.vertexConfiguration();
  }

  private vertexConfiguration() {
    const { x1, x2, y1, y2 } = this.getCoordsWithSpace();

    this._vertex = [
      new Vertex(x1, y1, VERTEX_SIZE),
      new Vertex(x2, y1, VERTEX_SIZE),
      new Vertex(x1, y2, VERTEX_SIZE),
      new Vertex(x2, y2, VERTEX_SIZE),
    ];
  }

  private vertexPositionUpdate() {
    const { x1, x2, y1, y2 } = this.getCoordsWithSpace();
    const [topLeft, topRight, bottomLeft, bottomRight] = this.vertex;

    topLeft.setPosition({ x: x1, y: y1 });
    topRight.setPosition({ x: x2, y: y1 });
    bottomLeft.setPosition({ x: x1, y: y2 });
    bottomRight.setPosition({ x: x2, y: y2 });

    this._vertex = [topLeft, topRight, bottomLeft, bottomRight];
  }

  get bounds() {
    return { ...this._bounds } as const;
  }

  get text() {
    return this._text;
  }

  getCoords(): BoxPoints {
    const { x, y } = this.position;
    const { height, width } = this.bounds;

    return {
      x1: x,
      x2: x + width,
      y1: y,
      y2: y + height,
    };
  }

  getCoordsWithSpace(): BoxPoints {
    const { x1, x2, y1, y2 } = this.getCoords();

    return {
      x1: x1 - SPACE_BOUNDS,
      x2: x2 + SPACE_BOUNDS,
      y1: y1 - SPACE_BOUNDS,
      y2: y2 + SPACE_BOUNDS,
    };
  }

  getCoordsWithVertexSpace(): BoxPoints {
    const { x1, x2, y1, y2 } = this.getCoordsWithSpace();

    return {
      x1: x1 - VERTEX_SIZE / 2,
      x2: x2 + VERTEX_SIZE / 2,
      y1: y1 - VERTEX_SIZE / 2,
      y2: y2 + VERTEX_SIZE / 2,
    };
  }

  setPosition({ x, y }: Position): void {
    this._position = {
      x: x - this._bounds.width / 2,
      y: y - this._bounds.height / 2,
    };

    this.vertexPositionUpdate();
  }

  getCollisionPoints(position: Position): boolean {
    return rectCollision(this.getCoordsWithVertexSpace(), position);
  }

  getCollisionElement(position: Position): boolean {
    return rectCollision(this.getCoords(), position);
  }
}

export default Box;

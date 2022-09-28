import Vertex from "./vertex";
import Polygon from "./polygon";

import { Position } from "./types/position";
import { generateRandomId } from "./utils/uuid";

abstract class PolygonSelect extends Polygon {
  protected _id: string;
  protected _name: string;
  protected _text: string;
  protected _vertex: Vertex[];

  constructor() {
    super();
    this._text = "";
    this._name = "Element";
    this._id = generateRandomId();
  }

  abstract getCollisionPoints(position: Position): boolean;

  setText(text: string) {
    this._text = text;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get text() {
    return this._text;
  }

  get vertex() {
    return this._vertex;
  }
}

export default PolygonSelect;

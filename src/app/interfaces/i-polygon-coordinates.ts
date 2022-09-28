export interface IPolygonCordinates<T> {
  getCoords(): T;
  getCoordsWithSpace(): T;
  getCoordsWithVertexSpace(): T;
}

import PolygonSelect from "./polygon-select";

abstract class PolygonDraw {
  abstract polygon: PolygonSelect;

  abstract drawText(ctx: CanvasRenderingContext2D): void;
  abstract drawVertex(ctx: CanvasRenderingContext2D): void;
  abstract drawElement(ctx: CanvasRenderingContext2D): void;
  abstract drawSelectArea(ctx: CanvasRenderingContext2D): void;
}

export default PolygonDraw;

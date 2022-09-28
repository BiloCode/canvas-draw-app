import Box from "./box";
import PolygonDraw from "./polygon-draw";

import { C_SELECT_AREA } from "./constants/colors";

class BoxDraw extends PolygonDraw {
  constructor(private readonly box: Box) {
    super();
  }

  get polygon() {
    return this.box;
  }

  drawSelectArea(ctx: CanvasRenderingContext2D) {
    const { x1, x2, y1, y2 } = this.box.getCoordsWithSpace();

    ctx.fillStyle = C_SELECT_AREA;
    ctx.fillRect(x1, y1, Math.abs(x1 - x2), Math.abs(y1 - y2));
  }

  drawElement(ctx: CanvasRenderingContext2D) {
    const { position, bounds } = this.box;

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";

    ctx.fillRect(position.x, position.y, bounds.width, bounds.height);
    ctx.strokeRect(position.x, position.y, bounds.width, bounds.height);
  }

  drawVertex(ctx: CanvasRenderingContext2D) {
    const { vertex } = this.box;

    ctx.strokeStyle = "gray";

    vertex.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.position.x, point.position.y, point.size, 0, Math.PI * 2);
      ctx.stroke();
    });
  }

  drawText(ctx: CanvasRenderingContext2D) {
    const { position, text } = this.box;

    ctx.fillStyle = "black";
    ctx.fillText(text, position.x + 4, position.y + 12);
  }
}

export default BoxDraw;

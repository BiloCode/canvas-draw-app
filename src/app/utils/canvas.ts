export const getCanvasContext = (canvas: HTMLCanvasElement) => canvas.getContext("2d");

export const getCanvasBounds = (canvas: HTMLCanvasElement) => ({
  clientWidth: canvas.clientWidth,
  clientHeight: canvas.clientHeight,
});

export const getCanvasCoords = (
  canvas: HTMLCanvasElement,
  mouseX: number,
  mouseY: number
) => ({
  y: mouseY - canvas.offsetTop,
  x: mouseX - canvas.offsetLeft,
});

import Vertex from "../vertex";
import DrawBox from "../box-draw";

import findIndex from "lodash/findIndex";
import findLastIndex from "lodash/findLastIndex";

export const getVertexCollision = (vertex: Vertex[], x: number, y: number) => {
  const index = findIndex(vertex, (v) => v.getCollisionElement({ x, y }));

  if (index !== -1) {
    return vertex[index];
  }

  return null;
};

export const getBoxCollision = (boxes: DrawBox[], x: number, y: number) => {
  const index = findLastIndex(boxes, (v) => v.polygon.getCollisionPoints({ x, y }));

  if (index !== -1) {
    return boxes[index].polygon;
  }

  return null;
};

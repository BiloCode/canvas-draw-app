import isEqual from "lodash/isEqual";

export const isEquals = (objectA: unknown, objectB: unknown) => {
  return isEqual(objectA, objectB);
};

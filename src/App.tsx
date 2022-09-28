import { useSetRecoilState, useRecoilValue } from "recoil";
import { MouseEventHandler, useEffect, useLayoutEffect, useRef, useState } from "react";

import styles from "./styles.module.scss";

import Box from "./app/box";
import Vertex from "./app/vertex";
import PolygonDraw from "./app/box-draw";
import PolygonSelect from "./app/polygon-select";
import MainLayout from "./components/main-layout";
import CreateTextBox from "./components/create-text-box";

import useCursor from "./hooks/use-cursor";
import useRefState from "./hooks/use-ref-state";

import { Position } from "./app/types/position";

import { inputActiveAtom } from "./store/global-input";

import { C_SELECT_AREA } from "./app/constants/colors";
import { SNAP_GRID_SIZE } from "./app/constants/canvas";
import { BOX_DEFAULT_BOUNDS } from "./app/constants/polygon";
import { MIN_MOUSE_COORDS, MOUSE_CLICK } from "./app/constants/mouse";

import { isNull } from "./app/utils/types-validators";
import { getBoxCollision, getVertexCollision } from "./app/utils/collision-find";
import { getCanvasBounds, getCanvasContext, getCanvasCoords } from "./app/utils/canvas";

type Nullable<T> = T | null;

function App() {
  const elements = useRef<PolygonDraw[]>([]);
  const canvas = useRef<HTMLCanvasElement>(null);

  const [dragElementTimer, setDragElementTimer] = useRefState<number>(-1);

  const [mouseCoords, setMouseCoords] = useRefState<Position>({ x: 0, y: 0 });
  const [mouseStartCoords, setMouseStartCoords] = useRefState<Position>({ x: 0, y: 0 });

  const [dragAction, setDragAction] = useRefState<boolean>(false);
  const [dragElement, setDragElement] = useRefState<Nullable<PolygonSelect>>(null);
  const [editElement, setEditElement] = useRefState<Nullable<PolygonSelect>>(null);

  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [selectionElement, setSelectionElement] = useState<Nullable<PolygonSelect>>(null);

  const { resetCursor, resizeCursor } = useCursor();

  const inputActive = useRecoilValue(inputActiveAtom);
  const setInputActive = useSetRecoilState(inputActiveAtom);

  const canvasSizeConfiguration = () => {
    const bounds = getCanvasBounds(canvas.current!);
    canvas.current!.width = bounds.clientWidth;
    canvas.current!.height = bounds.clientHeight;
  };

  const getBoxDefaultBounds = () => ({
    width: BOX_DEFAULT_BOUNDS.WIDTH,
    height: BOX_DEFAULT_BOUNDS.HEIGHT,
  });

  const resetPolygonVertexDefaultState = (vertex: Vertex[]) => {
    vertex.forEach((v) => v.setInteractionState("Drawed"));
  };

  const resetElementsDefaultState = () => {
    elements.current.forEach((v) => v.polygon.setInteractionState("Drawed"));
  };

  const resetDragBoxElement = () => {
    dragElement()?.setInteractionState("Drawed");

    if (dragElementTimer() !== -1) {
      clearTimeout(dragElementTimer());
    }

    setDragAction(false);
    setDragElement(null);
    setDragElementTimer(-1);
  };

  const createPolygonInCanvas = (x: number, y: number) => {
    const { width, height } = getBoxDefaultBounds();

    const box = new Box({ width, height, x: x - width / 2, y: y - height / 2 });
    const drawBox = new PolygonDraw(box);

    elements.current.push(drawBox);
  };

  const selectionVertextCollision = () => {
    if (!selectionElement?.select) return;

    const { x, y } = mouseCoords();
    const vertextCollided = getVertexCollision(selectionElement.vertex, x, y);

    if (isNull(vertextCollided)) {
      resetCursor();
      resetPolygonVertexDefaultState(selectionElement.vertex);
      return;
    }

    resizeCursor();
    resetPolygonVertexDefaultState(selectionElement.vertex);
    vertextCollided.setInteractionState("Hover");
  };

  const selectElement = () => {
    selectionElement!.setInteractionState("Select");
  };

  const mousePositionGreaterThanMinCoords = (xx: number, yy: number) => {
    const { x, y } = mouseStartCoords();
    return Math.abs(xx - x) <= MIN_MOUSE_COORDS || Math.abs(yy - y) <= MIN_MOUSE_COORDS;
  };

  const onContextMenu: MouseEventHandler<HTMLCanvasElement> = (ev) => ev.preventDefault();

  const onMouseLeave: MouseEventHandler<HTMLCanvasElement> = (ev) => {
    setMouseCoords({ x: 0, y: 0 });
    setMouseStartCoords({ x: 0, y: 0 });
    resetDragBoxElement();
  };

  const onMouseMove: MouseEventHandler<HTMLCanvasElement> = (ev) => {
    const { x, y } = getCanvasCoords(canvas.current!, ev.clientX, ev.clientY);

    if (dragAction() && !isNull(dragElement())) {
      dragElement()?.setPosition({ x, y });
      return;
    }

    setMouseCoords({ x, y });
    setSelectionElement(getBoxCollision(elements.current, x, y));
    selectionVertextCollision();
  };

  const onMouseUp: MouseEventHandler<HTMLCanvasElement> = (ev) => {
    if (ev.button !== MOUSE_CLICK.LEFT) {
      return;
    }

    resetDragBoxElement();

    const { x, y } = getCanvasCoords(canvas.current!, ev.clientX, ev.clientY);

    if (isNull(selectionElement)) {
      // if (mousePositionGreaterThanMinCoords(x, y)) {
      //   createPolygonInCanvas(x, y);
      // }

      setMouseStartCoords({ x: 0, y: 0 });
      return;
    }

    resetElementsDefaultState();
    selectElement();
  };

  const onMouseDown: MouseEventHandler<HTMLCanvasElement> = (ev) => {
    if (ev.button !== MOUSE_CLICK.LEFT) {
      return;
    }

    const { x, y } = getCanvasCoords(canvas.current!, ev.clientX, ev.clientY);

    const timeout = setTimeout(() => {
      const polygonCollided = getBoxCollision(elements.current, x, y);

      setDragAction(true);

      if (!isNull(polygonCollided)) {
        resetElementsDefaultState();
        polygonCollided.setInteractionState("Select");
        setDragElement(polygonCollided);
      }
    }, 100);

    setMouseStartCoords({ x, y });
    setDragElementTimer(timeout);
  };

  const onDoubleClick: MouseEventHandler<HTMLCanvasElement> = (ev) => {
    const { x, y } = getCanvasCoords(canvas.current!, ev.clientX, ev.clientY);
    const polygonCollided = getBoxCollision(elements.current, x, y);

    if (!isNull(polygonCollided)) {
      setInputActive(true);
      setEditElement(polygonCollided);
    }
  };

  // DRAWS

  const cleanDrawArea = () => {
    const bounds = getCanvasBounds(canvas.current!);
    ctx!.clearRect(0, 0, bounds.clientWidth, bounds.clientHeight);
  };

  const drawSnapGrid = () => {
    if (!ctx) return;

    const bounds = getCanvasBounds(canvas.current!);

    ctx.strokeStyle = "rgba(0,0,0,0.05)";

    for (let yy = 0; yy < bounds.clientHeight; ) {
      for (let xx = 0; xx < bounds.clientWidth; ) {
        ctx.strokeRect(xx, yy, SNAP_GRID_SIZE.x, SNAP_GRID_SIZE.y);
        xx += SNAP_GRID_SIZE.x;
      }
      yy += SNAP_GRID_SIZE.y;
    }
  };

  const drawSelectionArea = () => {
    if (!ctx) return;

    const { x, y } = mouseCoords();
    const { x: xstart, y: ystart } = mouseStartCoords();

    ctx.fillStyle = C_SELECT_AREA;
    ctx.fillRect(xstart, ystart, x - xstart, y - ystart);
  };

  const mainLoop = () => {
    if (!ctx) return -1;

    cleanDrawArea();
    drawSnapGrid();

    elements.current.forEach((element) => {
      if (element.polygon.select) element.drawSelectArea(ctx);

      element.drawElement(ctx);

      if (element.polygon.text !== "") element.drawText(ctx);
      if (element.polygon.select) element.drawVertex(ctx);
    });

    if (dragAction() && isNull(dragElement())) {
      drawSelectionArea();
    }

    return requestAnimationFrame(mainLoop);
  };

  useLayoutEffect(() => {
    if (canvas.current) {
      canvasSizeConfiguration();
      setContext(getCanvasContext(canvas.current));
    }
  }, []);

  useLayoutEffect(() => {
    window.addEventListener("resize", () => {
      canvasSizeConfiguration();
    });

    return () => window.removeEventListener("resize", () => canvasSizeConfiguration());
  }, []);

  useEffect(() => {
    if (ctx) {
      const loopId = mainLoop();
      return () => cancelAnimationFrame(loopId);
    }
  }, [ctx]);

  return (
    <MainLayout elementList={elements.current.map((v) => v.polygon)}>
      <canvas
        ref={canvas}
        className={styles.canvas}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
      />
      {inputActive && editElement() && (
        <CreateTextBox
          defaultValue={editElement()?.text}
          onCancel={() => {
            setInputActive(false);
          }}
          onValueChange={(newValue) => {
            setInputActive(false);
            editElement()?.setText(newValue);
          }}
        />
      )}
    </MainLayout>
  );
}

export default App;

import { atom } from "recoil";

type Cursor = "auto" | "ns-resize" | "nesw-resize" | "nwse-resize";

export const cursorAtom = atom<Cursor>({ key: "draw-app-cursor", default: "auto" });

import { atom } from "recoil";

export const inputActiveAtom = atom<boolean>({
  key: "draw-app-input-active",
  default: false,
});

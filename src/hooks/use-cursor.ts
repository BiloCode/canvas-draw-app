import { useRecoilState } from "recoil";
import { cursorAtom } from "../store/global-config";

const useCursor = () => {
  const [cursor, setCursor] = useRecoilState(cursorAtom);

  const resetCursor = () => setCursor("auto");
  const resizeCursor = () => setCursor("ns-resize");

  return {
    cursor,
    resizeCursor,
    resetCursor,
  };
};

export default useCursor;

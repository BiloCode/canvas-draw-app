import { useEffect } from "react";

type Callback = (key: string) => void;

const useKeyboard = (callback: Callback) => {
  const onKeyDown = (ev: KeyboardEvent) => {
    callback(ev.key);
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
};

export default useKeyboard;

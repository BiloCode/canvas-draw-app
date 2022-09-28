import { MutableRefObject, useRef } from "react";

type HookReturn<T = object> = [() => T, (newValue: T) => void, MutableRefObject<T>];

const useRefState = <T = object>(defaultValue: T): HookReturn<T> => {
  const refValue = useRef<T>(defaultValue);

  const getValue = () => refValue.current;
  const setValue = (newValue: T) => (refValue.current = newValue);

  return [getValue, setValue, refValue];
};

export default useRefState;

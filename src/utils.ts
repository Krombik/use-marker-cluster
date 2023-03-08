import { useRef } from "react";

/** @internal */
export const useConst = <T>(getValue: () => T) => {
  const r = useRef<T>();

  return r.current || (r.current = getValue());
};

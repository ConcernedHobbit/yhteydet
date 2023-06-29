import { useRef } from "react";
import { createRandom } from "../utils";

export const useSeededRandom = (seed: string) => {
  const ref = useRef(createRandom(seed));
  return ref.current;
};

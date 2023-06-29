import { createRandom } from "./random";

export function shuffle<T>(items: Array<T>, seed?: string) {
  const sortFunction = seed ? createRandom(seed) : Math.random;

  return items
    .map((value) => ({ value, sort: sortFunction() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

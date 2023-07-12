import { Connections, Word } from "./GameContext";

export const emojis = ["🟦", "🟨", "🟩", "🟪"];
export const createEmojiChart = (
  triedCombinations: Array<Array<Word>>,
  connections?: Connections
) => {
  const ids = [
    ...new Set(triedCombinations.flatMap((words) => words.map((w) => w.id))),
  ];
  const sortedIds = ids.sort((a, b) => a.localeCompare(b));
  const lookup = Object.fromEntries(sortedIds.map((k, i) => [k, emojis[i]]));

  const emojiChart = triedCombinations
    .map((combination) => combination.map(({ id }) => lookup[id]).join(""))
    .join("\n");
  const legendString =
    connections &&
    Object.keys(lookup)
      .map((key) => `${lookup[key]} ${connections[key].explanation}`)
      .join("\n");

  return {
    emojiChart,
    legendString,
  };
};

import { useContext } from "react";
import { GameContext, Word } from "../utils/GameContext";
import { invertColor, stringToColour } from "../utils/";

export interface WordDisplayProps {
  word: Word;
  colored: boolean;
}

function WordDisplay({ word, colored }: WordDisplayProps) {
  const game = useContext(GameContext);

  const classes = [
    "word",
    game.selectedWords.includes(word) && "word--selected",
    colored && "word--inactive",
  ]
    .filter(Boolean)
    .join(" ");
  const bgHex = stringToColour(word.id);

  return (
    <div
      className={classes}
      style={
        colored
          ? ({
              "--bg-color": bgHex,
              "--color": invertColor(bgHex),
            } as React.CSSProperties)
          : undefined
      }
      key={word.word}
      onClick={() => game.selectWord(word)}
    >
      <span
        style={
          word.word.length >= 8 && !word.word.includes(" ")
            ? {
                fontSize: "12px",
              }
            : undefined
        }
      >
        {word.word}
      </span>
    </div>
  );
}

export default WordDisplay;

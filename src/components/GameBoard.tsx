import { useContext } from "react";
import { GameContext } from "../utils/GameContext";
import { WordDisplay } from ".";

function GameBoard() {
  const { words, solvedIds, tries } = useContext(GameContext);
  const isLost = tries === 0;

  return (
    <div className="board">
      {words?.map((word) => {
        const isColored = solvedIds.includes(word.id) || isLost;
        return <WordDisplay colored={isColored} word={word} key={word.word} />;
      })}
      {!words &&
        new Array(16)
          .fill(0)
          .map((_, i) => <div key={i} className="word word--skeleton"></div>)}
    </div>
  );
}

export default GameBoard;

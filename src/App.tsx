import { useState } from "react";
import "./App.css";

import { GameContext, Id, Word } from "./GameContext";
import { WordDisplay, Explanations, LifeDisplay } from "./components";
import { useConnections } from "./hooks/useConnections";
import { createEmojiChart } from "./utils";

function App() {
  const [selectedWords, setSelectedWords] = useState<Array<Word>>([]);
  const [solvedIds, setSolvedIds] = useState<Array<Id>>([]);
  const [tries, setTries] = useState<number>(4);
  const [triedCombinations, setTriedCombinations] = useState<
    Array<Array<Word>>
  >([]);

  const isWon = tries > 0 && solvedIds.length === 4;
  const isLost = tries === 0;
  const isEnded = isWon || isLost;

  const { loading, connections, words, refreshConnectionsAndWords } =
    useConnections({
      name: "connections",
    });

  // Start a new game
  const newGame = () => {
    setSolvedIds([]);
    setSelectedWords([]);
    setTriedCombinations([]);
    setTries(4);

    refreshConnectionsAndWords();
  };

  // Callback handler for when a word is selected
  const selectWord = (word: Word) => {
    if (tries === 0 || isWon || solvedIds.includes(word.id)) {
      return;
    }

    if (selectedWords.includes(word)) {
      setSelectedWords((selected) => selected.filter((w) => w !== word));
      return;
    }

    if (selectedWords.length < 4) {
      setSelectedWords((selected) => selected.concat(word));
    }
  };

  // Callback handler for when the user confirms a selection of 4 words
  const confirmSelection = () => {
    const ids = selectedWords.map((word) => word.id);
    setTriedCombinations((tried) => tried.concat([selectedWords]));

    if (new Set(ids).size === 1) {
      setSolvedIds((s) => s.concat(ids[0]));
      setSelectedWords([]);
      return;
    }

    setSelectedWords([]);
    setTries((t) => t - 1);
    return;
  };

  const shareGame = () => {
    const { emojiChart, legendString } = createEmojiChart(
      triedCombinations,
      connections
    );
    const header = `Yhteydet (satunnainen)`;
    const footer = `github.com/ConcernedHobbit/yhteydet`;

    const shareText = `${header}\n\n${emojiChart}\n\n${legendString}\n\n${footer}`;
    navigator?.clipboard?.writeText(shareText);
  };

  return (
    <GameContext.Provider
      value={{
        selectedWords,
        solvedIds,
        connections,
        selectWord,
      }}
    >
      <h1>Yhteydet</h1>

      <div className="board">
        {words?.map((word) => {
          const isColored = solvedIds.includes(word.id) || isLost;
          return (
            <WordDisplay colored={isColored} word={word} key={word.word} />
          );
        })}
        {loading &&
          new Array(16)
            .fill(0)
            .map((_, i) => <div key={i} className="word word--skeleton"></div>)}
      </div>

      <div className="controls">
        {!isEnded && <LifeDisplay lives={tries} />}
        {!isEnded && (
          <button
            disabled={selectedWords.length !== 4}
            onClick={confirmSelection}
          >
            Kokeile
          </button>
        )}
        {isEnded && <button onClick={shareGame}>Jaa</button>}
        {isEnded && <button onClick={newGame}>Uusi peli</button>}
      </div>

      <Explanations showAll={isLost} />
    </GameContext.Provider>
  );
}

export default App;

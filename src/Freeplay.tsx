import { useState } from "react";
import "./Game.css";

import { GameContext, Id, Word } from "./utils/GameContext";
import { Explanations, LifeDisplay } from "./components";
import { useConnections } from "./hooks/useConnections";
import { createEmojiChart, randomWords } from "./utils";
import Tutorial from "./components/Tutorial";
import GameBoard from "./components/GameBoard";
import { copyToClipboard } from "./utils/clipboard";

function App() {
  const [selectedWords, setSelectedWords] = useState<Array<Word>>([]);
  const [solvedIds, setSolvedIds] = useState<Array<Id>>([]);
  const [tries, setTries] = useState<number>(4);
  const [triedCombinations, setTriedCombinations] = useState<
    Array<Array<Word>>
  >([]);

  const [seed, setSeed] = useState(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    return params.get("seed") ?? randomWords().join("-");
  });

  const isWon = tries > 0 && solvedIds.length === 4;
  const isLost = tries === 0;
  const isEnded = isWon || isLost;

  const { connections, words, refreshConnectionsAndWords } = useConnections({
    name: "connections",
    seed,
  });

  // Start a new game
  const newGame = () => {
    setSolvedIds([]);
    setSelectedWords([]);
    setTriedCombinations([]);
    setTries(4);
    // This might not be best practice but heck it.
    setSeed(randomWords().join("-"));

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

    setTries((t) => t - 1);
    return;
  };

  const shareGame = () => {
    const { emojiChart } = createEmojiChart(triedCombinations, connections);
    const url = `yhteydet.äää.fi/?seed=${seed}`;

    const shareText = `${emojiChart}\n\n${url}`;
    copyToClipboard(shareText);
  };

  return (
    <GameContext.Provider
      value={{
        selectedWords,
        solvedIds,
        connections,
        selectWord,
        tries,
        words,
      }}
    >
      <div className="header">
        <h1>Yhteydet</h1>
        <span
          className="seed"
          onClick={() =>
            copyToClipboard(`https://yhteydet.äää.fi/?seed=${seed}`)
          }
        >
          {seed}
        </span>
      </div>

      <GameBoard />

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

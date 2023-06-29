import { useEffect, useMemo, useState } from "react";
import "./App.css";

import { Connections, GameContext, Id, Word } from "./GameContext";
import WordDisplay from "./WordDisplay";
import Explanations from "./Explanations";
import LifeDisplay from "./LifeDisplay";

function App() {
  const [selectedWords, setSelectedWords] = useState<Array<Word>>([]);
  const [solvedIds, setSolvedIds] = useState<Array<Id>>([]);
  const [tries, setTries] = useState<number>(4);
  const isWon = tries > 0 && solvedIds.length === 4;
  const isLost = tries === 0;

  const [connections, setConnections] = useState<undefined | Connections>();
  const words: Word[] = useMemo(() => {
    if (!connections) {
      return [];
    }

    const keys = Object.keys(connections);
    const unshuffled = keys.flatMap((key) =>
      connections[key].words.map((word) => ({ word, id: key }))
    );
    return unshuffled
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }, [connections]);

  useEffect(() => {
    import("./assets/connections.json").then((rawData) => {
      const data = rawData.default;

      const keys = Object.keys(data) as Array<keyof typeof data>;
      const shuffledKeys = keys
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

      let selectedKeys = [];
      for (let i = 0; i < 4; i++) {
        let nextKey = shuffledKeys.pop();
        if (nextKey === undefined) return;
        selectedKeys.push(nextKey);
      }

      let connections: Connections = {};
      selectedKeys.forEach(
        (key) => (connections[key] = data[key as keyof typeof data])
      );

      setConnections(connections);
    });
  }, []);

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

  const confirmSelection = () => {
    const ids = selectedWords.map((word) => word.id);

    if (new Set(ids).size === 1) {
      setSolvedIds((s) => s.concat(ids[0]));
      setSelectedWords([]);
      return;
    }

    setSelectedWords([]);
    setTries((t) => t - 1);
    return;
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
      <>
        <h1>Yhteydet</h1>

        <div className="board">
          {words?.map((word) => {
            const isColored = solvedIds.includes(word.id) || isLost;
            return (
              <WordDisplay colored={isColored} word={word} key={word.word} />
            );
          })}
          {!words &&
            new Array(16)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="word word--skeleton"></div>
              ))}
        </div>

        <div className="controls">
          <LifeDisplay lives={tries} />
          <button
            className="submit"
            disabled={selectedWords.length !== 4}
            onClick={() => confirmSelection()}
          >
            Kokeile
          </button>
        </div>

        <Explanations showAll={isLost} />
      </>
    </GameContext.Provider>
  );
}

export default App;

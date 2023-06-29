import { useEffect, useMemo, useState } from "react";
import "./App.css";

import { Connections, GameContext, Id, Word } from "./GameContext";
import { stringToColour } from "./utils";
import WordDisplay from "./WordDisplay";

function App() {
  const [selectedWords, setSelectedWords] = useState<Array<Word>>([]);
  const [solvedIds, setSolvedIds] = useState<Array<Id>>([]);
  const [tries, setTries] = useState<number>(4);
  const hasWon = tries > 0 && solvedIds.length === 4;

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
    if (tries === 0 || hasWon || solvedIds.includes(word.id)) {
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

  if (!connections) {
    return (
      <>
        <h1>Yhteydet</h1>

        <div className="board">
          {new Array(16).fill(0).map((_, i) => (
            <div key={i} className="word word--skeleton"></div>
          ))}
        </div>
        <button className="submit">Kokeile</button>
        <p>Haetaan yhteyksiä...</p>
        <div className="explanations"></div>
      </>
    );
  }

  return (
    <GameContext.Provider
      value={{
        selectedWords,
        solvedIds,
        selectWord,
      }}
    >
      <>
        <h1>Yhteydet</h1>

        <div className="board">
          {words.map((word) => {
            const isColored = solvedIds.includes(word.id) || tries === 0;
            return (
              <WordDisplay colored={isColored} word={word} key={word.word} />
            );
          })}
        </div>

        <button
          className="submit"
          disabled={selectedWords.length !== 4}
          onClick={() => confirmSelection()}
        >
          Kokeile
        </button>

        <p className="tries">
          {tries > 0 && `Yrityksiä jäljellä: ${tries}`}
          {tries === 0 && `Hävisit pelin.`}
        </p>
        <div className="explanations">
          {(tries === 0 ? Object.keys(connections) : solvedIds).map((id) => {
            const words = connections[id].words;
            const explanation = connections[id].explanation;
            return (
              <div key={id} className="explanation">
                <i
                  className="highlight"
                  style={
                    {
                      "--highlight": stringToColour(id),
                    } as React.CSSProperties
                  }
                />
                <span>
                  {words.join(", ")}: {explanation}
                </span>
              </div>
            );
          })}
        </div>
      </>
    </GameContext.Provider>
  );
}

export default App;

import { useEffect, useMemo, useState } from "react";
import "./App.css";

import { Connections, GameContext, Id, Word } from "./GameContext";
import { WordDisplay, Explanations, LifeDisplay } from "./components";
import { shuffle } from "./utils";

const CONNECTIONS = 4;
const WORDS_PER_CONNECTION = 4;

function App() {
  const [connections, setConnections] = useState<undefined | Connections>();
  const [words, setWords] = useState<Array<Word>>([]);
  const [selectedWords, setSelectedWords] = useState<Array<Word>>([]);
  const [solvedIds, setSolvedIds] = useState<Array<Id>>([]);
  const [tries, setTries] = useState<number>(4);

  const isWon = tries > 0 && solvedIds.length === 4;
  const isLost = tries === 0;

  // Load 4 random connections from a JSON file
  useEffect(() => {
    import("./assets/connections.json").then((rawData) => {
      const data = rawData.default;

      const shuffledKeys = shuffle(
        Object.keys(data) as Array<keyof typeof data>
      );

      const connections: Connections = {};
      const rawWords: Array<string> = [];

      while (rawWords.length < CONNECTIONS * WORDS_PER_CONNECTION) {
        const nextKey = shuffledKeys.pop();

        if (!nextKey) {
          console.error("Ran out of keys while trying to populate connections");
          return;
        }

        const connection = data[nextKey];
        const connectionWords = shuffle(connection.words);
        const nextWords = [];

        let notEnoughWords = false;
        while (nextWords.length < WORDS_PER_CONNECTION) {
          const nextWord = connectionWords.pop();

          // We should gracefully continue to the next connection if we cannot
          // provide enough words from the current connection (due to word conflicts)
          if (!nextWord) {
            notEnoughWords = true;
            break;
          }

          // We should not have duplicate words in the entire set
          if (rawWords.includes(nextWord)) {
            continue;
          }

          nextWords.push(nextWord);
        }

        if (notEnoughWords) {
          continue;
        }

        // Add connection to set and its words to check list
        connections[nextKey] = {
          ...connection,
          words: nextWords,
        };
        rawWords.push(...nextWords);
      }

      const words: Array<Word> = Object.keys(connections).flatMap((key) =>
        connections[key].words.map((word) => ({ word, id: key }))
      );

      setConnections(connections);
      setWords(shuffle(words));
    });
  }, []);

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
            .map((_, i) => <div key={i} className="word word--skeleton"></div>)}
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
    </GameContext.Provider>
  );
}

export default App;

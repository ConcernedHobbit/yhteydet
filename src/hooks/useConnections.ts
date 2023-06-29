import { useCallback, useEffect, useMemo, useState } from "react";
import { Connections, Word } from "../GameContext";
import { shuffle } from "../utils";

export interface ConnectionsProps {
  /**
   * Name of the file to be loaded.
   * The path resolved from this is src/assets/[name].json.
   */
  name: string;
  /**
   * Amount of connections to load.
   * After hook is initialized, this can be changed with the return value `setAmountConnections`.
   */
  connections?: number;
  /**
   * Amount of words per connection to load.
   * After hook is initialized, this can be changed with the return value `setWordsPerConnection`.
   */
  wordsPerConnection?: number;
}

export const useConnections = ({
  name,
  connections: numConnections = 4,
  wordsPerConnection: numWords = 4,
}: ConnectionsProps) => {
  const [data, setData] = useState<Connections>();
  const loading = useMemo(() => data === undefined, [data]);

  const [amountConnections, setAmountConnections] = useState(numConnections);
  const [wordsPerConnection, setWordsPerConnection] = useState(numWords);

  const [connections, setConnections] = useState<Connections>({});
  const [words, setWords] = useState<Array<Word>>([]);

  // Import connections to state from specified path
  useEffect(() => {
    import(`../assets/${name}.json`).then((rawData) =>
      setData(rawData.default)
    );
  }, []);

  const refreshConnectionsAndWords = useCallback(() => {
    if (!data) {
      return;
    }

    const shuffledKeys = shuffle(Object.keys(data) as Array<keyof typeof data>);

    const connections: Connections = {};
    const rawWords: Array<string> = [];

    while (rawWords.length < amountConnections * wordsPerConnection) {
      const nextKey = shuffledKeys.pop();

      if (!nextKey) {
        console.error("Ran out of keys while trying to populate connections");
        return;
      }

      const connection = data[nextKey];
      const connectionWords = shuffle(connection.words);
      const nextWords = [];

      let notEnoughWords = false;
      while (nextWords.length < wordsPerConnection) {
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
  }, [data, setConnections, setWords]);

  useEffect(refreshConnectionsAndWords, [
    amountConnections,
    wordsPerConnection,
  ]);
  useEffect(refreshConnectionsAndWords, [data]);

  return {
    loading,
    connections,
    words,
    refreshConnectionsAndWords,
    setAmountConnections,
    setWordsPerConnection,
  };
};
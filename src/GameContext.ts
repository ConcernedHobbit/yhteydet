import { createContext } from "react";

export type Id = string;

export type Connections = {
  [key: Id]: {
    words: Array<string>;
    explanation: string;
  };
};
export interface Word {
  id: Id;
  word: string;
}

export interface GameContextProps {
  connections?: Connections;
  words?: Array<Word>;
  selectedWords: Array<Word>;
  selectWord: (word: Word) => void;
  solvedIds: Array<Id>;
}

export const GameContext = createContext<GameContextProps>({
  selectWord: () => {},
  selectedWords: [],
  solvedIds: [],
});

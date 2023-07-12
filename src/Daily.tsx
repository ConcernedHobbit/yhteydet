import { useMemo, useState } from "react";
import { GameContext, Id, Word } from "./utils/GameContext";
import { useConnections } from "./hooks/useConnections";
import GameBoard from "./components/GameBoard";
import { Explanations, LifeDisplay } from "./components";
import { createEmojiChart } from "./utils";
import { copyToClipboard } from "./utils/clipboard";
import { Link } from "react-router-dom";

function Daily() {
  const now = new Date();
  const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

  const [selectedWords, setSelectedWords] = useState<Array<Word>>([]);
  // TODO: Dedupe JSON logic
  const [solvedIds, setSolvedIds] = useState<Array<Id>>(() => {
    const saved = localStorage.getItem(`solved-${today}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        return [];
      }
    }
    return [];
  });
  const [tries, setTries] = useState<number>(() => {
    const saved = localStorage.getItem(`tries-${today}`);
    if (saved) return parseInt(saved);
    return 4;
  });
  const [triedCombinations, setTriedCombinations] = useState<
    Array<Array<Word>>
  >(() => {
    const saved = localStorage.getItem(`combos-${today}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        return [];
      }
    }
    return [];
  });

  const isWon = tries > 0 && solvedIds.length === 4;
  const isLost = tries === 0;
  const isEnded = isWon || isLost;

  const selectWord = (word: Word) => {
    if (isEnded || solvedIds.includes(word.id)) {
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

  // TODO: Dedupe logic
  const confirmSelection = () => {
    const ids = selectedWords.map((word) => word.id);
    setTriedCombinations((tried) => {
      const newTried = tried.concat(selectedWords);
      localStorage.setItem(`combos-${today}`, JSON.stringify(newTried));
      return newTried;
    });

    if (new Set(ids).size === 1) {
      setSolvedIds((s) => {
        const newSolved = s.concat(ids[0]);
        localStorage.setItem(`solved-${today}`, JSON.stringify(newSolved));
        return newSolved;
      });
      setSelectedWords([]);
      return;
    }

    setTries((t) => {
      const newTries = t - 1;
      localStorage.setItem(`tries-${today}`, newTries.toString());
      return newTries;
    });
    return;
  };

  const shareGame = () => {
    const { emojiChart } = createEmojiChart(triedCombinations, connections);
    const url = `yhteydet.äää.fi`;

    const shareText = `Yhteydet ${today}\n${emojiChart}\n\nPelaa: ${url}`;
    copyToClipboard(shareText);
  };

  const { loading, error, connections, words } = useConnections({
    name: "daily",
    key: today,
  });
  const noDailySet = useMemo(
    () => error || (!loading && !words),
    [loading, error, words]
  );

  return (
    <GameContext.Provider
      value={{
        selectedWords,
        solvedIds,
        connections,
        selectWord,
        words,
        tries,
      }}
    >
      <div className="header">
        <h1>Yhteydet</h1>
        {!noDailySet && <span>päivän yhteydet</span>}
      </div>

      {!noDailySet && <GameBoard />}
      {noDailySet && (
        <div>
          <h2>Ei päivän yhteyksiä</h2>
          <p>Pelin pitäjä ei ole asettanut tälle päivälle peliä.</p>
          <p>
            Voit silti vapaapelata rajattomasti. Pahoittelut, palataan huomenna
            asiaan!
          </p>
          <Link to="/vapaapeli">
            <button>Vapaapelaamaan</button>
          </Link>
        </div>
      )}

      {!noDailySet && (
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
          {isEnded && (
            <Link to="/vapaapeli">
              <button>Vapaapeli</button>
            </Link>
          )}
        </div>
      )}

      <Explanations showAll={isLost} />
    </GameContext.Provider>
  );
}

export default Daily;

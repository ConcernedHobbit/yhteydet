import { useContext } from "react";
import { GameContext } from "../GameContext";
import { stringToColour } from "../utils";

function Explanations({ showAll = false }) {
  const { connections, solvedIds } = useContext(GameContext);

  return (
    <div className="explanations">
      {connections &&
        (showAll ? Object.keys(connections) : solvedIds).map((id) => {
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
              <span>{explanation}</span>
            </div>
          );
        })}
    </div>
  );
}

export default Explanations;

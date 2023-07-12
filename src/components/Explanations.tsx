import { useContext } from "react";
import { GameContext } from "../utils/GameContext";
import { stringToColour } from "../utils/";

function Explanations({ showAll = false }) {
  const { connections, solvedIds } = useContext(GameContext);

  return (
    <div className="explanations">
      {connections &&
        (showAll ? Object.keys(connections) : solvedIds).map((id) => {
          const explanation = connections[id]?.explanation;
          if (!explanation) return;

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

function LifeDisplay({ lives = 4 }) {
  return (
    <div className="lives">
      {new Array(4).fill(0).map((_, i) => (
        <div key={i} className={i >= lives ? "life life--lost" : "life"}></div>
      ))}
    </div>
  );
}

export default LifeDisplay;

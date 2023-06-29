function LifeDisplay({ lives = 4 }) {
  return (
    <div className="lives">
      {new Array(lives).fill(0).map((_, i) => (
        <div key={i} className="life"></div>
      ))}
    </div>
  );
}

export default LifeDisplay;

import React, { useState } from "react";

import StartScreen from "./Components/StartCreen";
import WordSafari from "./Components/WordSafari";

function App() {
  const [start, setStart] = useState(false);
  const [level, setLevel] = useState(1);

  const handleStart = () => {
    setStart(true);
  };

  const handleNextLevel = () => {
    setLevel(level + 1);
  };

  const handleRestartGame = () => {
    setLevel(1);
    setStart(false); // Go back to the start screen
  };

  return (
    <div className="app">
      {!start ? (
        <StartScreen onStart={handleStart} />
      ) : (
        <WordSafari
          level={level}
          onNextLevel={handleNextLevel}
          onRestartGame={handleRestartGame}
        />
      )}
    </div>
  );
}

export default App;

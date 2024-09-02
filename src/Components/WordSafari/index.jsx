import { useEffect, useState } from "react";
import "./style.css";
import Modal from "../Modal";

const levels = {
  1: {
    scenario: "Farm",
    objects: [
      { name: "Cow", image: "cow.png", options: ["Cow", "Cat", "Dog"] },
      { name: "Cat", image: "cat.jpeg", options: ["Dog", "Cat", "Cow"] },
      { name: "Tree", image: "tree.png", options: ["Tree", "House", "Sun"] },
      { name: "Goat", image: "Goat.jpeg", options: ["Tree", "Goat", "Chair"] },
    ],
  },
  2: {
    scenario: "Numbers",
    objects: [
      { name: "One", image: "One.png", options: ["One", "Four", "Five"] },
    ],
  },
  // Add more levels and objects here...
};

// Fisher-Yates shuffle algorithm

// Fisher-Yates shuffle algorithm
// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function WordSafari({ level, onNextLevel, onRestartGame }) {
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0);
  const [correct, setCorrect] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shuffledObjects, setShuffledObjects] = useState([]);

  useEffect(() => {
    // Shuffle the objects at the start of the level
    setShuffledObjects(shuffleArray([...levels[level].objects]));
  }, [level]);

  const currentObject = shuffledObjects[currentObjectIndex];

  const handleOptionClick = (option) => {
    if (option === currentObject.name) {
      setCorrect(true);
      setTimeout(() => {
        if (currentObjectIndex < shuffledObjects.length - 1) {
          setCurrentObjectIndex(currentObjectIndex + 1);
        } else {
          if (levels[level + 1]) {
            onNextLevel();
            setCurrentObjectIndex(0); // Reset the object index for the new level
          } else {
            setIsModalOpen(true); // Open the modal when all levels are completed
          }
        }
        setCorrect(null);
      }, 1000);
    } else {
      setCorrect(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRestartGame = () => {
    setIsModalOpen(false);
    onRestartGame();
  };

  return (
    <div className="word-safari">
      <h2>
        Level {level}: {levels[level].scenario}
      </h2>
      {currentObject && (
        <>
          <img
            src={currentObject.image}
            alt={currentObject.name}
            className="object-image"
          />
          <div className="options">
            {currentObject.options.map((option, index) => (
              <button key={index} onClick={() => handleOptionClick(option)}>
                {option}
              </button>
            ))}
          </div>
        </>
      )}
      {correct !== null && (
        <div className={`feedback ${correct ? "correct" : "incorrect"}`}>
          {correct ? "Correct!" : "Try Again!"}
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRestart={handleRestartGame}
      />
    </div>
  );
}
export default WordSafari;

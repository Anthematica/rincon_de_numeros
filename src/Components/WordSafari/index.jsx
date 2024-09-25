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
      {
        name: "Cero",
        image: "Cero.jpeg",
        options: ["One", "Four", "Five", "Cero"],
      },
      {
        name: "One",
        image: "One.png",
        options: ["One", "Four", "Five", "Cero"],
      },
      {
        name: "Two",
        image: "Two.jpeg",
        options: ["One", "Four", "Two", "Nine"],
      },
      {
        name: "Three",
        image: "Three.jpeg",
        options: ["Seven", "Four", "Five", "Three"],
      },
      {
        name: "Four",
        image: "Four.jpeg",
        options: ["Two", "Four", "Five", "Cero"],
      },
      {
        name: "Five",
        image: "Five.jpeg",
        options: ["Five", "Four", "Three", "Cero"],
      },
      {
        name: "Six",
        image: "Six.jpeg",
        options: ["One", "Four", "Five", "Six"],
      },
      {
        name: "Seven",
        image: "Seven.jpeg",
        options: ["Nine", "Four", "Five", "Seven"],
      },
      {
        name: "Eight",
        image: "Eight.jpeg",
        options: ["One", "Eight", "Five", "Nine"],
      },
      {
        name: "Nine",
        image: "Nine.jpeg",
        options: ["One", "Four", "Nine", "Cero"],
      },
    ],
  },
  // Add more levels and objects here...
  3: {
    scenario: "School supplies",
    objects: [
      {
        name: "Glue",
        image: "glue.jpeg",
        options: ["Glue", "Pencil", "Colors", "Eraser"],
      },
      {
        name: "Pencil",
        image: "Pencil.jpeg",
        options: ["Glue", "Pencil", "Colors", "Eraser"],
      },
      {
        name: "Colors",
        image: "Colors.jpeg",
        options: ["Glue", "Pencil", "Colors", "Eraser"],
      },
      {
        name: "Eraser",
        image: "Eraser.jpeg",
        options: ["Glue", "Pencil", "Colors", "Eraser"],
      },
    ],
  },
  4: {
    scenario: "Clothes",
    objects: [
      {
        name: "Shirt",
        image: "Shirt.jpeg",
        options: ["Shirt", "Scarf", "Short", "Glasses"],
      },
      {
        name: "Glasses",
        image: "Glasses.jpeg",
        options: ["Shirt", "Scarf", "Short", "Glasses"],
      },
      {
        name: "Short",
        image: "Short.jpeg",
        options: ["Shirt", "Scarf", "Short", "Glasses"],
      },
      {
        name: "Scarf",
        image: "Scarf.jpeg",
        options: ["Shirt", "Scarf", "Short", "Glasses"],
      },
      {
        name: "Skirt",
        image: "Skirt.jpeg",
        options: ["Shirt", "Scarf", "Skirt", "Glasses"],
      },
      {
        name: "Slippers",
        image: "Slippers.jpeg",
        options: ["Shirt", "Scarf", "Short", "Slippers"],
      },
      {
        name: "Socks",
        image: "Socks.jpeg",
        options: ["Socks", "Scarf", "Short", "Glasses"],
      },
      {
        name: "Dress",
        image: "Dress.jpeg",
        options: ["Shirt", "Dress", "Short", "Glasses"],
      },
    ],
  },
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

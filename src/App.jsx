import { useState, useEffect } from "react";

import "./index.css";

// Función para convertir números a palabras

// Función para convertir números a palabras
const numberToWords = (num) => {
  const ones = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  const tenPart = Math.floor(num / 10);
  const unitPart = num % 10;
  return tens[tenPart] + (unitPart ? "-" + ones[unitPart] : "");
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getRandomNumberInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const App = () => {
  const [feedback, setFeedback] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [range, setRange] = useState({ min: 1, max: 20 });
  const [shuffledNumbers, setShuffledNumbers] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(1);

  useEffect(() => {
    const selectedNumbers = Array.from(
      { length: range.max - range.min + 1 },
      (_, i) => i + range.min
    );
    setShuffledNumbers(shuffleArray([...selectedNumbers]));
    setQuestionNumber(getRandomNumberInRange(range.min, range.max));
  }, [range]);

  const handleRangeSubmit = (event) => {
    event.preventDefault();
    setShuffledNumbers(
      shuffleArray([
        ...Array.from(
          { length: range.max - range.min + 1 },
          (_, i) => i + range.min
        ),
      ])
    );
    setQuestionNumber(getRandomNumberInRange(range.min, range.max));
    setFeedback("");
    setShowModal(false);
  };

  const handleAnswer = (number) => {
    const correctAudio = new Audio("/sounds/correct.mp3");
    const incorrectAudio = new Audio("/sounds/incorrect.mp3");

    if (number === questionNumber) {
      setFeedback("¡Correcto!");
      correctAudio.play();
      setQuestionNumber(getRandomNumberInRange(range.min, range.max));
    } else {
      setFeedback("¡Inténtalo de nuevo!");
      incorrectAudio.play();
    }

    setShowModal(true);
  };

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 1500); // Modal disappears after 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, [showModal]);
  //Aver
  return (
    <div className="container">
      <h1>Cuenta en inglés</h1>

      <form className="range-form" onSubmit={handleRangeSubmit}>
        <label>
          Número Mínimo:
          <input
            type="number"
            value={range.min}
            onChange={(e) =>
              setRange({ ...range, min: parseInt(e.target.value) })
            }
            min="1"
          />
        </label>
        <label>
          Número Máximo:
          <input
            type="number"
            value={range.max}
            onChange={(e) =>
              setRange({ ...range, max: parseInt(e.target.value) })
            }
            min="2"
            max="100"
          />
        </label>
        <button type="submit">Iniciar</button>
      </form>

      {questionNumber >= range.min && questionNumber <= range.max && (
        <>
          <p>¿Cómo se dice el número {questionNumber} en inglés?</p>
          <div className="options-container">
            {shuffledNumbers.map((number, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(number)}
                className="animated-button"
                style={{ "--delay": `${index * 0.1}s` }}>
                {numberToWords(number)}
              </button>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <div
          className={`modal ${
            feedback === "¡Correcto!" ? "correct" : "wrong"
          }`}>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default App;

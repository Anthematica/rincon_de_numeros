import "./style.css"; // Ensure styles are imported

function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <div className="logo-container">
        <img
          src="Escudo-Argentina.png"
          alt="School Logo"
          className="school-logo"
        />
        <h1>
          Bienvenidos al juego "Sparkle World" para niños de primer grado con
          dificultades en inglés
        </h1>
        <button onClick={onStart} className="start-button">
          Ir al juego
        </button>
        <div className="app-logo-container">
          <div className="app-logo">
            <img src="Logo.jpeg" alt="Logo" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartScreen;

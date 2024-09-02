import "./index.css";

function Modal({ isOpen, onClose, onRestart }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>¡Felicidades!</h2>
        <p>Has completado todos los niveles.</p>
        <button onClick={onRestart} className="modal-button">
          Reiniciar Juego
        </button>
        <button onClick={onClose} className="modal-button">
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default Modal;

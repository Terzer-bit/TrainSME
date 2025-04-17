function Modal({ explanation, onClose }) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>{explanation}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

export default Modal;
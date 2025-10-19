import './ErrorMessage.css';

const ErrorMessage = ({ message, onClose }) => {
  return (
    <div className="error-message">
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <div className="error-text">
          <h4>오류가 발생했습니다</h4>
          <p>{message}</p>
        </div>
        <button onClick={onClose} className="error-close">
          ✕
        </button>
      </div>
      <div className="error-actions">
        <button onClick={onClose} className="btn-retry">
          다시 시도
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;


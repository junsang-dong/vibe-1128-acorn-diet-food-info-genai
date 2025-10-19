import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner-container">
        <div className="spinner"></div>
        <div className="loading-text">
          <h3>분석 중...</h3>
          <p>AI가 음식을 분석하고 있습니다</p>
          <div className="loading-steps">
            <div className="step">🔍 이미지 인식</div>
            <div className="step">🍽️ 음식 식별</div>
            <div className="step">📊 영양정보 계산</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;


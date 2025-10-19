import { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import ErrorMessage from './components/ErrorMessage';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalysisComplete = (data) => {
    setResult(data);
    setLoading(false);
    setError(null);
  };

  const handleAnalysisStart = () => {
    setLoading(true);
    setError(null);
    setResult(null);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
    setResult(null);
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🍽️ AI 음식 분석기</h1>
          <p>음식 사진을 업로드하면 AI가 칼로리와 영양정보를 분석해드립니다</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
          
          {loading && <LoadingSpinner />}

          {!loading && !result && (
            <ImageUploader
              onAnalysisStart={handleAnalysisStart}
              onAnalysisComplete={handleAnalysisComplete}
              onError={handleError}
            />
          )}

          {!loading && result && (
            <ResultDisplay result={result} onReset={handleReset} />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Powered by GPT-4 Vision & Nutritionix API</p>
      </footer>
    </div>
  );
}

export default App;

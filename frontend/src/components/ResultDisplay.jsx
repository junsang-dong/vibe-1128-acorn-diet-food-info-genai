import NutritionChart from './NutritionChart';
import './ResultDisplay.css';

const ResultDisplay = ({ result, onReset }) => {
  const { analysis, nutrition } = result;

  return (
    <div className="result-display">
      <div className="result-header">
        <h2>분석 결과</h2>
        <button onClick={onReset} className="btn-new-analysis">
          새로운 분석
        </button>
      </div>

      <div className="result-content">
        {/* Food Information Card */}
        <div className="info-card food-info">
          <h3>🍽️ 음식 정보</h3>
          <div className="info-item">
            <span className="info-label">음식명:</span>
            <span className="info-value">{analysis.food_name}</span>
          </div>
          {analysis.description && (
            <div className="info-item">
              <span className="info-label">설명:</span>
              <span className="info-value">{analysis.description}</span>
            </div>
          )}
          <div className="info-item">
            <span className="info-label">예상 무게:</span>
            <span className="info-value">{analysis.estimated_weight_grams}g</span>
          </div>
          <div className="info-item">
            <span className="info-label">예상 인분:</span>
            <span className="info-value">{analysis.estimated_portions}인분</span>
          </div>
          {analysis.ingredients && analysis.ingredients.length > 0 && (
            <div className="info-item ingredients">
              <span className="info-label">주요 재료:</span>
              <div className="ingredients-list">
                {analysis.ingredients.map((ingredient, index) => (
                  <span key={index} className="ingredient-tag">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Nutrition Information Card */}
        <div className="info-card nutrition-info">
          <h3>📊 영양 정보</h3>
          
          <div className="calorie-highlight">
            <div className="calorie-value">{nutrition.calories}</div>
            <div className="calorie-label">칼로리 (kcal)</div>
          </div>

          <div className="nutrition-details">
            <div className="nutrition-item protein">
              <div className="nutrition-icon">💪</div>
              <div className="nutrition-text">
                <span className="nutrition-name">단백질</span>
                <span className="nutrition-amount">{nutrition.protein}g</span>
              </div>
            </div>

            <div className="nutrition-item carbs">
              <div className="nutrition-icon">🌾</div>
              <div className="nutrition-text">
                <span className="nutrition-name">탄수화물</span>
                <span className="nutrition-amount">{nutrition.carbs}g</span>
              </div>
            </div>

            <div className="nutrition-item fat">
              <div className="nutrition-icon">🥑</div>
              <div className="nutrition-text">
                <span className="nutrition-name">지방</span>
                <span className="nutrition-amount">{nutrition.fat}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition Chart */}
        <div className="info-card chart-card">
          <h3>📈 영양소 비율</h3>
          <NutritionChart
            protein={nutrition.protein}
            carbs={nutrition.carbs}
            fat={nutrition.fat}
          />
        </div>
      </div>

      <div className="result-footer">
        <p className="disclaimer">
          ⚠️ 이 결과는 AI 분석에 기반한 추정치입니다. 정확한 영양정보는 제품 라벨을 확인해주세요.
        </p>
      </div>
    </div>
  );
};

export default ResultDisplay;


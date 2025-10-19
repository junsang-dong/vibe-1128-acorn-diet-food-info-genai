import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './NutritionChart.css';

const NutritionChart = ({ protein, carbs, fat }) => {
  // Calculate calories from macronutrients
  const proteinCalories = protein * 4;
  const carbsCalories = carbs * 4;
  const fatCalories = fat * 9;

  const data = [
    { name: '단백질', value: proteinCalories, grams: protein, color: '#ff6b6b' },
    { name: '탄수화물', value: carbsCalories, grams: carbs, color: '#4ecdc4' },
    { name: '지방', value: fatCalories, grams: fat, color: '#ffe66d' },
  ];

  const COLORS = data.map(item => item.color);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-name">{data.name}</p>
          <p className="tooltip-value">{data.grams}g</p>
          <p className="tooltip-calories">{data.value}kcal</p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="14"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="nutrition-chart">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value, entry) => {
              const item = data.find(d => d.name === value);
              return `${value} (${item.grams}g)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="chart-summary">
        <div className="summary-item">
          <span className="summary-label">총 칼로리:</span>
          <span className="summary-value">
            {proteinCalories + carbsCalories + fatCalories} kcal
          </span>
        </div>
        <div className="summary-breakdown">
          <div className="breakdown-item">
            <span style={{ color: '#ff6b6b' }}>●</span> 단백질 {proteinCalories}kcal
          </div>
          <div className="breakdown-item">
            <span style={{ color: '#4ecdc4' }}>●</span> 탄수화물 {carbsCalories}kcal
          </div>
          <div className="breakdown-item">
            <span style={{ color: '#ffe66d' }}>●</span> 지방 {fatCalories}kcal
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionChart;


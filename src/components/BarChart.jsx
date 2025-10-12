import { useMemo } from 'react';
import './BarChart.css';

/**
 * BarChart Component
 * A reusable bar chart that displays data with proper scaling
 *
 * @param {Array} data - Array of objects with { year/label, count/value }
 * @param {string} labelKey - Key name for the label (default: 'year')
 * @param {string} valueKey - Key name for the value (default: 'count')
 */
export default function BarChart({ data, labelKey = 'year', valueKey = 'count' }) {
  // Calculate the maximum value for scaling
  const maxValue = useMemo(() => {
    return Math.max(...data.map(item => item[valueKey]));
  }, [data, valueKey]);

  return (
    <div className="modern-bar-chart">
      {data.map((item, index) => {
        const label = item[labelKey];
        const value = item[valueKey];
        const percentage = (value / maxValue) * 100;

        return (
          <div key={label || index} className="modern-bar-column">
            <div className="modern-bar-container">
              <div
                className="modern-bar-fill"
                style={{
                  height: `${percentage}%`
                }}
              >
                <span className="modern-bar-value">{value}</span>
              </div>
            </div>
            <span className="modern-bar-label">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

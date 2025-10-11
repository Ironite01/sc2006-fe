import { useMemo } from 'react';
import './PieChart.css';

/**
 * PieChart Component
 * A reusable pie chart with legend
 *
 * @param {Array} data - Array of objects with { category, count }
 * @param {string} labelKey - Key name for the label (default: 'category')
 * @param {string} valueKey - Key name for the value (default: 'count')
 */
export default function PieChart({ data, labelKey = 'category', valueKey = 'count' }) {
  // Default color palette
  const colors = [
    '#D97706', // Orange-600
    '#F59E0B', // Amber-500
    '#FBBF24', // Amber-400
    '#FCD34D', // Amber-300
    '#FDE68A', // Amber-200
  ];

  // Calculate segments with memoization for performance
  const segments = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item[valueKey], 0);
    let cumulativePercent = 0;

    return data.map((item, index) => {
      const value = item[valueKey];
      const percentage = (value / total) * 100;
      const startPercent = cumulativePercent;
      cumulativePercent += percentage;

      return {
        label: item[labelKey],
        value: value,
        percentage: percentage,
        startPercent: startPercent,
        color: colors[index % colors.length]
      };
    });
  }, [data, labelKey, valueKey]);

  return (
    <div className="modern-pie-chart-wrapper">
      <svg className="modern-pie-chart" viewBox="0 0 200 200">
        {segments.map((segment) => {
          // Convert percentages to angles (starting from top, -90 degrees)
          const startAngle = (segment.startPercent / 100) * 360 - 90;
          const endAngle = ((segment.startPercent + segment.percentage) / 100) * 360 - 90;

          // Convert to radians
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;

          // Calculate arc endpoints
          const radius = 90;
          const centerX = 100;
          const centerY = 100;

          const x1 = centerX + radius * Math.cos(startRad);
          const y1 = centerY + radius * Math.sin(startRad);
          const x2 = centerX + radius * Math.cos(endRad);
          const y2 = centerY + radius * Math.sin(endRad);

          // Large arc flag for segments > 180 degrees
          const largeArc = segment.percentage > 50 ? 1 : 0;

          // Build SVG path
          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');

          return (
            <path
              key={segment.label}
              d={pathData}
              fill={segment.color}
              className="modern-pie-segment"
            />
          );
        })}
      </svg>

      <div className="modern-pie-legend">
        {segments.map((segment) => (
          <div key={segment.label} className="modern-legend-item">
            <div
              className="modern-legend-color"
              style={{ backgroundColor: segment.color }}
            />
            <div className="modern-legend-text">
              <span className="modern-legend-label">{segment.label}</span>
              <span className="modern-legend-value">
                {segment.value} ({segment.percentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

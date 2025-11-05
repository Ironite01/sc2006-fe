import { useMemo } from 'react';

/**
 * LineChart Component
 * A reusable line chart that displays time series data
 *
 * @param {Array} data - Array of objects with time series data
 * @param {string} labelKey - Key name for the label (default: 'period')
 * @param {string} valueKey - Key name for the value (default: 'count')
 */
export default function LineChart({ data, labelKey = 'period', valueKey = 'count' }) {
  const { points, maxValue, minValue, pathD } = useMemo(() => {
    if (!data || data.length === 0) return { points: [], maxValue: 0, minValue: 0, pathD: '' };

    const values = data.map(item => item[valueKey]);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    // SVG dimensions
    const width = 800;
    const height = 200;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Calculate points
    const calculatedPoints = data.map((item, index) => {
      const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
      const y = padding + chartHeight - ((item[valueKey] - min) / range) * chartHeight;
      return { x, y, value: item[valueKey], label: item[labelKey] };
    });

    // Create SVG path
    let path = '';
    calculatedPoints.forEach((point, index) => {
      if (index === 0) {
        path += `M ${point.x} ${point.y}`;
      } else {
        // Create smooth curve using quadratic bezier
        const prevPoint = calculatedPoints[index - 1];
        const midX = (prevPoint.x + point.x) / 2;
        path += ` Q ${prevPoint.x} ${prevPoint.y}, ${midX} ${(prevPoint.y + point.y) / 2}`;
        path += ` T ${point.x} ${point.y}`;
      }
    });

    return { points: calculatedPoints, maxValue: max, minValue: min, pathD: path };
  }, [data, labelKey, valueKey]);

  if (!data || data.length === 0) {
    return <div className="text-amber-100/60 text-sm">No data available</div>;
  }

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 800 200"
        className="w-full h-auto"
        style={{ maxHeight: '200px' }}
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(percent => {
          const y = 40 + (160 * (100 - percent) / 100);
          return (
            <line
              key={percent}
              x1={40}
              y1={y}
              x2={760}
              y2={y}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          );
        })}

        {/* Line path */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(251, 191, 36, 0.8)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#fbbf24"
              stroke="#78350f"
              strokeWidth="2"
            />
            {/* Tooltip on hover */}
            <title>{`${point.label}: ${point.value}`}</title>
          </g>
        ))}

        {/* X-axis labels (show every nth label to avoid crowding) */}
        {points.map((point, index) => {
          // Show label every 3rd point or first/last
          if (index % 3 === 0 || index === points.length - 1) {
            return (
              <text
                key={`label-${index}`}
                x={point.x}
                y={185}
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.6)"
                fontSize="10"
              >
                {point.label}
              </text>
            );
          }
          return null;
        })}

        {/* Y-axis labels */}
        {[0, 25, 50, 75, 100].map(percent => {
          const y = 40 + (160 * (100 - percent) / 100);
          const value = Math.round(minValue + (maxValue - minValue) * (percent / 100));
          return (
            <text
              key={`y-${percent}`}
              x={25}
              y={y + 4}
              textAnchor="end"
              fill="rgba(255, 255, 255, 0.6)"
              fontSize="10"
            >
              {value}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

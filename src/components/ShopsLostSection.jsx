import { useMemo } from 'react';
import categoryStatistics from '../data/categoryStatistics.json';
import BarChart from './BarChart';
import PieChart from './PieChart';

/**
 * ShopsLostSection Component
 * Displays category-specific closure statistics with visualizations
 *
 * @param {string} category - The business category (e.g., "Cafe", "Chinese", "Retail")
 * @param {string} businessName - The name of the business for personalized messaging
 */
export default function ShopsLostSection({ category, businessName }) {
  // Get statistics for the category, fallback to default if not found
  const statistics = useMemo(() => {
    return categoryStatistics.categories[category] || categoryStatistics.categories.default;
  }, [category]);

  return (
    <section className="shops-lost-section">
      <h2>Shops We've Lost</h2>
      <p className="section-description">
        Over {statistics.totalClosed} local businesses have closed in recent years.
        Don't let {businessName} become another statistic.
      </p>

      <div className="data-visualization">
        <div className="chart-container">
          <h3>Closures by Year</h3>
          <BarChart data={statistics.byYear} labelKey="year" valueKey="count" />
        </div>

        <div className="chart-container">
          <h3>Closures by Category</h3>
          <PieChart data={statistics.byCategory} labelKey="category" valueKey="count" />
        </div>
      </div>
    </section>
  );
}

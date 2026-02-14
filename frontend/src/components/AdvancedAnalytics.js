import React from 'react';
import '../styles/analytics.css';

const AdvancedAnalytics = ({ stats }) => {
  if (!stats) return null;

  const calculatePercentage = (value, total) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  };

  const getStatusPercentages = () => {
    const total = stats.overview.totalRequests;
    return stats.statusDistribution.map(item => ({
      ...item,
      percentage: calculatePercentage(item.count, total)
    }));
  };

  const getCategoryPercentages = () => {
    const total = stats.overview.totalRequests;
    return stats.categoryDistribution.map(item => ({
      ...item,
      percentage: calculatePercentage(item.count, total)
    }));
  };

  return (
    <div className="advanced-analytics">
      <div className="analytics-row">
        <div className="analytics-chart-card">
          <h3>Status Distribution</h3>
          <div className="chart-bars">
            {getStatusPercentages().map(item => (
              <div key={item._id} className="chart-bar-item">
                <div className="chart-bar-label">
                  <span>{item._id.replace('_', ' ')}</span>
                  <span className="chart-bar-value">{item.count}</span>
                </div>
                <div className="chart-bar-track">
                  <div 
                    className={`chart-bar-fill status-${item._id}`}
                    style={{ width: `${item.percentage}%` }}
                  >
                    <span className="chart-bar-percentage">{item.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-chart-card">
          <h3>Category Distribution</h3>
          <div className="chart-bars">
            {getCategoryPercentages().map(item => (
              <div key={item._id} className="chart-bar-item">
                <div className="chart-bar-label">
                  <span>{item._id.replace('_', ' ')}</span>
                  <span className="chart-bar-value">{item.count}</span>
                </div>
                <div className="chart-bar-track">
                  <div 
                    className="chart-bar-fill category-bar"
                    style={{ width: `${item.percentage}%` }}
                  >
                    <span className="chart-bar-percentage">{item.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="analytics-metrics">
        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <div className="metric-label">Avg Resolution Time</div>
            <div className="metric-value">{stats.overview.avgResolutionTime.toFixed(1)} days</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <div className="metric-label">Resolution Rate</div>
            <div className="metric-value">
              {calculatePercentage(
                stats.statusDistribution.find(s => s._id === 'resolved')?.count || 0,
                stats.overview.totalRequests
              )}%
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏳</div>
          <div className="metric-content">
            <div className="metric-label">Pending Requests</div>
            <div className="metric-value">
              {stats.statusDistribution.find(s => s._id === 'pending')?.count || 0}
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-label">Active Users</div>
            <div className="metric-value">{stats.overview.totalUsers}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
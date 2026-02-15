import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import '../styles/analytics.css';

const AdvancedAnalytics = ({ stats }) => {
  if (!stats) return null;

  const calculatePercentage = (value, total) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  };

  // Colors for charts
  const COLORS = {
    pending: '#ffc107',
    in_progress: '#17a2b8',
    resolved: '#28a745',
    closed: '#6c757d',
    reopened: '#dc3545'
  };

  const CATEGORY_COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#f97316', '#10b981'];

  // Prepare data for pie chart
  const categoryData = stats.categoryDistribution.map(item => ({
    name: item._id.replace('_', ' ').toUpperCase(),
    value: item.count
  }));

  // Prepare data for bar chart (status distribution)
  const statusData = stats.statusDistribution.map(item => ({
    name: item._id.replace('_', ' ').toUpperCase(),
    count: item.count,
    fill: COLORS[item._id] || '#6366f1'
  }));

  // Mock monthly trend data (you can replace with real data from backend)
  const monthlyData = [
    { month: 'Jan', requests: 45 },
    { month: 'Feb', requests: 52 },
    { month: 'Mar', requests: 48 },
    { month: 'Apr', requests: 61 },
    { month: 'May', requests: 55 },
    { month: 'Jun', requests: stats.overview.totalRequests }
  ];

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
      {/* Charts Row */}
      <div className="analytics-charts-row">
        {/* Monthly Trend Line Chart */}
        <div className="analytics-chart-card">
          <h3 className="chart-title">📈 Monthly Request Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="requests" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie Chart */}
        <div className="analytics-chart-card">
          <h3 className="chart-title">🎯 Category Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Bar Chart */}
        <div className="analytics-chart-card">
          <h3 className="chart-title">📊 Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
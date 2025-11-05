import { useEffect, useState } from "react";
import { admin } from "../../../../paths";
import { toast } from "react-toastify";
import LineChart from "../../../components/LineChart";
import "./Stats.css";

export default function AdminStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    platform: { campaigns: 0, donations: 0, netVolume: 0, supporters: 0 },
    donationsOverTime: [],
    conversionFunnel: {
      campaignVisits: 0,
      donations: 0,
      donationsAmount: 0,
      platformRevenue: 0,
      refundRate: 0
    },
    campaignStatus: { pending: 0, approved: 0, rejected: 0, suspended: 0 }
  });

  useEffect(() => {
    fetchAllStats();
  }, []);

  async function fetchAllStats() {
    try {
      const res = await fetch(admin.stats.all, {
        method: 'GET',
        credentials: 'include'
      });

      if (!res.ok) {
        toast.error("Unable to fetch statistics");
        setLoading(false);
        return;
      }

      const response = await res.json();
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load statistics");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="stats-container">
        <div className="stats-loading">Loading statistics...</div>
      </div>
    );
  }

  // Format numbers with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Format currency
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SGD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="stats-container">
      {/* Header */}
      <div className="stats-header">
        <h1>Platform Statistics</h1>
        <p>Comprehensive overview of platform performance and metrics</p>
      </div>

      {/* Top Stats Cards */}
      <div className="stats-grid-top">
        <div className="stat-card">
          <div className="stat-label">Campaigns</div>
          <div className="stat-value">{formatNumber(stats.platform.campaigns)}</div>
          <div className="stat-description">Total number of campaigns created on the platform</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Donations</div>
          <div className="stat-value">{formatNumber(stats.platform.donations)}</div>
          <div className="stat-description">Total number of individual donations received</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Net Volume</div>
          <div className="stat-value">{formatCurrency(stats.platform.netVolume)}</div>
          <div className="stat-description">Total monetary volume raised across all campaigns</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Supporters</div>
          <div className="stat-value">{formatNumber(stats.platform.supporters)}</div>
          <div className="stat-description">Unique number of supporters who have contributed</div>
        </div>
      </div>

      {/* Donations Over Time Chart */}
      <div className="stats-section">
        <h2>Donations Over Time</h2>
        <p className="section-description">Line graph showing the trend of donations over time, useful for tracking growth and engagement</p>
        <div className="chart-container">
          {stats.donationsOverTime && stats.donationsOverTime.length > 0 ? (
            <LineChart
              data={stats.donationsOverTime}
              labelKey="period"
              valueKey="count"
            />
          ) : (
            <div className="no-data">No donation data available yet</div>
          )}
        </div>
      </div>

      {/* Bottom Grid: Conversion Funnel & Campaign Status */}
      <div className="stats-grid-bottom">
        {/* Conversion Funnel */}
        <div className="stats-section">
          <h2>Conversion Funnel</h2>
          <div className="funnel-container">
            <div className="funnel-step">
              <div className="funnel-label">Campaign Visits</div>
              <div className="funnel-value">{formatNumber(stats.conversionFunnel.campaignVisits)}</div>
            </div>

            <div className="funnel-step funnel-step-narrow">
              <div className="funnel-label">Donations</div>
              <div className="funnel-value">{formatNumber(stats.conversionFunnel.donations)}</div>
            </div>

            <div className="funnel-step funnel-step-narrower">
              <div className="funnel-label">Donation Amount</div>
              <div className="funnel-value">{formatCurrency(stats.conversionFunnel.donationsAmount)}</div>
            </div>

            <div className="funnel-revenue">
              <div className="funnel-label">Platform Revenue</div>
              <div className="funnel-value">{formatCurrency(stats.conversionFunnel.platformRevenue)}</div>
            </div>

            <div className="funnel-metric">
              <div className="funnel-label">Refund Rate</div>
              <div className="funnel-value">{stats.conversionFunnel.refundRate}%</div>
            </div>
          </div>
        </div>

        {/* Campaign Status */}
        <div className="stats-section">
          <h2>Campaigns</h2>
          <div className="campaign-status-list">
            <div className="status-item">
              <span className="status-label">Pending</span>
              <span className="status-value">{stats.campaignStatus.pending}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Approved</span>
              <span className="status-value">{stats.campaignStatus.approved}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Rejected</span>
              <span className="status-value">{stats.campaignStatus.rejected}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Suspended</span>
              <span className="status-value">{stats.campaignStatus.suspended}</span>
            </div>
            <div className="status-item refund-rate">
              <span className="status-label">Refund Rate</span>
              <span className="status-value">{stats.conversionFunnel.refundRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

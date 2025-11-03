import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CampaignAnalytics.css';

export default function CampaignAnalytics() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [campaign, setCampaign] = useState(null);
    const [donations, setDonations] = useState([]);
    const [rewards, setRewards] = useState([]);
    const [analytics, setAnalytics] = useState({
        totalDonations: 0,
        averageDonation: 0,
        topDonation: 0,
        uniqueBackers: 0,
        donationsByDate: [],
        rewardDistribution: []
    });

    useEffect(() => {
        loadAnalyticsData();
    }, [id]);

    async function loadAnalyticsData() {
        try {
            setLoading(true);

            // Load campaign data
            const campaignRes = await fetch(`http://localhost:3000/campaigns/${id}`, {
                credentials: 'include'
            });

            if (!campaignRes.ok) {
                throw new Error('Failed to load campaign');
            }

            const campaignData = await campaignRes.json();
            setCampaign(campaignData);

            // Load donations for this campaign
            const donationsRes = await fetch(`http://localhost:3000/donations/campaign/${id}`, {
                credentials: 'include'
            });

            if (!donationsRes.ok) {
                throw new Error('Failed to load donations');
            }

            const donationsData = await donationsRes.json();
            setDonations(donationsData);

            // Load rewards
            const rewardsRes = await fetch(`http://localhost:3000/rewards?campaignId=${id}`, {
                credentials: 'include'
            });

            if (rewardsRes.ok) {
                const rewardsData = await rewardsRes.json();
                setRewards(rewardsData);
            }

            // Calculate analytics
            calculateAnalytics(donationsData, campaignData);

            setLoading(false);
        } catch (err) {
            console.error('Error loading analytics:', err);
            setError(err.message);
            setLoading(false);
        }
    }

    function calculateAnalytics(donationsData, campaignData) {
        if (!donationsData || donationsData.length === 0) {
            return;
        }

        // Filter completed donations only
        const completedDonations = donationsData.filter(d => d.paymentStatus === 'completed');

        // Total donations count
        const totalDonations = completedDonations.length;

        // Calculate average donation
        const totalAmount = completedDonations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
        const averageDonation = totalAmount / totalDonations || 0;

        // Find top donation
        const topDonation = Math.max(...completedDonations.map(d => parseFloat(d.amount)));

        // Count unique backers
        const uniqueBackers = new Set(completedDonations.map(d => d.userId)).size;

        // Group donations by date
        const donationsByDate = {};
        completedDonations.forEach(donation => {
            const date = new Date(donation.donationDate).toLocaleDateString();
            if (!donationsByDate[date]) {
                donationsByDate[date] = { date, count: 0, amount: 0 };
            }
            donationsByDate[date].count++;
            donationsByDate[date].amount += parseFloat(donation.amount);
        });

        const sortedDonationsByDate = Object.values(donationsByDate)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Calculate reward distribution
        const rewardCounts = {};
        completedDonations.forEach(donation => {
            const rewardName = donation.rewardName || 'No Reward';
            if (!rewardCounts[rewardName]) {
                rewardCounts[rewardName] = 0;
            }
            rewardCounts[rewardName]++;
        });

        const rewardDistribution = Object.entries(rewardCounts).map(([name, count]) => ({
            name,
            count,
            percentage: (count / totalDonations * 100).toFixed(1)
        }));

        setAnalytics({
            totalDonations,
            averageDonation,
            topDonation,
            uniqueBackers,
            donationsByDate: sortedDonationsByDate,
            rewardDistribution
        });
    }

    function formatCurrency(amount) {
        return `$${parseFloat(amount).toFixed(2)}`;
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-SG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function getDaysRemaining(endDate) {
        const end = new Date(endDate);
        const now = new Date();
        const diff = end - now;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    }

    if (loading) {
        return (
            <div className="campaign-analytics">
                <div className="loading">Loading analytics...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="campaign-analytics">
                <div className="error-state">
                    <h2>Error Loading Analytics</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/business/dashboard')} className="action-btn">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="campaign-analytics">
                <div className="error-state">
                    <h2>Campaign Not Found</h2>
                    <button onClick={() => navigate('/business/dashboard')} className="action-btn">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const progress = (parseFloat(campaign.amtRaised || 0) / parseFloat(campaign.goal || 1)) * 100;
    const daysRemaining = getDaysRemaining(campaign.endDate);

    return (
        <div className="campaign-analytics">
            <div className="analytics-header">
                <div className="header-content">
                    <button onClick={() => navigate('/business/dashboard')} className="back-btn">
                        ← Back to Dashboard
                    </button>
                    <h1>Campaign Analytics</h1>
                    <p className="campaign-name">{campaign.name}</p>
                </div>
            </div>

            {/* Campaign Overview */}
            <div className="overview-section">
                <h2>Campaign Overview</h2>
                <div className="overview-grid">
                    <div className="overview-card">
                        <div className="card-icon">💰</div>
                        <div className="card-content">
                            <div className="card-value">{formatCurrency(campaign.amtRaised || 0)}</div>
                            <div className="card-label">Raised of {formatCurrency(campaign.goal)} goal</div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                            </div>
                            <div className="progress-text">{progress.toFixed(1)}% funded</div>
                        </div>
                    </div>

                    <div className="overview-card">
                        <div className="card-icon">👥</div>
                        <div className="card-content">
                            <div className="card-value">{campaign.backerCount || 0}</div>
                            <div className="card-label">Total Backers</div>
                        </div>
                    </div>

                    <div className="overview-card">
                        <div className="card-icon">📅</div>
                        <div className="card-content">
                            <div className="card-value">{daysRemaining}</div>
                            <div className="card-label">Days Remaining</div>
                            <div className="card-subtext">Ends {formatDate(campaign.endDate)}</div>
                        </div>
                    </div>

                    <div className="overview-card">
                        <div className="card-icon">📊</div>
                        <div className="card-content">
                            <div className="card-value">{campaign.status}</div>
                            <div className="card-label">Campaign Status</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Donation Statistics */}
            <div className="stats-section">
                <h2>Donation Statistics</h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">🎯</div>
                        <div className="stat-content">
                            <div className="stat-value">{analytics.totalDonations}</div>
                            <div className="stat-label">Total Donations</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">💵</div>
                        <div className="stat-content">
                            <div className="stat-value">{formatCurrency(analytics.averageDonation)}</div>
                            <div className="stat-label">Average Donation</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">⭐</div>
                        <div className="stat-content">
                            <div className="stat-value">{formatCurrency(analytics.topDonation)}</div>
                            <div className="stat-label">Top Donation</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">👤</div>
                        <div className="stat-content">
                            <div className="stat-value">{analytics.uniqueBackers}</div>
                            <div className="stat-label">Unique Backers</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Donations Timeline */}
            {analytics.donationsByDate.length > 0 && (
                <div className="timeline-section">
                    <h2>Donations Over Time</h2>
                    <div className="timeline-chart">
                        {analytics.donationsByDate.map((day, index) => {
                            const maxAmount = Math.max(...analytics.donationsByDate.map(d => d.amount));
                            const barHeight = (day.amount / maxAmount) * 100;

                            return (
                                <div key={index} className="timeline-bar-container">
                                    <div className="timeline-bar" style={{ height: `${barHeight}%` }}>
                                        <div className="bar-tooltip">
                                            <div>{formatCurrency(day.amount)}</div>
                                            <div>{day.count} donations</div>
                                        </div>
                                    </div>
                                    <div className="timeline-label">{day.date}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Reward Distribution */}
            {analytics.rewardDistribution.length > 0 && (
                <div className="rewards-section">
                    <h2>Reward Tier Distribution</h2>
                    <div className="rewards-list">
                        {analytics.rewardDistribution.map((reward, index) => (
                            <div key={index} className="reward-item">
                                <div className="reward-info">
                                    <div className="reward-name">{reward.name}</div>
                                    <div className="reward-count">{reward.count} backers ({reward.percentage}%)</div>
                                </div>
                                <div className="reward-bar">
                                    <div className="reward-fill" style={{ width: `${reward.percentage}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Donations */}
            {donations.length > 0 && (
                <div className="recent-donations-section">
                    <h2>Recent Donations</h2>
                    <div className="donations-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Backer</th>
                                    <th>Amount</th>
                                    <th>Reward</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.slice(0, 10).map((donation, index) => (
                                    <tr key={index}>
                                        <td>{formatDate(donation.donationDate)}</td>
                                        <td>User {donation.userId}</td>
                                        <td>{formatCurrency(donation.amount)}</td>
                                        <td>{donation.rewardName || 'No Reward'}</td>
                                        <td>
                                            <span className={`status-badge ${donation.paymentStatus}`}>
                                                {donation.paymentStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="analytics-actions">
                <button onClick={() => navigate(`/campaign/edit?id=${id}`)} className="btn-primary">
                    Edit Campaign
                </button>
                <button onClick={() => navigate(`/campaign/rewards?campaignId=${id}`)} className="btn-secondary">
                    Manage Rewards
                </button>
                <button onClick={() => navigate('/business/dashboard')} className="btn-secondary">
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}

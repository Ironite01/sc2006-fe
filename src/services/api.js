// API Service for VCD features
const API_BASE = 'http://localhost:3000';

const API = {
  // Campaign Updates
  getCampaignUpdates: (campaignId) =>
    fetch(`${API_BASE}/campaigns/${campaignId}/updates`).then(r => r.json()),

  createUpdate: (campaignId, data) =>
    fetch(`${API_BASE}/campaigns/${campaignId}/updates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    }).then(r => r.json()),

  // Campaign Comments
  getCampaignComments: (campaignId) =>
    fetch(`${API_BASE}/campaigns/${campaignId}/comments`).then(r => r.json()),

  createComment: (campaignId, data) =>
    fetch(`${API_BASE}/campaigns/${campaignId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    }).then(r => r.json()),

  // Campaign Likes
  toggleLike: (campaignId) =>
    fetch(`${API_BASE}/campaigns/${campaignId}/like`, {
      method: 'POST',
      credentials: 'include'
    }).then(r => r.json()),

  // Contact
  submitContact: (data) =>
    fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  // Admin
  getPendingCampaigns: () =>
    fetch(`${API_BASE}/admin/campaigns/pending`, { credentials: 'include' }).then(r => r.json()),

  approveCampaign: (id) =>
    fetch(`${API_BASE}/admin/campaigns/${id}/approve`, {
      method: 'PUT',
      credentials: 'include'
    }).then(r => r.json()),

  rejectCampaign: (id) =>
    fetch(`${API_BASE}/admin/campaigns/${id}/reject`, {
      method: 'PUT',
      credentials: 'include'
    }).then(r => r.json()),

  // User Rewards
  getUserRewards: (userId) =>
    fetch(`${API_BASE}/rewards/user/${userId}`, { credentials: 'include' }).then(r => r.json()),

  getRewardProof: (userRewardId) =>
    fetch(`${API_BASE}/rewards/${userRewardId}/proof`, { credentials: 'include' }).then(r => r.json()),
};

export default API;

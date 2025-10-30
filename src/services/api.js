/**
 * API Service Layer
 * Centralized API request handler for the crowdfunding platform
 */

const API_BASE = 'http://localhost:3000';

class ApiService {
  /**
   * Make an API request with consistent error handling
   * @param {string} endpoint - API endpoint (e.g., '/campaigns')
   * @param {object} options - Fetch options
   * @returns {Promise<any>} - Response data
   */
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      // Handle non-OK responses
      if (!response.ok) {
        // Handle 401 Unauthorized - redirect to login
        if (response.status === 401) {
          window.location.href = '/login';
          throw new Error('Unauthorized - redirecting to login');
        }

        // Try to extract error message from response
        let errorMessage = 'Request failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Request failed with status ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      // Parse and return JSON response
      return await response.json();
    } catch (error) {
      // Re-throw with enhanced error message
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * Make a multipart/form-data request (for file uploads)
   * @param {string} endpoint - API endpoint
   * @param {FormData} formData - Form data with files
   * @returns {Promise<any>} - Response data
   */
  async uploadRequest(endpoint, formData) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        body: formData
        // Don't set Content-Type header - browser will set it with boundary
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login';
          throw new Error('Unauthorized - redirecting to login');
        }

        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      return await response.json();
    } catch (error) {
      console.error(`Upload Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // ============================================================================
  // REWARD ENDPOINTS
  // ============================================================================

  /**
   * Get user's claimed rewards grouped by status
   * @param {number} userId - User ID
   * @returns {Promise<object>} - { pending: [], completed: [], redeemed: [] }
   */
  getUserRewards(userId) {
    return this.request(`/rewards/user/${userId}`);
  }

  /**
   * Get reward proof with QR code
   * @param {number} userRewardId - User reward ID
   * @returns {Promise<object>} - { reward: {...}, qrCode: 'base64...' }
   */
  getRewardProof(userRewardId) {
    return this.request(`/rewards/${userRewardId}/proof`);
  }

  /**
   * Claim a reward
   * @param {number} rewardId - Reward ID to claim
   * @param {number} userId - User ID
   * @param {number} donationId - Donation ID
   * @returns {Promise<object>} - { success: true, userRewardId: X }
   */
  claimReward(rewardId, userId, donationId) {
    return this.request(`/rewards/${rewardId}/claim`, {
      method: 'POST',
      body: JSON.stringify({ userId, donationId })
    });
  }

  /**
   * Get supporters who claimed a reward
   * @param {number} rewardId - Reward ID
   * @param {object} options - { status, limit, offset }
   * @returns {Promise<object>} - { supporters: [] }
   */
  getRewardSupporters(rewardId, options = {}) {
    const params = new URLSearchParams(options);
    return this.request(`/rewards/${rewardId}/supporters?${params}`);
  }

  /**
   * Update reward claim status
   * @param {number} userRewardId - User reward ID
   * @param {string} status - New status (pending/completed/redeemed)
   * @returns {Promise<object>} - { success: true }
   */
  updateRewardStatus(userRewardId, status) {
    return this.request(`/rewards/${userRewardId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  /**
   * Get reward tiers for a campaign
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<object>} - { rewards: [] }
   */
  getCampaignRewards(campaignId) {
    return this.request(`/campaigns/${campaignId}/rewards`);
  }

  /**
   * Get reward claims for a campaign (business view)
   * @param {number} campaignId - Campaign ID
   * @param {object} options - { status, limit, offset }
   * @returns {Promise<object>} - { claims: [] }
   */
  getCampaignRewardClaims(campaignId, options = {}) {
    const params = new URLSearchParams(options);
    return this.request(`/campaigns/${campaignId}/reward-claims?${params}`);
  }

  // ============================================================================
  // CAMPAIGN UPDATE ENDPOINTS
  // ============================================================================

  /**
   * Get updates from campaigns a supporter has donated to
   * @param {number} userId - User ID
   * @param {object} options - { limit, offset }
   * @returns {Promise<object>} - { updates: [] }
   */
  getSupporterUpdates(userId, options = {}) {
    const params = new URLSearchParams(options);
    return this.request(`/updates/supporter/${userId}?${params}`);
  }

  /**
   * Get updates for a campaign
   * @param {number} campaignId - Campaign ID
   * @param {object} options - { limit, offset, includeScheduled }
   * @returns {Promise<object>} - { updates: [] }
   */
  getCampaignUpdates(campaignId, options = {}) {
    const params = new URLSearchParams(options);
    return this.request(`/campaigns/${campaignId}/updates?${params}`);
  }

  /**
   * Create a campaign update
   * @param {number} campaignId - Campaign ID
   * @param {object} data - { title, description, imageUrl, tags, scheduledFor }
   * @returns {Promise<object>} - { success: true, updateId: X }
   */
  createCampaignUpdate(campaignId, data) {
    return this.request(`/campaigns/${campaignId}/updates`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Toggle like on an update
   * @param {number} updateId - Update ID
   * @param {number} userId - User ID
   * @returns {Promise<object>} - { success: true, action: 'liked'/'unliked' }
   */
  toggleUpdateLike(updateId, userId) {
    return this.request(`/updates/${updateId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
  }

  /**
   * Get like info for an update
   * @param {number} updateId - Update ID
   * @param {number} userId - User ID (optional)
   * @returns {Promise<object>} - { likeCount: X, userHasLiked: boolean }
   */
  getUpdateLikeInfo(updateId, userId = null) {
    const params = userId ? `?userId=${userId}` : '';
    return this.request(`/updates/${updateId}/likes${params}`);
  }

  /**
   * Get comments for an update
   * @param {number} updateId - Update ID
   * @param {object} options - { limit, offset }
   * @returns {Promise<object>} - { success: true, comments: [], totalComments: X }
   */
  getUpdateComments(updateId, options = {}) {
    const params = new URLSearchParams(options);
    return this.request(`/updates/${updateId}/comments?${params}`);
  }

  /**
   * Post a comment on an update
   * @param {number} updateId - Update ID
   * @param {object} data - { userId, commentText }
   * @returns {Promise<object>} - { success: true, commentId: X, comment: {...} }
   */
  postUpdateComment(updateId, data) {
    return this.request(`/updates/${updateId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Delete an update comment
   * @param {number} commentId - Comment ID
   * @param {number} userId - User ID
   * @returns {Promise<object>} - { success: true }
   */
  deleteUpdateComment(commentId, userId) {
    return this.request(`/comments/${commentId}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId })
    });
  }

  // ============================================================================
  // CAMPAIGN COMMENT ENDPOINTS
  // ============================================================================

  /**
   * Get comments for a campaign
   * @param {number} campaignId - Campaign ID
   * @param {object} options - { limit, offset, includeReplies }
   * @returns {Promise<object>} - { comments: [] }
   */
  getCampaignComments(campaignId, options = {}) {
    const params = new URLSearchParams(options);
    return this.request(`/campaigns/${campaignId}/comments?${params}`);
  }

  /**
   * Post a comment
   * @param {number} campaignId - Campaign ID
   * @param {object} data - { userId, commentText, parentCommentId }
   * @returns {Promise<object>} - { success: true, commentId: X }
   */
  postComment(campaignId, data) {
    return this.request(`/campaigns/${campaignId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Post a reply to a comment
   * @param {number} commentId - Parent comment ID
   * @param {object} data - { userId, commentText }
   * @returns {Promise<object>} - { success: true, commentId: X }
   */
  replyToComment(commentId, data) {
    return this.request(`/comments/${commentId}/reply`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Delete a comment
   * @param {number} commentId - Comment ID
   * @param {number} userId - User ID (for ownership verification)
   * @returns {Promise<object>} - { success: true }
   */
  deleteComment(commentId, userId) {
    return this.request(`/comments/${commentId}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId })
    });
  }

  // ============================================================================
  // CAMPAIGN LIKE ENDPOINTS
  // ============================================================================

  /**
   * Toggle like on a campaign
   * @param {number} campaignId - Campaign ID
   * @param {number} userId - User ID
   * @returns {Promise<object>} - { success: true, action: 'liked'/'unliked' }
   */
  toggleCampaignLike(campaignId, userId) {
    return this.request(`/campaigns/${campaignId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
  }

  /**
   * Get like info for a campaign
   * @param {number} campaignId - Campaign ID
   * @param {number} userId - User ID (optional)
   * @returns {Promise<object>} - { likeCount: X, userHasLiked: boolean }
   */
  getCampaignLikeInfo(campaignId, userId = null) {
    const params = userId ? `?userId=${userId}` : '';
    return this.request(`/campaigns/${campaignId}/likes${params}`);
  }

  // ============================================================================
  // USER PROFILE ENDPOINTS
  // ============================================================================

  /**
   * Get user profile
   * @param {number} userId - User ID
   * @returns {Promise<object>} - { success: true, user: {...} }
   */
  getUserProfile(userId) {
    return this.request(`/api/user/profile?userId=${userId}`);
  }

  /**
   * Update user profile
   * @param {object} data - { userId, username, email, password, profilePicture }
   * @returns {Promise<object>} - { success: true, user: {...} }
   */
  updateUserProfile(data) {
    return this.request('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * Upload profile picture
   * @param {number} userId - User ID
   * @param {File} file - Image file
   * @returns {Promise<object>} - { success: true, picture: 'base64...' }
   */
  uploadProfilePicture(userId, file) {
    const formData = new FormData();
    formData.append('file', file);
    return this.uploadRequest(`/api/user/profile/picture?userId=${userId}`, formData);
  }

  // ============================================================================
  // ADMIN ENDPOINTS
  // ============================================================================

  /**
   * Admin login
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise<object>} - { success: true, token: '...', admin: {...} }
   */
  adminLogin(email, password) {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  /**
   * Get pending campaigns
   * @returns {Promise<object>} - { campaigns: [] }
   */
  getPendingCampaigns() {
    return this.request('/admin/campaigns/pending');
  }

  /**
   * Get approved campaigns
   * @returns {Promise<object>} - { campaigns: [] }
   */
  getApprovedCampaigns() {
    return this.request('/admin/campaigns/approved');
  }

  /**
   * Get all campaigns with optional status filter
   * @param {string} status - Campaign status (optional)
   * @returns {Promise<object>} - { campaigns: [] }
   */
  getAllCampaigns(status = null) {
    const params = status ? `?status=${status}` : '';
    return this.request(`/admin/campaigns/all${params}`);
  }

  /**
   * Approve a campaign
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<object>} - { success: true }
   */
  approveCampaign(campaignId) {
    return this.request(`/admin/campaigns/${campaignId}/approve`, {
      method: 'PUT'
    });
  }

  /**
   * Reject a campaign
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<object>} - { success: true }
   */
  rejectCampaign(campaignId) {
    return this.request(`/admin/campaigns/${campaignId}/reject`, {
      method: 'PUT'
    });
  }

  /**
   * Suspend a campaign
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<object>} - { success: true }
   */
  suspendCampaign(campaignId) {
    return this.request(`/admin/campaigns/${campaignId}/suspend`, {
      method: 'PUT'
    });
  }

  /**
   * Unsuspend a campaign
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<object>} - { success: true }
   */
  unsuspendCampaign(campaignId) {
    return this.request(`/admin/campaigns/${campaignId}/unsuspend`, {
      method: 'PUT'
    });
  }

  /**
   * Verify a shop
   * @param {number} shopId - Shop ID
   * @returns {Promise<object>} - { success: true }
   */
  verifyShop(shopId) {
    return this.request(`/admin/shops/${shopId}/verify`, {
      method: 'PUT'
    });
  }

  /**
   * Reject a shop
   * @param {number} shopId - Shop ID
   * @returns {Promise<object>} - { success: true }
   */
  rejectShop(shopId) {
    return this.request(`/admin/shops/${shopId}/reject`, {
      method: 'PUT'
    });
  }

  /**
   * Get platform statistics
   * @returns {Promise<object>} - { stats: {...} }
   */
  getPlatformStats() {
    return this.request('/admin/stats');
  }

  // ============================================================================
  // CONTACT ENDPOINT
  // ============================================================================

  /**
   * Send contact form
   * @param {object} data - { name, email, message }
   * @returns {Promise<object>} - { success: true }
   */
  sendContactForm(data) {
    return this.request('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}

// Export singleton instance
export default new ApiService();

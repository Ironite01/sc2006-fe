/**
 * API Endpoint Paths Configuration
 * Centralized API endpoint definitions for the crowdfunding platform
 */

const backendPath = "http://localhost:3000";

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

export const auth = {
  login: `${backendPath}/login`,
  register: `${backendPath}/register`,
  logout: `${backendPath}/logout`,
  checkAuth: `${backendPath}/auth/check`,
  googleLogin: `${backendPath}/login/google`,
  azureLogin: `${backendPath}/login/azure`
};

// ============================================================================
// SHOP ENDPOINTS
// ============================================================================

export const shop = {
  list: `${backendPath}/shops`,
  one: (id) => `${backendPath}/shops/${id}`,
  create: `${backendPath}/shops`,
  update: (id) => `${backendPath}/shops/${id}`,
  delete: (id) => `${backendPath}/shops/${id}`
};

// ============================================================================
// CAMPAIGN ENDPOINTS
// ============================================================================

export const campaign = {
  list: `${backendPath}/campaigns`,
  one: (id) => `${backendPath}/campaigns/${id}`,
  create: `${backendPath}/campaigns`,
  update: (id) => `${backendPath}/campaigns/${id}`,
  delete: (id) => `${backendPath}/campaigns/${id}`
};

// ============================================================================
// DONATION ENDPOINTS
// ============================================================================

export const donation = {
  create: `${backendPath}/donations`,
  createOrder: `${backendPath}/create-order`,
  captureOrder: `${backendPath}/capture-order`
};

// ============================================================================
// REWARD ENDPOINTS
// ============================================================================

export const reward = {
  // Reward tier management
  listByCampaign: (campaignId) => `${backendPath}/campaigns/${campaignId}/rewards`,
  availableForAmount: (campaignId) => `${backendPath}/campaigns/${campaignId}/rewards/available`,
  create: (campaignId) => `${backendPath}/campaigns/${campaignId}/rewards`,
  one: (rewardId) => `${backendPath}/rewards/${rewardId}`,
  update: (rewardId) => `${backendPath}/rewards/${rewardId}`,
  delete: (rewardId) => `${backendPath}/rewards/${rewardId}`,
  availability: (rewardId) => `${backendPath}/rewards/${rewardId}/availability`,

  // User reward claims
  claim: (rewardId) => `${backendPath}/rewards/${rewardId}/claim`,
  byUser: (userId) => `${backendPath}/rewards/user/${userId}`,
  supporters: (rewardId) => `${backendPath}/rewards/${rewardId}/supporters`,
  campaignClaims: (campaignId) => `${backendPath}/campaigns/${campaignId}/reward-claims`,
  updateStatus: (userRewardId) => `${backendPath}/rewards/${userRewardId}/status`,
  proof: (userRewardId) => `${backendPath}/rewards/${userRewardId}/proof`,
  userRewardOne: (userRewardId) => `${backendPath}/user-rewards/${userRewardId}`
};

// ============================================================================
// CAMPAIGN UPDATE ENDPOINTS
// ============================================================================

export const update = {
  listByCampaign: (campaignId) => `${backendPath}/campaigns/${campaignId}/updates`,
  forSupporter: (userId) => `${backendPath}/updates/supporter/${userId}`,
  one: (updateId) => `${backendPath}/updates/${updateId}`,
  create: (campaignId) => `${backendPath}/campaigns/${campaignId}/updates`,
  update: (updateId) => `${backendPath}/updates/${updateId}`,
  delete: (updateId) => `${backendPath}/updates/${updateId}`,
  like: (updateId) => `${backendPath}/updates/${updateId}/like`,
  likes: (updateId) => `${backendPath}/updates/${updateId}/likes`,
  likers: (updateId) => `${backendPath}/updates/${updateId}/likers`
};

// ============================================================================
// COMMENT ENDPOINTS
// ============================================================================

export const comment = {
  listByCampaign: (campaignId) => `${backendPath}/campaigns/${campaignId}/comments`,
  create: (campaignId) => `${backendPath}/campaigns/${campaignId}/comments`,
  reply: (commentId) => `${backendPath}/comments/${commentId}/reply`,
  replies: (commentId) => `${backendPath}/comments/${commentId}/replies`,
  one: (commentId) => `${backendPath}/comments/${commentId}`,
  update: (commentId) => `${backendPath}/comments/${commentId}`,
  delete: (commentId) => `${backendPath}/comments/${commentId}`,
  count: (campaignId) => `${backendPath}/campaigns/${campaignId}/comments/count`,
  byUser: (userId) => `${backendPath}/users/${userId}/comments`
};

// ============================================================================
// LIKE ENDPOINTS
// ============================================================================

export const like = {
  toggleCampaign: (campaignId) => `${backendPath}/campaigns/${campaignId}/like`,
  campaignInfo: (campaignId) => `${backendPath}/campaigns/${campaignId}/likes`,
  campaignLikers: (campaignId) => `${backendPath}/campaigns/${campaignId}/likers`,
  userLikedCampaigns: (userId) => `${backendPath}/users/${userId}/liked-campaigns`
};

// ============================================================================
// USER PROFILE ENDPOINTS
// ============================================================================

export const user = {
  profile: `${backendPath}/api/user/profile`,
  updateProfile: `${backendPath}/api/user/profile`,
  uploadPicture: `${backendPath}/api/user/profile/picture`
};

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

export const admin = {
  // Authentication
  login: `${backendPath}/admin/login`,

  // Campaign management
  pending: `${backendPath}/admin/campaigns/pending`,
  approved: `${backendPath}/admin/campaigns/approved`,
  all: `${backendPath}/admin/campaigns/all`,
  approve: (campaignId) => `${backendPath}/admin/campaigns/${campaignId}/approve`,
  reject: (campaignId) => `${backendPath}/admin/campaigns/${campaignId}/reject`,
  suspend: (campaignId) => `${backendPath}/admin/campaigns/${campaignId}/suspend`,
  unsuspend: (campaignId) => `${backendPath}/admin/campaigns/${campaignId}/unsuspend`,

  // Shop verification
  verifyShop: (shopId) => `${backendPath}/admin/shops/${shopId}/verify`,
  rejectShop: (shopId) => `${backendPath}/admin/shops/${shopId}/reject`,

  // Statistics
  stats: `${backendPath}/admin/stats`
};

// ============================================================================
// CONTACT ENDPOINT
// ============================================================================

export const contact = {
  send: `${backendPath}/api/contact`
};

// ============================================================================
// EMAIL SUBSCRIPTION ENDPOINTS (for future use)
// ============================================================================

export const subscription = {
  subscribe: (campaignId) => `${backendPath}/campaigns/${campaignId}/subscribe`,
  unsubscribe: (campaignId) => `${backendPath}/campaigns/${campaignId}/subscribe`,
  byUser: (userId) => `${backendPath}/subscriptions/user/${userId}`
};

// Export backend path for direct use if needed
export { backendPath };

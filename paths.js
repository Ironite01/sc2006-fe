const backendPath = "http://localhost:3000";

export const auth = {
  login: `${backendPath}/login`,
  register: `${backendPath}/register`,
  logout: `${backendPath}/logout`,
  googleLogin: `${backendPath}/login/google`,
  azureLogin: `${backendPath}/login/azure`,
  azureCallback: `${backendPath}/login/azure/callback`,
  forgotPassword: `${backendPath}/user/forgot-password`,
  me: `${backendPath}/auth/me` // for pages that require jwt decoding
}

export const user = {
  getUserById: (userId) => `${backendPath}/user/${userId}`,
  updatePassword: `${backendPath}/user/update-password`,
  updateProfile: (userId) => `${backendPath}/user/${userId}`,
  rewards: (userId) => `${backendPath}/user/${userId}/rewards?limit=10000`,
  reward: (userId, userRewardId) => `${backendPath}/user/${userId}/rewards/${userRewardId}`,
}

export const admin = {
  datasets: `${backendPath}/admin/dataset`,
  dataset: (filename) => `${backendPath}/admin/dataset/${filename}`,
  users: `${backendPath}/admin/user`,
  updateUserRole: (userId) => `${backendPath}/admin/user/${userId}/role`,
  deleteUser: (userId) => `${backendPath}/admin/user/${userId}`,
  updateCampaignStatus: (campaignId) => `${backendPath}/admin/campaign/${campaignId}/status`,
  deleteCampaign: (campaignId) => `${backendPath}/admin/campaign/${campaignId}`,
  comments: `${backendPath}/admin/comment`,
  deleteComment: (commentId) => `${backendPath}/admin/comment/${commentId}`,
  getAllShops: () => `${backendPath}/admin/shops`,
  getShopsByStatus: (status) => `${backendPath}/admin/shops?status=${status}`,
  updateShopStatus: (id) => `${backendPath}/admin/shops/${id}/status`,
  deleteShop: (id) => `${backendPath}/admin/shops/${id}`,
}

export const campaigns = {
  getById: (campaignId) => `${backendPath}/campaigns/${campaignId}`,
  get: `${backendPath}/campaigns`,
  stats: `${backendPath}/campaigns/stats`,
  userReward: (campaignId, supporterId, userRewardId) => `${backendPath}/campaigns/${campaignId}/user/${supporterId}/rewards/${userRewardId}`
}

export const rewards = {
  getById: (campaignId, rewardId) => `${backendPath}/campaigns/${campaignId}/user/rewards/${rewardId}`,
}

export const updates = {
  getAllByCampaignId: (campaignId) => `${backendPath}/campaigns/${campaignId}/updates`,
  getById: (campaignId, updateId) => `${backendPath}/campaigns/${campaignId}/updates/${updateId}`,
  like: (campaignId, updateId) => `${backendPath}/campaigns/${campaignId}/updates/${updateId}/like`,
  comment: (campaignId, updateId) => `${backendPath}/campaigns/${campaignId}/updates/${updateId}/comment`,
  editComment: (campaignId, updateId, commentId) => `${backendPath}/campaigns/${campaignId}/updates/${updateId}/comment/${commentId}`,
  getByUserDonation: (userId) => `${backendPath}/updates/${userId}`
}

export const shop = {
  list: `${backendPath}/shops`,
  one: (id) => `${backendPath}/shops/${id}`
};

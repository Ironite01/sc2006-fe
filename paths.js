const backendPath = "http://localhost:3000";

export const auth = {
  login: `${backendPath}/login`,
  register: `${backendPath}/register`,
  logout: `${backendPath}/logout`,
  googleLogin: `${backendPath}/login/google`,
  forgotPassword: `${backendPath}/user/forgot-password`,
  me: `${backendPath}/auth/me` // for pages that require jwt decoding
}

export const user = {
  getUserById: (userId) => `${backendPath}/user/${userId}`,
  updatePassword: `${backendPath}/user/update-password`,
  updateProfile: (userId) => `${backendPath}/user/${userId}`,
  rewards: (userId) => `${backendPath}/user/${userId}/rewards?limit=10000`,
  reward: (userId, userRewardId) => `${backendPath}/user/${userId}/rewards/${userRewardId}`
}

export const admin = {
  datasets: `${backendPath}/admin/dataset`,
  dataset: (filename) => `${backendPath}/admin/dataset/${filename}`,
  users: `${backendPath}/admin/user`,
  updateUserRole: (userId) => `${backendPath}/admin/user/${userId}/role`,
  deleteUser: (userId) => `${backendPath}/admin/user/${userId}`,
  campaigns: `${backendPath}/admin/campaign`,
  updateCampaignStatus: (campaignId) => `${backendPath}/admin/campaign/${campaignId}/status`,
  deleteCampaign: (campaignId) => `${backendPath}/admin/campaign/${campaignId}`,
  comments: `${backendPath}/admin/comment`,
  deleteComment: (commentId) => `${backendPath}/admin/comment/${commentId}`
}

export const campaigns = {
  getById: (campaignId) => `${backendPath}/campaigns/${campaignId}`,
  get: `${backendPath}/campaigns`
}

export const updates = {
  getById: (campaignId, updateId) => `${backendPath}/campaigns/${campaignId}/updates/${updateId}`,
  like: (campaignId, updateId) => `${backendPath}/campaigns/${campaignId}/updates/${updateId}/like`,
  comment: (campaignId, updateId) => `${backendPath}/campaigns/${campaignId}/updates/${updateId}/comment`,
  editComment: (campaignId, updateId, commentId) => `${backendPath}/campaigns/${campaignId}/updates/${updateId}/comment/${commentId}`
}

export const shop = {
  list: `${backendPath}/shops`,
  one: (id) => `${backendPath}/shops/${id}`
};

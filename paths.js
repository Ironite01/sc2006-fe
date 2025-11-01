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
  updateProfile: (userId) => `${backendPath}/user/${userId}`
}

export const admin = {
  datasets: `${backendPath}/admin/dataset`,
  dataset: (filename) => `${backendPath}/admin/dataset/${filename}`
}

export const shop = {
  list: `${backendPath}/shops`,
  one: (id) => `${backendPath}/shops/${id}`
};

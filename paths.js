const backendPath = "http://localhost:3000";

export const auth = {
  login: `${backendPath}/login`,
  register: `${backendPath}/register`,
  logout: `${backendPath}/logout`,
  googleLogin: `${backendPath}/login/google`,
  forgotPassword: `${backendPath}/user/forgot-password`,

}

export const user = {
  getUserById: (userId) => `${backendPath}/user/${userId}`,
  updatePassword: `${backendPath}/user/update-password`,
  updateProfile: (userId) => `${backendPath}/user/${userId}`
}

export const shop = {
  list: `${backendPath}/shops`,
  one: (id) => `${backendPath}/shops/${id}`
};

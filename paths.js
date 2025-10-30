const backendPath = "http://localhost:3000";

export const auth = {
  login: `${backendPath}/login`,
  register: `${backendPath}/register`,
  logout: `${backendPath}/logout`,
  googleLogin: `${backendPath}/login/google`,
  forgotPassword: `${backendPath}/user/forgot-password`,

}

export const user = {
  updatePassword: `${backendPath}/user/update-password`
}

export const shop = {
  list: `${backendPath}/shops`,
  one: (id) => `${backendPath}/shops/${id}`
};

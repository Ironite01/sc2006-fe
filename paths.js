const backendPath = "http://localhost:3000";

export const auth = {
    login: `${backendPath}/login`,
    register: `${backendPath}/register`,
    logout: `${backendPath}/logout`,
    checkAuth: `${backendPath}/auth/check`,
    googleLogin: `${backendPath}/login/google`,
    azureLogin: `${backendPath}/login/azure`
}

export const shop = {
  list: `${backendPath}/shops`,
  one: (id) => `${backendPath}/shops/${id}`
};

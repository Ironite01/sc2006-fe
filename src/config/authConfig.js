export const msalConfig = {
  auth: {
    clientId: "779b7f5a-66ad-4d43-8ec0-5168ea484d58",
    authority:
      "https://login.microsoftonline.com/864854ef-562d-4757-a729-5fd7cfa5d500",
    redirectUri: "http://localhost:5173/auth/callback",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read"]
};

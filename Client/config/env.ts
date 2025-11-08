// Environment configuration
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const ENV = {
  API_BASE_URL,
  API_ENDPOINTS: {
    USERS: `${API_BASE_URL}/users`,
    AUTH: `${API_BASE_URL}/auth`,
  },
};

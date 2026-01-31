import { apiClient } from './client';

export const authApi = {
  signup(email, password) {
    return apiClient.post('/auth/signup', { email, password });
  },

  login(email, password) {
    return apiClient.post('/auth/login', { email, password });
  },
};

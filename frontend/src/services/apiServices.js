import apiClient from './apiClient';
export { bookingService } from './bookingService';

export const authService = {
  login: async (googleToken) => {
    const response = await apiClient.post('/auth/login', { token: googleToken });
    return response.data;
  },

  logout: async () => {
    return await apiClient.post('/auth/logout');
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },
};

export const resourceService = {
  getAll: async (filters = {}) => {
    const response = await apiClient.get('/resources', { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/resources/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/resources', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/resources/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    return await apiClient.delete(`/resources/${id}`);
  },
};

export const ticketService = {
  getAll: async (filters = {}) => {
    const response = await apiClient.get('/tickets', { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/tickets/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/tickets', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/tickets/${id}`, data);
    return response.data;
  },

  updateStatus: async (id, status, notes = '') => {
    const response = await apiClient.patch(`/tickets/${id}/status`, { status, notes });
    return response.data;
  },

  addComment: async (id, comment) => {
    const response = await apiClient.post(`/tickets/${id}/comments`, { comment });
    return response.data;
  },
};

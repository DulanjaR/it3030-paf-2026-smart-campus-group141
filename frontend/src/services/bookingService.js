import apiClient from './apiClient';

export const bookingService = {
  getAll: async (filters = {}) => {
    const response = await apiClient.get('/bookings', { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/bookings', data);
    return response.data;
  },

  approve: async (id) => {
    const response = await apiClient.patch(`/bookings/${id}/approve`);
    return response.data;
  },

  reject: async (id, rejectionReason) => {
    const response = await apiClient.patch(`/bookings/${id}/reject`, { rejectionReason });
    return response.data;
  },

  cancel: async (id) => {
    const response = await apiClient.patch(`/bookings/${id}/cancel`);
    return response.data;
  },
};

export default bookingService;

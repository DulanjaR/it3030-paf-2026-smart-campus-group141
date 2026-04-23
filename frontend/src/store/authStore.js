import { create } from 'zustand';

const storedToken = localStorage.getItem('authToken');
const storedUser = localStorage.getItem('user');

const useAuthStore = create((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user });
  },
  
  setToken: (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
    set({ token, isAuthenticated: !!token });
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  loadFromStorage: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    set({
      token,
      user: user ? JSON.parse(user) : null,
      isAuthenticated: !!token,
    });
  },
}));

export { useAuthStore };

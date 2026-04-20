import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('authToken') || null,
  isAuthenticated: !!localStorage.getItem('authToken'),
  
  setUser: (user) => set({ user }),
  
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

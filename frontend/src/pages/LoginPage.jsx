import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const USE_GOOGLE_AUTH = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'your-google-client-id-here';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  // Mock login for development
  const handleMockLogin = () => {
    const mockUser = {
      id: '1',
      email: 'dev@smartcampus.local',
      firstName: 'Dev',
      lastName: 'User',
      role: 'ADMIN',
    };
    setToken('mock-token-' + Date.now());
    setUser(mockUser);
    navigate('/dashboard');
  };

  // Google login
  const handleGoogleLogin = async () => {
    try {
      // This would use real Google OAuth in production
      const mockUser = {
        id: '1',
        email: 'user@gmail.com',
        firstName: 'User',
        lastName: 'Name',
        role: 'STUDENT',
      };
      setToken('google-token-' + Date.now());
      setUser(mockUser);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
          Smart Campus
        </h1>
        <p className="mb-8 text-center text-gray-600">
          Operations Hub
        </p>

        {USE_GOOGLE_AUTH ? (
          <button
            onClick={handleGoogleLogin}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign in with Google
          </button>
        ) : (
          <>
            <button
              onClick={handleMockLogin}
              className="w-full rounded-lg bg-green-600 px-4 py-3 text-white font-semibold hover:bg-green-700 transition-colors"
            >
              Login (Development Mode)
            </button>
            <p className="mt-4 text-xs text-center text-yellow-600 bg-yellow-50 p-2 rounded">
              ℹ️ Google OAuth not configured. Using mock authentication.
            </p>
          </>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          © 2026 Smart Campus. All rights reserved.
        </p>
      </div>
    </div>
  );
}

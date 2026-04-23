import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/apiServices';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      setIsLoading(true);

      try {
        if (!tokenResponse.access_token) {
          throw new Error('Google did not return an access token.');
        }

        const data = await authService.login(tokenResponse.access_token);
        setToken(data.token);
        setUser(data.user);
        navigate('/dashboard');
      } catch (error) {
        console.error('Login failed:', error);
        setError(error.response?.data?.message || error.message || 'Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError('Google sign-in was cancelled or failed. Please try again.');
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
          Smart Campus
        </h1>
        <p className="mb-8 text-center text-gray-600">
          Operations Hub
        </p>

        <button
          onClick={() => login()}
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          © 2026 Smart Campus. All rights reserved.
        </p>
      </div>
    </div>
  );
}

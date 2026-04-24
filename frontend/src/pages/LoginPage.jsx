import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../services/member4API';

/**
 * Member 4 - LoginPage Component
 * OAuth 2.0 Google Sign-In
 * Entry point for all users - required before accessing any other features
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const useGoogleAuth = googleClientId && googleClientId !== 'your-google-client-id-here';

  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    setError(null);

    try {
      if (!credentialResponse?.credential) {
        throw new Error('Google credential was not returned. Please try again.');
      }

      const data = await authAPI.loginWithGoogle(credentialResponse.credential);
      setToken(data.token);
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = () => {
    const mockUser = {
      id: 1,
      email: 'dev@smartcampus.local',
      firstName: 'Dev',
      lastName: 'User',
      role: 'ADMIN',
    };
    setToken('mock-token-' + Date.now());
    setUser(mockUser);
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-2xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
          Smart Campus
        </h1>
        <p className="mb-8 text-center text-gray-600">Operations Hub</p>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-center text-gray-700">
            Sign in to manage facilities, bookings, and incidents
          </p>

          {useGoogleAuth ? (
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError('Google login failed. Please try again.')}
              />
            </div>
          ) : (
            <>
              <button
                onClick={handleMockLogin}
                disabled={loading}
                className="w-full rounded-lg bg-green-600 px-4 py-3 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login (Development Mode)'}
              </button>
              <p className="text-xs text-center text-yellow-600 bg-yellow-50 p-2 rounded">
                ℹ️ Google OAuth not configured. Set VITE_GOOGLE_CLIENT_ID in frontend/.env.local.
              </p>
            </>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-xs text-center">
            Secure OAuth 2.0 Login | No password stored
          </p>
        </div>
      </div>
    </div>
  );
}

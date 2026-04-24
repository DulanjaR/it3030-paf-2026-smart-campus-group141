import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/authStore';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import apiClient from '../services/apiClient';
import { authService } from '../services/apiServices';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const USE_GOOGLE_AUTH = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'your-google-client-id-here';

function GoogleSignInButton({ onSuccess, onError, disabled }) {
  const login = useGoogleLogin({
    onSuccess,
    onError,
  });

  return (
    <button
      type="button"
      onClick={login}
      disabled={disabled}
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-60"
    >
      {disabled ? 'Signing in with Google...' : 'Sign in with Google'}
    </button>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/users/login', {
        email,
        password,
      });

      const { user, token } = response.data;
      setToken(token);
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (tokenResponse) => {
      setError('');
      setGoogleLoading(true);

      try {
        if (!tokenResponse.access_token) {
          throw new Error('Google did not return an access token.');
        }

        const data = await authService.login(tokenResponse.access_token);
        setToken(data.token);
        setUser(data.user);
        navigate('/dashboard');
      } catch (requestError) {
        setError(
          requestError.response?.data?.message
            || requestError.message
            || 'Login failed. Please try again.'
        );
      } finally {
        setGoogleLoading(false);
      }
    };

  const onGoogleError = () => {
    setError('Google sign-in was cancelled or failed. Please try again.');
  };

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
          Smart Campus
        </h1>
        <p className="mb-8 text-center text-gray-600">
          Operations Hub
        </p>

        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            {USE_GOOGLE_AUTH ? (
              <GoogleSignInButton
                onSuccess={onGoogleSuccess}
                onError={onGoogleError}
                disabled={googleLoading}
              />
            ) : (
              <button
                type="button"
                onClick={handleMockLogin}
                className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-white font-semibold hover:bg-green-700 transition-colors"
              >
                Login (Dev Mode)
              </button>
            )}
          </form>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
              Sign up
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          (c) 2026 Smart Campus. All rights reserved.
        </p>
      </div>
    </div>
  );
}

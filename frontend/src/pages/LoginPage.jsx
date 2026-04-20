import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        // Send the token to your backend
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: codeResponse.access_token }),
        });

        if (response.ok) {
          const data = await response.json();
          setToken(data.token);
          setUser(data.user);
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Login failed:', error);
      }
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
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          Sign in with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          © 2026 Smart Campus. All rights reserved.
        </p>
      </div>
    </div>
  );
}

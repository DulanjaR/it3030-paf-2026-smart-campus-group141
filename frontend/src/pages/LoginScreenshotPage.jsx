import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

export default function LoginScreenshotPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-gray-100">
        <h1 className="text-center text-4xl font-bold text-gray-900">
          SmartCampus
        </h1>
        <p className="mt-2 text-center text-gray-500">
          Secure access to Smart Campus Operations Hub
        </p>

        <form className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value="student@smartcampus.edu"
                readOnly
                className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-gray-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value="password123"
                readOnly
                className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-gray-800 outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow hover:bg-blue-700"
          >
            Sign In
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <button
            type="button"
            className="w-full rounded-xl border border-gray-300 bg-white py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Sign in with Google
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/signup-preview" className="font-semibold text-blue-600">
            Sign up
          </Link>
        </p>

        <p className="mt-8 text-center text-xs text-gray-400">
          Role-based secure authentication for USER and ADMIN access
        </p>
      </div>
    </div>
  );
}
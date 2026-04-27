import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Layout from './components/layout/Layout';
import WelcomePage from './components/WelcomePage';

import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage';
import ResourcesPage from './pages/ResourcesPage';
import BookingsPage from './pages/BookingsPage';
import AddResourcePage from './pages/AddResourcePage';
import EditResourcePage from './pages/EditResourcePage';
import CataloguePage from './pages/CataloguePage';
import ResourceDetailsPage from './pages/ResourceDetailsPage';
import NotificationsPage from './pages/NotificationsPage';
import RoleManagementPage from './pages/RoleManagementPage';
import UserBookingsPage from './pages/UserBookingsPage';
import UserTicketsPage from './pages/UserTicketsPage';

import { useAuthStore } from './store/authStore';
import './App.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const USE_GOOGLE_AUTH =
  GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'your-google-client-id-here';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/welcome" replace /> : <LoginPage />}
        />

        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/welcome" replace /> : <SignUpPage />}
        />

        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <WelcomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <Layout>
                <TicketsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute>
              <UserTicketsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Layout>
                <NotificationsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <Layout>
                <BookingsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
                <UserBookingsPage />
            </ProtectedRoute>
          }
/>

        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <Layout>
                <ResourcesPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/resources/add"
          element={
            <ProtectedRoute>
              <Layout>
                <AddResourcePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/resources/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditResourcePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/roles"
          element={
            <ProtectedRoute>
              <Layout>
                <RoleManagementPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/catalogue"
          element={
            <ProtectedRoute>
              <CataloguePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/catalogue/:id"
          element={
            <ProtectedRoute>
              <ResourceDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  if (USE_GOOGLE_AUTH) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AppRoutes />
      </GoogleOAuthProvider>
    );
  }

  return <AppRoutes />;
}
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import BookingsPage from './pages/BookingsPage';
import TicketsPage from './pages/TicketsPage';
import ResourcesPage from './pages/ResourcesPage';
import AddResourcePage from './pages/AddResourcePage';
import EditResourcePage from './pages/EditResourcePage';
import CataloguePage from './pages/CataloguePage';
import ResourceDetailsPage from './pages/ResourceDetailsPage';
import { useAuthStore } from './store/authStore';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id-here';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />

          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            )}
          />

          <Route
            path="/bookings"
            element={(
              <ProtectedRoute>
                <Layout>
                  <BookingsPage />
                </Layout>
              </ProtectedRoute>
            )}
          />

          <Route
            path="/tickets"
            element={(
              <ProtectedRoute>
                <Layout>
                  <TicketsPage />
                </Layout>
              </ProtectedRoute>
            )}
          />

          <Route
            path="/resources"
            element={(
              <ProtectedRoute>
                <Layout>
                  <ResourcesPage />
                </Layout>
              </ProtectedRoute>
            )}
          />

          <Route
            path="/resources/add"
            element={(
              <ProtectedRoute>
                <Layout>
                  <AddResourcePage />
                </Layout>
              </ProtectedRoute>
            )}
          />

          <Route
            path="/resources/edit/:id"
            element={(
              <ProtectedRoute>
                <Layout>
                  <EditResourcePage />
                </Layout>
              </ProtectedRoute>
            )}
          />

          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/catalogue/:id" element={<ResourceDetailsPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

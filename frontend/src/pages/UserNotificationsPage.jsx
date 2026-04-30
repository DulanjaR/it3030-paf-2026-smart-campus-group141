import Header from '../components/Header';
import NotificationsPage from './NotificationsPage';

export default function UserNotificationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <NotificationsPage />
      </main>
    </div>
  );
}
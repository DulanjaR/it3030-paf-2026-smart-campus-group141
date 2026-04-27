import { useEffect, useState } from 'react';
import { Eye, CalendarDays, Clock, MapPin } from 'lucide-react';
import Header from '../components/Header';
import bookingService from '../services/bookingService';
import BookingDetailsModal from '../components/bookings/BookingDetailsModal';

const statusClasses = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-700',
};

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await bookingService.getAll();
      setBookings(Array.isArray(data) ? data : data.content || []);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setError(error.response?.data?.message || 'Could not load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-gray-600">
            View your resource booking requests and their current status.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
            No bookings found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {booking.resourceName || 'Resource Booking'}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Booking #{booking.id}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusClasses[booking.status] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="space-y-3 rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-blue-500" />
                    <span>
                      <span className="font-medium">Date:</span> {booking.date || '—'}
                    </span>
                  </p>

                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-500" />
                    <span>
                      <span className="font-medium">Time:</span>{' '}
                      {booking.startTime || '—'} - {booking.endTime || '—'}
                    </span>
                  </p>

                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-500" />
                    <span>
                      <span className="font-medium">Purpose:</span>{' '}
                      {booking.purpose || booking.reason || '—'}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  <Eye size={18} />
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <BookingDetailsModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
}
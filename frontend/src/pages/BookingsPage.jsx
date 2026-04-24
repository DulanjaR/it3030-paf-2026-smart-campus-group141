import { useEffect, useState } from 'react';
import { Eye, Plus } from 'lucide-react';
import BookingFormModal from '../components/bookings/BookingFormModal';
import BookingDetailsModal from '../components/bookings/BookingDetailsModal';
import bookingService from '../services/bookingService';
import { resourceService } from '../services/apiServices';
import { useAuthStore } from '../store/authStore';

const statusClasses = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-700',
};

export default function BookingsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState({
    date: '',
    resourceId: '',
    status: '',
  });
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    loadResources();
    loadBookings();
  }, []);

  const loadResources = async () => {
    try {
      const data = await resourceService.getAll();
      setResources(Array.isArray(data) ? data : data.content || []);
    } catch (error) {
      console.error('Failed to load resources:', error);
    }
  };

  const loadBookings = async (activeFilters = filters) => {
    setLoading(true);
    setActionMessage('');

    try {
      const query = Object.fromEntries(
        Object.entries(activeFilters).filter(([, value]) => value !== '')
      );
      const data = await bookingService.getAll(query);
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setActionMessage(error.response?.data?.message || 'Could not load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const resetFilters = () => {
    const emptyFilters = { date: '', resourceId: '', status: '' };
    setFilters(emptyFilters);
    loadBookings(emptyFilters);
  };

  const createBooking = async (bookingData) => {
    setIsSubmitting(true);
    setFormError('');

    try {
      await bookingService.create(bookingData);
      setFormOpen(false);
      await loadBookings();
    } catch (error) {
      const message = error.response?.data?.message || 'Could not create booking.';
      setFormError(
        error.response?.status === 409
          ? 'This resource is already booked for the selected time.'
          : message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const approveBooking = async (id) => {
    await runAction(() => bookingService.approve(id));
  };

  const rejectBooking = async (id) => {
    const reason = window.prompt('Enter rejection reason:');
    if (!reason) {
      return;
    }
    await runAction(() => bookingService.reject(id, reason));
  };

  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) {
      return;
    }
    await runAction(() => bookingService.cancel(id));
  };

  const runAction = async (action) => {
    setActionMessage('');
    try {
      await action();
      await loadBookings();
    } catch (error) {
      setActionMessage(error.response?.data?.message || 'Action failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="mt-1 text-gray-600">Create bookings and manage approval workflow.</p>
        </div>
        <button
          onClick={() => {
            setFormError('');
            setFormOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          New Booking
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={updateFilter}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Resource</label>
            <select
              name="resourceId"
              value={filters.resourceId}
              onChange={updateFilter}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">All resources</option>
              {resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={updateFilter}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={() => loadBookings()}
              className="flex-1 rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800"
            >
              Search
            </button>
            <button
              onClick={resetFilters}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {actionMessage && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionMessage}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <TableHeader>Resource</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Time</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    Loading bookings...
                  </td>
                </tr>
              )}

              {!loading && bookings.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              )}

              {!loading && bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <TableCell>{booking.resourceName}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.startTime} - {booking.endTime}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[booking.status]}`}>
                      {booking.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Eye size={14} />
                        View
                      </button>

                      {isAdmin && booking.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => approveBooking(booking.id)}
                            className="rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectBooking(booking.id)}
                            className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {!isAdmin && ['PENDING', 'APPROVED'].includes(booking.status) && (
                        <button
                          onClick={() => cancelBooking(booking.id)}
                          className="rounded-md bg-gray-700 px-3 py-1 text-sm font-medium text-white hover:bg-gray-800"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <BookingFormModal
        isOpen={formOpen}
        resources={resources}
        onClose={() => setFormOpen(false)}
        onSubmit={createBooking}
        serverError={formError}
        isSubmitting={isSubmitting}
      />

      <BookingDetailsModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
}

function TableHeader({ children }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
      {children}
    </th>
  );
}

function TableCell({ children }) {
  return (
    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
      {children}
    </td>
  );
}

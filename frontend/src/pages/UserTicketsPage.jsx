import { useEffect, useState } from 'react';
import { FileText, Plus, Eye, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import { useAuthStore } from '../store/authStore';

const statusClasses = {
  OPEN: 'bg-red-100 text-red-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
};

const priorityClasses = {
  CRITICAL: 'text-red-600',
  HIGH: 'text-orange-600',
  MEDIUM: 'text-yellow-600',
  LOW: 'text-green-600',
};

export default function UserTicketsPage() {
  const { user } = useAuthStore();

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [user?.id]);

  const fetchTickets = async () => {
    if (!user?.id) {
      setTickets([]);
      setError('User ID missing. Please log out and log in again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `http://localhost:8081/api/tickets/my-tickets?userId=${user.id}&page=0&size=20`
      );

      const data = await res.json();
      setTickets(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      setError('Could not load your tickets.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        <div className="flex items-center justify-between rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
            <p className="mt-2 text-gray-600">
              View your submitted support tickets and their current status.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Create Ticket
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500 shadow-sm">
            Loading tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500 shadow-sm">
            No tickets found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                      <FileText size={22} />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {ticket.title}
                      </h2>
                      <p className="mt-1 text-xs text-gray-500">
                        Ticket #{ticket.id}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusClasses[ticket.status] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <p className="mb-4 line-clamp-3 text-sm leading-6 text-gray-600">
                  {ticket.description || 'No description available.'}
                </p>

                <div className="space-y-2 rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Created by:</span>{' '}
                    {ticket.creatorName || '—'}
                  </p>

                  {ticket.assignedTo && (
                    <p>
                      <span className="font-medium">Assigned to:</span>{' '}
                      {ticket.assignedTo}
                    </p>
                  )}

                  <p>
                    <span className="font-medium">Priority:</span>{' '}
                    <span className={priorityClasses[ticket.priority] || 'text-gray-600'}>
                      {ticket.priority || '—'}
                    </span>
                  </p>

                  <p className="text-xs text-gray-500">
                    💬 {ticket.commentCount || 0} Comments | 📎{' '}
                    {ticket.attachmentCount || 0} Attachments
                  </p>
                </div>

                <button
                  onClick={() => setSelectedTicket(ticket)}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 transition"
                >
                  <Eye size={18} />
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <CreateTicketModal
          userId={user?.id}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchTickets();
          }}
        />
      )}

      {selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}

function CreateTicketModal({ onClose, onSuccess, userId }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'GENERAL_INQUIRY',
    priority: 'MEDIUM',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert('User session missing. Please log out and log in again.');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/api/tickets?userId=${userId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      const payload = await response.json().catch(() => ({}));

      if (response.ok) {
        alert('Ticket created successfully!');
        onSuccess();
      } else {
        alert(payload?.error || payload?.message || 'Failed to create ticket');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to create ticket');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Ticket</h2>
            <p className="mt-1 text-sm text-gray-500">
              Submit a support request to campus operations.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              required
              minLength={5}
              maxLength={200}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the issue"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              required
              minLength={10}
              maxLength={5000}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detailed description of the problem"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TECHNICAL">Technical</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="BILLING">Billing</option>
                <option value="GENERAL_INQUIRY">General</option>
                <option value="COMPLAINT">Complaint</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TicketDetailsModal({ ticket, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              #{ticket.id} - {ticket.title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">Ticket Details</p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 p-6 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Description:</span>{' '}
            {ticket.description || '—'}
          </p>

          <p>
            <span className="font-semibold">Status:</span>{' '}
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                statusClasses[ticket.status] || 'bg-gray-100 text-gray-700'
              }`}
            >
              {ticket.status}
            </span>
          </p>

          <p>
            <span className="font-semibold">Priority:</span>{' '}
            <span className={priorityClasses[ticket.priority] || 'text-gray-600'}>
              {ticket.priority || '—'}
            </span>
          </p>

          <p>
            <span className="font-semibold">Created by:</span>{' '}
            {ticket.creatorName || '—'}
          </p>

          <p>
            <span className="font-semibold">Assigned to:</span>{' '}
            {ticket.assignedTo || 'Not assigned'}
          </p>

          <p>
            <span className="font-semibold">Comments:</span>{' '}
            {ticket.commentCount || 0}
          </p>

          <p>
            <span className="font-semibold">Attachments:</span>{' '}
            {ticket.attachmentCount || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
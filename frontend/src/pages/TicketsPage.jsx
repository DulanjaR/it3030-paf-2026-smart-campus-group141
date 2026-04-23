import React, { useState, useEffect } from 'react';
import { AlertCircle, FileText, Plus, Filter, Clock, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const TicketsPage = () => {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);

  // Fetch tickets
  useEffect(() => {
    fetchTickets();
  }, [filter, page]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:8081/api/tickets?page=${page}&size=10`;
      
      if (filter === 'my') {
        url = `http://localhost:8081/api/tickets/my-tickets?userId=${user?.id}&page=${page}&size=10`;
      } else if (filter === 'open') {
        url = `http://localhost:8081/api/tickets/filter/status?status=OPEN&page=${page}&size=10`;
      } else if (filter === 'in-progress') {
        url = `http://localhost:8081/api/tickets/filter/status?status=IN_PROGRESS&page=${page}&size=10`;
      } else if (filter === 'resolved') {
        url = `http://localhost:8081/api/tickets/filter/status?status=RESOLVED&page=${page}&size=10`;
      } else if (filter === 'urgent') {
        url = `http://localhost:8081/api/tickets/filter/priority?priority=CRITICAL&page=${page}&size=10`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setTickets(data.content || []);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN':
        return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return 'text-red-600';
      case 'HIGH':
        return 'text-orange-600';
      case 'MEDIUM':
        return 'text-yellow-600';
      case 'LOW':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Support Tickets</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          New Ticket
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { value: 'all', label: 'All Tickets' },
          { value: 'my', label: 'My Tickets' },
          { value: 'open', label: 'Open' },
          { value: 'in-progress', label: 'In Progress' },
          { value: 'resolved', label: 'Resolved' },
          { value: 'urgent', label: '🔴 Urgent' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setFilter(f.value);
              setPage(0);
            }}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
              filter === f.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No tickets found</div>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg cursor-pointer transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText size={20} className="text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">{ticket.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{ticket.description.substring(0, 100)}...</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>Created by: {ticket.creatorName}</span>
                    {ticket.assignedTo && <span>Assigned to: {ticket.assignedTo}</span>}
                    <span className={getPriorityColor(ticket.priority)}>
                      {ticket.priority} Priority
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-2">
                    💬 {ticket.commentCount} 📎 {ticket.attachmentCount}
                  </div>
                  <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <CreateTicketModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchTickets();
          }}
          userId={user?.id}
        />
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={() => fetchTickets()}
          userId={user?.id}
        />
      )}
    </div>
  );
};

// Create Ticket Modal
const CreateTicketModal = ({ onClose, onSuccess, userId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'GENERAL_INQUIRY',
    priority: 'MEDIUM',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8081/api/tickets?userId=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Ticket created successfully!');
        onSuccess();
      }
    } catch (error) {
      alert('Failed to create ticket');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Create New Ticket</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              minLength={5}
              maxLength={200}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the issue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              minLength={10}
              maxLength={5000}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detailed description of the problem"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TECHNICAL">Technical</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="BILLING">Billing</option>
                <option value="GENERAL_INQUIRY">General</option>
                <option value="COMPLAINT">Complaint</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Ticket Detail Modal
const TicketDetailModal = ({ ticket, onClose, onUpdate, userId }) => {
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState(ticket.status);
  const [assignedTo, setAssignedTo] = useState(ticket.assignedTo || '');

  useEffect(() => {
    fetchTicketDetails();
  }, [ticket.id]);

  const fetchTicketDetails = async () => {
    try {
      const [commentsRes, attachmentsRes] = await Promise.all([
        fetch(`http://localhost:8081/api/tickets/${ticket.id}/comments?page=0&size=10`),
        fetch(`http://localhost:8081/api/tickets/${ticket.id}/attachments?page=0&size=10`),
      ]);

      setComments((await commentsRes.json()).content || []);
      setAttachments((await attachmentsRes.json()).content || []);
    } catch (error) {
      console.error('Failed to fetch details:', error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`http://localhost:8081/api/tickets/${ticket.id}/comments?userId=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        setNewComment('');
        fetchTicketDetails();
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const updateStatus = async (status) => {
    try {
      const response = await fetch(`http://localhost:8081/api/tickets/${ticket.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setNewStatus(status);
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const assignTechnician = async () => {
    if (!assignedTo.trim()) return;

    try {
      const response = await fetch(`http://localhost:8081/api/tickets/${ticket.id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ technicianEmail: assignedTo }),
      });

      if (response.ok) {
        alert('Ticket assigned successfully!');
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to assign ticket:', error);
    }
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://localhost:8081/api/tickets/${ticket.id}/attachments`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        fetchTicketDetails();
      } else {
        alert('Failed to upload file');
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">#{ticket.id} - {ticket.title}</h2>
            <p className="text-gray-600 text-sm mt-1">{ticket.description}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={newStatus}
                onChange={(e) => updateStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <span className="text-lg font-semibold">{ticket.priority}</span>
            </div>
          </div>

          {/* Assign Technician */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign To Technician</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="technician@campus.edu"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={assignTechnician}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Assign
              </button>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attachments ({attachments.length}/3)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                accept="image/*"
                disabled={attachments.length >= 3}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:text-blue-700">
                Click to upload image (max 3)
              </label>
            </div>
            <div className="mt-3 space-y-2">
              {attachments.map((att) => (
                <a
                  key={att.id}
                  href={att.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline text-sm"
                >
                  📎 {att.fileName} ({(att.fileSize / 1024).toFixed(2)} KB)
                </a>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Comments ({comments.length})</h3>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {loading ? (
                <p className="text-gray-500">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="text-gray-500 text-sm">No comments yet</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm">{comment.authorName}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
              <button
                onClick={addComment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketsPage;

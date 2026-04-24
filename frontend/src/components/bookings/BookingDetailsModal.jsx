const statusClasses = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-700',
};

export default function BookingDetailsModal({ booking, onClose }) {
  if (!booking) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
          <button onClick={onClose} className="rounded-md px-3 py-1 text-gray-500 hover:bg-gray-100">
            Close
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-600">Status</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[booking.status]}`}>
              {booking.status}
            </span>
          </div>

          <Detail label="Resource" value={booking.resourceName} />
          <Detail label="Booked By" value={`${booking.userName} (${booking.userEmail})`} />
          <Detail label="Date" value={booking.date} />
          <Detail label="Time" value={`${booking.startTime} - ${booking.endTime}`} />
          <Detail label="Purpose" value={booking.purpose} />

          {booking.status === 'REJECTED' && booking.rejectionReason && (
            <div className="rounded-lg bg-red-50 p-4 text-red-700">
              <p className="font-semibold">Rejection Reason</p>
              <p className="mt-1">{booking.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="font-medium text-gray-600">{label}</p>
      <p className="mt-1 text-gray-900">{value || '-'}</p>
    </div>
  );
}

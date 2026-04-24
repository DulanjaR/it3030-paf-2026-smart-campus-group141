import { useEffect, useState } from 'react';

const today = new Date().toISOString().split('T')[0];

const createInitialForm = (resourceId = '', expectedAttendees = '') => ({
  resourceId: resourceId ? String(resourceId) : '',
  date: today,
  startTime: '',
  endTime: '',
  purpose: '',
  expectedAttendees: expectedAttendees ? String(expectedAttendees) : '',
});

export default function BookingFormModal({
  isOpen,
  resources,
  onClose,
  onSubmit,
  serverError,
  isSubmitting,
  initialResourceId = '',
  initialResourceName = '',
  initialExpectedAttendees = '',
  showExpectedAttendees = false,
  title = 'New Booking',
}) {
  const [form, setForm] = useState(createInitialForm(initialResourceId, initialExpectedAttendees));
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm(createInitialForm(initialResourceId, initialExpectedAttendees));
    setValidationError('');
  }, [initialExpectedAttendees, initialResourceId, isOpen]);

  if (!isOpen) {
    return null;
  }

  const showFallbackResourceOption = initialResourceId
    && initialResourceName
    && !resources.some((resource) => String(resource.id) === String(initialResourceId));

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setValidationError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.resourceId || !form.date || !form.startTime || !form.endTime || !form.purpose.trim()) {
      setValidationError('Please fill in all required fields.');
      return;
    }

    if (form.startTime >= form.endTime) {
      setValidationError('Start time must be before end time.');
      return;
    }

    onSubmit({
      resourceId: Number(form.resourceId),
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      purpose: form.purpose.trim(),
      expectedAttendees: form.expectedAttendees ? Number(form.expectedAttendees) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="rounded-md px-3 py-1 text-gray-500 hover:bg-gray-100">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Resource</label>
            <select
              name="resourceId"
              value={form.resourceId}
              onChange={updateField}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select a resource</option>
              {showFallbackResourceOption && (
                <option value={String(initialResourceId)}>
                  {initialResourceName}
                </option>
              )}
              {resources.map((resource) => (
                <option key={resource.id} value={String(resource.id)}>
                  {resource.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              min={today}
              value={form.date}
              onChange={updateField}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={updateField}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={updateField}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Purpose</label>
            <textarea
              name="purpose"
              value={form.purpose}
              onChange={updateField}
              rows="3"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Example: Group study session"
            />
          </div>

          {showExpectedAttendees && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Expected Attendees</label>
              <input
                type="number"
                name="expectedAttendees"
                min="1"
                value={form.expectedAttendees}
                onChange={updateField}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Example: 30"
              />
            </div>
          )}

          {(validationError || serverError) && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError || validationError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isSubmitting ? 'Creating...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../services/apiClient';

export default function EditResourcePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'LECTURE_HALL',
    location: '',
    capacity: '',
    amenities: '',
    available: true,
    imageUrl: '',
    availableDays: '',
    availableFrom: '',
    availableTo: '',
  });

  useEffect(() => {
    fetchResource();
  }, []);

  const fetchResource = async () => {
    try {
      const res = await apiClient.get(`/resources/${id}`);
      setForm({
        name: res.data.name || '',
        description: res.data.description || '',
        type: res.data.type || 'LECTURE_HALL',
        location: res.data.location || '',
        capacity: res.data.capacity || '',
        amenities: res.data.amenities || '',
        available: res.data.available ?? true,
        imageUrl: res.data.imageUrl || '',
        availableDays: res.data.availableDays || '',
        availableFrom: res.data.availableFrom
          ? res.data.availableFrom.slice(0, 5)
          : '',
        availableTo: res.data.availableTo
          ? res.data.availableTo.slice(0, 5)
          : '',
      });
    } catch (error) {
      console.error('Error fetching resource:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    await apiClient.put(`/resources/${id}`, {
      ...form,
      capacity: Number(form.capacity),
      pricePerHour: 0,
      availableFrom: form.availableFrom ? `${form.availableFrom}:00` : null,
      availableTo: form.availableTo ? `${form.availableTo}:00` : null,
    });

    navigate('/resources');
  } catch (error) {
    console.error('Error updating resource:', error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Resource</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update the resource details and availability window
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Resource Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              placeholder="Description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Resource Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Lab</option>
              <option value="AUDITORIUM">Auditorium</option>
              <option value="SPORTS_FACILITY">Sports Facility</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="EQUIPMENT">Equipment</option>
              <option value="SEMINAR_HALL">Seminar Hall</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              placeholder="Location"
              required
              value={form.location}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Capacity</label>
            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              required
              value={form.capacity}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
            <select
              name="available"
              value={String(form.available)}
              onChange={(e) =>
                setForm({
                  ...form,
                  available: e.target.value === 'true',
                })
              }
              className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="true">Active</option>
              <option value="false">Out of Service</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Amenities</label>
            <input
              type="text"
              name="amenities"
              placeholder="e.g. AC, Projector, Sound System"
              value={form.amenities}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Availability Window</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Available Days</label>
              <input
                type="text"
                name="availableDays"
                placeholder="e.g. MONDAY-SATURDAY"
                value={form.availableDays}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">From</label>
              <input
                type="time"
                name="availableFrom"
                value={form.availableFrom}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">To</label>
              <input
                type="time"
                name="availableTo"
                value={form.availableTo}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-lg py-2.5 font-medium text-white transition 
          ${loading ? 'bg-yellow-300 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'}`}
          >
          {loading ? 'Updating...' : 'Update Resource'}
          </button>
      </form>
    </div>
  );
}
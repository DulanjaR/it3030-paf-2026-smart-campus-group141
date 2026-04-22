import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../services/apiClient';

export default function EditResourcePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'LECTURE_HALL',
    location: '',
    capacity: '',
    amenities: '',
    available: true,
    imageUrl: '',
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

    try {
      await apiClient.put(`/resources/${id}`, {
        ...form,
        capacity: Number(form.capacity),
        pricePerHour: 0
      });

      navigate('/resources');
    } catch (error) {
      console.error('Error updating resource:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Edit Resource</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="LECTURE_HALL">Lecture Hall</option>
          <option value="LAB">Lab</option>
          <option value="MEETING_ROOM">Meeting Room</option>
          <option value="EQUIPMENT">Equipment</option>
          <option value="AUDITORIUM">Auditorium</option>
          <option value="SPORTS_FACILITY">Sports Facility</option>
        </select>

        <input
          type="text"
          name="location"
          placeholder="Location"
          required
          value={form.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          required
          value={form.capacity}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="amenities"
          placeholder="Amenities"
          value={form.amenities}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="available"
            checked={form.available}
            onChange={handleChange}
          />
          Available
        </label>

        <button
          type="submit"
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          Update Resource
        </button>
      </form>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

export default function AddResourcePage() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiClient.post('/resources', {
        ...form,
        capacity: Number(form.capacity),
        pricePerHour: 0 // backend requires it, keep 0
      });

      navigate('/resources');
    } catch (error) {
      console.error('Error adding resource:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Add Resource</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="type"
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
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          required
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="amenities"
          placeholder="Amenities"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Resource
        </button>
      </form>
    </div>
  );
}
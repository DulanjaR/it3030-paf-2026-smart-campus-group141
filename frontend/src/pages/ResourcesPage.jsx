import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Search, Filter } from 'lucide-react';
import apiClient from '../services/apiClient';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [minCapacity, setMinCapacity] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await apiClient.get('/resources');
      setResources(res.data.content);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      await apiClient.delete(`/resources/${id}`);
      fetchResources();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      (r.description || '').toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === '' || r.type === typeFilter;
    const matchesCapacity = minCapacity === '' || r.capacity >= Number(minCapacity);

    return matchesSearch && matchesType && matchesCapacity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor all campus resources in one place
          </p>
        </div>

        <Link
          to="/resources/add"
          className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700 transition"
        >
          + Add Resource
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-700">Filters</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, description, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          >
            <option value="">All Types</option>
            <option value="LECTURE_HALL">Lecture Hall</option>
            <option value="LAB">Lab</option>
            <option value="MEETING_ROOM">Meeting Room</option>
            <option value="EQUIPMENT">Equipment</option>
            <option value="AUDITORIUM">Auditorium</option>
            <option value="SPORTS_FACILITY">Sports Facility</option>
          </select>

          <input
            type="number"
            placeholder="Minimum Capacity"
            value={minCapacity}
            onChange={(e) => setMinCapacity(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {filteredResources.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No resources found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr className="text-sm text-gray-600">
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Description</th>
                  <th className="px-6 py-4 text-left font-semibold">Type</th>
                  <th className="px-6 py-4 text-left font-semibold">Location</th>
                  <th className="px-6 py-4 text-left font-semibold">Capacity</th>
                  <th className="px-6 py-4 text-left font-semibold">Amenities</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredResources.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {r.name}
                    </td>

                    <td className="max-w-[240px] px-6 py-4 text-sm text-gray-600">
                      <span className="line-clamp-2">
                        {r.description || 'No description'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {r.type.replaceAll('_', ' ')}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {r.location}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {r.capacity}
                    </td>

                    <td className="max-w-[220px] px-6 py-4 text-sm text-gray-600">
                      <span className="line-clamp-2">
                        {r.amenities || '—'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          r.available
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {r.available ? 'ACTIVE' : 'OUT_OF_SERVICE'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/resources/edit/${r.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100 transition"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(r.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
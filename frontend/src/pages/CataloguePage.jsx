import { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import { Link } from 'react-router-dom';

export default function CataloguePage() {
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

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      (r.description || '').toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === '' || r.type === typeFilter;
    const matchesCapacity =
      minCapacity === '' || r.capacity >= Number(minCapacity);

    return matchesSearch && matchesType && matchesCapacity;
  });

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resource Catalogue</h1>
          <p className="mt-2 text-gray-600">
            Browse available campus facilities and assets
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-3">
          <input
            type="text"
            placeholder="Search by name, description, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
            className="w-full rounded-xl border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {filteredResources.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
            No resources found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredResources.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{r.name}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {r.type.replaceAll('_', ' ')}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      r.available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {r.available ? 'ACTIVE' : 'OUT OF SERVICE'}
                  </span>
                </div>

                <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                  {r.description || 'No description available.'}
                </p>

                <div className="space-y-2 text-sm text-gray-700">
                  <p><span className="font-medium">Location:</span> {r.location}</p>
                  <p><span className="font-medium">Capacity:</span> {r.capacity}</p>
                  <p><span className="font-medium">Amenities:</span> {r.amenities || '—'}</p>
                </div>

                <div className="mt-5 space-y-2">
                  <Link
                    to={`/catalogue/${r.id}`}
                    className="block w-full rounded-xl bg-blue-600 px-4 py-2.5 text-center font-medium text-white transition hover:bg-blue-700"
                  >
                    View Details
                  </Link>

                  <button
                    className={`w-full rounded-xl px-4 py-2.5 text-center font-medium text-white transition ${
                      r.available
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!r.available}
                    onClick={() => {
                      alert(`Booking started for: ${r.name}`);
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
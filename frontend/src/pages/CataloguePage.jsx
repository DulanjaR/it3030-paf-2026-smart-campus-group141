import { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import {
  Search,
  Filter,
  RotateCcw,
  CalendarDays,
  Users,
  MapPin,
  Clock3,
  Package,
} from 'lucide-react';

export default function CataloguePage() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [minCapacity, setMinCapacity] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');

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

  const resetFilters = () => {
    setSearch('');
    setTypeFilter('');
    setMinCapacity('');
    setMaxCapacity('');
  };

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === '' || r.type === typeFilter;

    const matchesMinCapacity =
      minCapacity === '' || r.capacity >= Number(minCapacity);

    const matchesMaxCapacity =
      maxCapacity === '' || r.capacity <= Number(maxCapacity);

    return matchesSearch && matchesType && matchesMinCapacity && matchesMaxCapacity;
  });

  const formatType = (type) => type.replaceAll('_', ' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Resource Catalogue</h1>
          <p className="mt-2 text-gray-600">
            Browse available campus facilities and assets with their availability windows
          </p>
        </div>

        {/* Filters */}
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-700">Find Resources</h2>
            </div>

            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or location"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Types</option>
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Lab</option>
              <option value="AUDITORIUM">Auditorium</option>
              <option value="SPORTS_FACILITY">Sports Facility</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="EQUIPMENT">Equipment</option>
              <option value="SEMINAR_HALL">Seminar Hall</option>
            </select>

            <input
              type="number"
              placeholder="Minimum Capacity"
              value={minCapacity}
              onChange={(e) => setMinCapacity(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <input
              type="number"
              placeholder="Maximum Capacity"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Cards */}
        {filteredResources.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center text-gray-500 shadow-sm">
            No resources found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredResources.map((r) => (
              <div
                key={r.id}
                className="group flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Top */}
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{r.name}</h2>
                    <p className="mt-1 text-sm font-medium uppercase tracking-wide text-gray-500">
                      {formatType(r.type)}
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

                {/* Description */}
                <p className="mb-5 min-h-[48px] text-sm leading-6 text-gray-600">
                  {r.description || 'No description available.'}
                </p>

                {/* Info block */}
                <div className="space-y-3 rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-blue-500" />
                    <span>
                      <span className="font-medium">Location:</span> {r.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 shrink-0 text-purple-500" />
                    <span>
                      <span className="font-medium">Capacity:</span> {r.capacity}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <Package className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>
                      <span className="font-medium">Amenities:</span>{' '}
                      {r.amenities || '—'}
                    </span>
                  </div>
                </div>

                {/* Availability */}
                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-blue-800">Availability</h3>
                  </div>

                  <div className="space-y-2 text-sm text-blue-900">
                    <div className="flex items-start gap-2">
                      <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                      <span>
                        <span className="font-medium">Days:</span>{' '}
                        {r.availableDays || '—'}
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                      <span>
                        <span className="font-medium">Time:</span>{' '}
                        {r.availableFrom ? r.availableFrom.slice(0, 5) : '—'} -{' '}
                        {r.availableTo ? r.availableTo.slice(0, 5) : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <button
                  className={`mt-5 w-full rounded-xl px-4 py-3 text-center font-semibold text-white transition ${
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
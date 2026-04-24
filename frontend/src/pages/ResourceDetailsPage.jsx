import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/apiClient';

export default function ResourceDetailsPage() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);

  useEffect(() => {
    fetchResource();
  }, []);

  const fetchResource = async () => {
    try {
      const res = await apiClient.get(`/resources/${id}`);
      setResource(res.data);
    } catch (error) {
      console.error('Error fetching resource:', error);
    }
  };

  if (!resource) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow">
        
        <h1 className="text-3xl font-bold text-gray-900">{resource.name}</h1>

        <p className="mt-2 text-gray-600">
          {resource.description || 'No description available'}
        </p>

        <div className="mt-6 space-y-3 text-gray-700">
          <p><strong>Type:</strong> {resource.type}</p>
          <p><strong>Location:</strong> {resource.location}</p>
          <p><strong>Capacity:</strong> {resource.capacity}</p>
          <p><strong>Amenities:</strong> {resource.amenities || '—'}</p>

          <p>
            <strong>Status:</strong>{' '}
            <span className={resource.available ? 'text-green-600' : 'text-red-600'}>
              {resource.available ? 'ACTIVE' : 'OUT OF SERVICE'}
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}
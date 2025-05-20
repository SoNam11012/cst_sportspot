'use client';

import { useState, useEffect } from 'react';

interface Venue {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: 'Available' | 'Booked' | 'Maintenance';
  equipment: string[];
  image: string;
}

interface FormErrors {
  name?: string;
  type?: string;
  capacity?: string;
  equipment?: string;
}

export default function AdminVenues() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
  // Form state for new venue
  const [newVenue, setNewVenue] = useState({
    name: '',
    type: 'Indoor',
    capacity: '',
    equipment: '',
    status: 'Available' as const
  });

  // Fetch venues on component mount
  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/venues');
      if (!response.ok) throw new Error('Failed to fetch venues');
      const data = await response.json();
      setVenues(data);
    } catch (err) {
      setError('Failed to load venues. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (data: typeof newVenue): FormErrors => {
    const errors: FormErrors = {};
    
    if (!data.name.trim()) {
      errors.name = 'Venue name is required';
    }
    
    if (!data.type) {
      errors.type = 'Venue type is required';
    }
    
    if (!data.capacity) {
      errors.capacity = 'Capacity is required';
    } else if (parseInt(data.capacity) < 1) {
      errors.capacity = 'Capacity must be at least 1';
    }
    
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewVenue(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    setFormErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm(newVenue);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const formData = {
        ...newVenue,
        capacity: parseInt(newVenue.capacity),
        equipment: newVenue.equipment.split(',').map(item => item.trim()).filter(Boolean)
      };

      const response = await fetch('/api/venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add venue');
      }

      // Reset form and close modal
      setNewVenue({
        name: '',
        type: 'Indoor',
        capacity: '',
        equipment: '',
        status: 'Available'
      });
      setShowAddModal(false);
      fetchVenues(); // Refresh venues list
    } catch (err: any) {
      setError(err.message || 'Failed to add venue');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this venue?')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/venues?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete venue');
      }

      fetchVenues(); // Refresh venues list
    } catch (err) {
      setError('Failed to delete venue');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVenue) return;

    try {
      setLoading(true);
      const response = await fetch('/api/venues', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedVenue.id,
          ...selectedVenue,
          equipment: typeof selectedVenue.equipment === 'string' 
            ? selectedVenue.equipment.split(',').map(item => item.trim()).filter(Boolean)
            : selectedVenue.equipment
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update venue');
      }

      setSelectedVenue(null);
      fetchVenues(); // Refresh venues list
    } catch (err) {
      setError('Failed to update venue');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Booked':
        return 'bg-blue-100 text-blue-800';
      case 'Maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && venues.length === 0) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {error && (
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
            <button
              className="absolute top-0 right-0 px-4 py-3"
              onClick={() => setError('')}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Venue Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#2c6e49] text-white px-4 py-2 rounded-md hover:bg-[#1b4332] transition-colors"
            disabled={loading}
          >
            Add New Venue
          </button>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <div key={venue.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 w-full relative">
                <div className="absolute inset-0 bg-gray-200">
                  {venue.image ? (
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{venue.name}</h3>
                    <p className="text-sm text-gray-600">{venue.type}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(venue.status)}`}>
                    {venue.status}
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Capacity</p>
                    <p className="font-medium">{venue.capacity} people</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Equipment</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {venue.equipment.map((item, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => setSelectedVenue(venue)}
                    className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded hover:bg-indigo-100 transition-colors"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(venue.id)}
                    className="flex-1 bg-red-50 text-red-600 py-2 rounded hover:bg-red-100 transition-colors"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Venue Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Venue</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newVenue.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c6e49] ${
                    formErrors.name ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter venue name"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={newVenue.type}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c6e49] ${
                      formErrors.type ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                  </select>
                  {formErrors.type && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={newVenue.capacity}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c6e49] ${
                      formErrors.capacity ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter capacity"
                    min="1"
                  />
                  {formErrors.capacity && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.capacity}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipment (comma-separated)
                </label>
                <input
                  type="text"
                  name="equipment"
                  value={newVenue.equipment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c6e49]"
                  placeholder="e.g., Balls, Net, First Aid Kit"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormErrors({});
                    setNewVenue({
                      name: '',
                      type: 'Indoor',
                      capacity: '',
                      equipment: '',
                      status: 'Available'
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2c6e49] text-white rounded hover:bg-[#1b4332]"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Venue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Venue Modal */}
      {selectedVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Venue</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue Name
                </label>
                <input
                  type="text"
                  value={selectedVenue.name}
                  onChange={(e) => setSelectedVenue({ ...selectedVenue, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c6e49]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select 
                    value={selectedVenue.type}
                    onChange={(e) => setSelectedVenue({ ...selectedVenue, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c6e49]"
                  >
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={selectedVenue.capacity}
                    onChange={(e) => setSelectedVenue({ ...selectedVenue, capacity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c6e49]"
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select 
                  value={selectedVenue.status}
                  onChange={(e) => setSelectedVenue({ ...selectedVenue, status: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c6e49]"
                >
                  <option value="Available">Available</option>
                  <option value="Booked">Booked</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipment (comma-separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(selectedVenue.equipment) ? selectedVenue.equipment.join(', ') : selectedVenue.equipment}
                  onChange={(e) => setSelectedVenue({ ...selectedVenue, equipment: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c6e49]"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedVenue(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2c6e49] text-white rounded hover:bg-[#1b4332]"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

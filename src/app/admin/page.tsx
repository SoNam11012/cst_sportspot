'use client';

import { useState } from 'react';
import { FaUsers, FaCalendarAlt, FaChartBar, FaBuilding, FaCog } from 'react-icons/fa';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data for demonstration
  const stats = {
    totalUsers: 156,
    activeBookings: 23,
    totalVenues: 8,
    pendingRequests: 5
  };

  const recentBookings = [
    { id: 1, user: 'Sonam Dorji', venue: 'Basketball Court', date: '2024-03-15', status: 'Approved' },
    { id: 2, user: 'Karma Tshering', venue: 'Football Field', date: '2024-03-16', status: 'Pending' },
    { id: 3, user: 'Tashi Wangmo', venue: 'Volleyball Court', date: '2024-03-17', status: 'Approved' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-[#2c6e49] text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">CST SportSpot Admin</h1>
            <div className="flex items-center space-x-4">
              <button className="hover:text-gray-200">
                <FaCog className="text-xl" />
              </button>
              <div className="relative">
                <img
                  src="/admin-avatar.png"
                  alt="Admin"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <FaUsers className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <h2 className="text-gray-600 text-sm">Total Users</h2>
                <p className="text-2xl font-semibold">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <FaCalendarAlt className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <h2 className="text-gray-600 text-sm">Active Bookings</h2>
                <p className="text-2xl font-semibold">{stats.activeBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaBuilding className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <h2 className="text-gray-600 text-sm">Total Venues</h2>
                <p className="text-2xl font-semibold">{stats.totalVenues}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <FaChartBar className="text-red-600 text-xl" />
              </div>
              <div className="ml-4">
                <h2 className="text-gray-600 text-sm">Pending Requests</h2>
                <p className="text-2xl font-semibold">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Venue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.user}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.venue}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${booking.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                        <button className="text-red-600 hover:text-red-900">Cancel</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Add New Venue</h3>
            <p className="text-gray-600">Create and configure new sports venues</p>
          </button>
          <button className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Manage Users</h3>
            <p className="text-gray-600">View and manage user accounts</p>
          </button>
          <button className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Generate Reports</h3>
            <p className="text-gray-600">View booking and usage statistics</p>
          </button>
        </div>
      </div>
    </div>
  );
}

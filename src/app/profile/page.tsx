'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import '@/styles/profile.css';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaCalendarAlt, FaBook, FaArrowLeft } from 'react-icons/fa';

interface Profile {
  fullName: string;
  studentNumber: string;
  year: string;
  course: string;
  email: string;
  phoneNumber: string;
  profileImage: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish loading

    if (!user) {
      router.push('/login?redirect=/profile');
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfile(data.profile);
        setFormData(data.profile);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, router, authLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setProfile(data.profile);
    setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    }
  };

  if (authLoading || loading) {
  return (
      <div className="min-h-screen bg-[#f6fff8]">
        <Navbar />
        <div className="profile-container">
          <div className="loading-skeleton">
            <div className="profile-header">
              <div className="profile-image-container">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto"></div>
              </div>
              <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f6fff8]">
        <Navbar />
        <div className="profile-container">
          <div className="error-message">
            <strong>Error! </strong>
            <span>{error}</span>
                  </div>
                  </div>
                </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6fff8]">
      <Navbar />
      <div className="profile-container">
                <button
          onClick={() => router.back()}
          className="back-button"
                >
          <FaArrowLeft className="mr-2" />
          Back
                </button>
        
        {successMessage && (
          <div className="success-message">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}

        <div className="profile-header">
          <div className="profile-image-container">
            <img
              src={profile?.profileImage || 'https://github.com/SoNam11012/CST-SportSpot/blob/main/default-avatar.png?raw=true'}
              alt="Profile"
              className="profile-image"
            />
          </div>
          <h1 className="profile-name">{profile?.fullName}</h1>
          <p className="profile-email">{profile?.email}</p>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-value">12</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">3</div>
            <div className="stat-label">Active Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">4</div>
            <div className="stat-label">Favorite Venues</div>
          </div>
              </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
                    <input
                      type="text"
                name="fullName"
                value={formData.fullName || ''}
                onChange={handleInputChange}
                className="form-input"
                required
                    />
                  </div>

            <div className="form-group">
              <label className="form-label">Student Number</label>
                    <input
                type="text"
                name="studentNumber"
                value={formData.studentNumber || ''}
                onChange={handleInputChange}
                className="form-input"
                    />
                  </div>

            <div className="form-group">
              <label className="form-label">Year</label>
              <select
                name="year"
                value={formData.year || ''}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Course</label>
                    <input
                type="text"
                name="course"
                value={formData.course || ''}
                onChange={handleInputChange}
                className="form-input"
                    />
                  </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
                    <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={handleInputChange}
                className="form-input"
                    />
                  </div>

            <div className="button-group">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
                      <button
                        type="submit"
                className="btn btn-primary"
                      >
                        Save Changes
                      </button>
                    </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-group">
              <div className="info-label">
                <FaUser className="inline mr-2" />
                Student Number
              </div>
              <div className="info-value">{profile?.studentNumber || 'Not provided'}</div>
            </div>

            <div className="info-group">
              <div className="info-label">
                <FaCalendarAlt className="inline mr-2" />
                Year
              </div>
              <div className="info-value">{profile?.year || 'Not provided'}</div>
            </div>

            <div className="info-group">
              <div className="info-label">
                <FaBook className="inline mr-2" />
                Course
              </div>
              <div className="info-value">{profile?.course || 'Not provided'}</div>
            </div>

            <div className="info-group">
              <div className="info-label">
                <FaPhone className="inline mr-2" />
                Phone Number
              </div>
              <div className="info-value">{profile?.phoneNumber || 'Not provided'}</div>
                </div>

            <div className="button-group">
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
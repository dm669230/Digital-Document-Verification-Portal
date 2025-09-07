import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCalendar, 
  FiEdit, 
  FiSave, 
  FiX,
  FiLock
} from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    date_of_birth: ''
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        date_of_birth: user.date_of_birth || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!profileData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!profileData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    }

    if (!profileData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!profileData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.old_password) {
      newErrors.old_password = 'Current password is required';
    }

    if (!passwordData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (passwordData.new_password.length < 8) {
      newErrors.new_password = 'New password must be at least 8 characters';
    }

    if (!passwordData.new_password_confirm) {
      newErrors.new_password_confirm = 'Please confirm your new password';
    } else if (passwordData.new_password !== passwordData.new_password_confirm) {
      newErrors.new_password_confirm = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfile()) {
      return;
    }

    setLoading(true);
    const result = await updateProfile(profileData);
    setLoading(false);

    if (result.success) {
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } else {
      toast.error(result.error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    const result = await changePassword(passwordData);
    setLoading(false);

    if (result.success) {
      toast.success('Password changed successfully!');
      setIsChangingPassword(false);
      setPasswordData({
        old_password: '',
        new_password: '',
        new_password_confirm: ''
      });
    } else {
      toast.error(result.error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
    setErrors({});
    // Reset form data
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        date_of_birth: user.date_of_birth || ''
      });
    }
    setPasswordData({
      old_password: '',
      new_password: '',
      new_password_confirm: ''
    });
  };

  if (!user) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="card-title">Personal Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline"
                  >
                    <FiEdit className="mr-2 h-4 w-4" />
                    Edit
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleProfileSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="form-label">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        disabled={!isEditing}
                        className={`form-input pl-10 ${errors.first_name ? 'error' : ''} ${!isEditing ? 'bg-gray-50' : ''}`}
                        value={profileData.first_name}
                        onChange={handleProfileChange}
                      />
                    </div>
                    {errors.first_name && <p className="form-error">{errors.first_name}</p>}
                  </div>

                  <div>
                    <label htmlFor="last_name" className="form-label">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        disabled={!isEditing}
                        className={`form-input pl-10 ${errors.last_name ? 'error' : ''} ${!isEditing ? 'bg-gray-50' : ''}`}
                        value={profileData.last_name}
                        onChange={handleProfileChange}
                      />
                    </div>
                    {errors.last_name && <p className="form-error">{errors.last_name}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      disabled={!isEditing}
                      className={`form-input pl-10 ${errors.email ? 'error' : ''} ${!isEditing ? 'bg-gray-50' : ''}`}
                      value={profileData.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  {errors.email && <p className="form-error">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone_number" className="form-label">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      disabled={!isEditing}
                      className={`form-input pl-10 ${errors.phone_number ? 'error' : ''} ${!isEditing ? 'bg-gray-50' : ''}`}
                      value={profileData.phone_number}
                      onChange={handleProfileChange}
                    />
                  </div>
                  {errors.phone_number && <p className="form-error">{errors.phone_number}</p>}
                </div>

                <div>
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      disabled={!isEditing}
                      className={`form-input pl-10 ${errors.address ? 'error' : ''} ${!isEditing ? 'bg-gray-50' : ''}`}
                      value={profileData.address}
                      onChange={handleProfileChange}
                    />
                  </div>
                  {errors.address && <p className="form-error">{errors.address}</p>}
                </div>

                <div>
                  <label htmlFor="date_of_birth" className="form-label">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      disabled={!isEditing}
                      className={`form-input pl-10 ${errors.date_of_birth ? 'error' : ''} ${!isEditing ? 'bg-gray-50' : ''}`}
                      value={profileData.date_of_birth}
                      onChange={handleProfileChange}
                    />
                  </div>
                  {errors.date_of_birth && <p className="form-error">{errors.date_of_birth}</p>}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-outline"
                    disabled={loading}
                  >
                    <FiX className="mr-2 h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="spinner mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      <>
                        <FiSave className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Username</span>
                <span className="text-sm font-medium text-gray-900">{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Member since</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(user.date_joined).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`text-sm font-medium ${user.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {user.is_verified ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
            </div>
          </div>

          {/* Password Change */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Password</h3>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="btn btn-outline"
                >
                  <FiLock className="mr-2 h-4 w-4" />
                  Change
                </button>
              )}
            </div>

            {isChangingPassword ? (
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="old_password" className="form-label">
                      Current Password
                    </label>
                    <input
                      id="old_password"
                      name="old_password"
                      type="password"
                      className={`form-input ${errors.old_password ? 'error' : ''}`}
                      value={passwordData.old_password}
                      onChange={handlePasswordChange}
                    />
                    {errors.old_password && <p className="form-error">{errors.old_password}</p>}
                  </div>

                  <div>
                    <label htmlFor="new_password" className="form-label">
                      New Password
                    </label>
                    <input
                      id="new_password"
                      name="new_password"
                      type="password"
                      className={`form-input ${errors.new_password ? 'error' : ''}`}
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                    />
                    {errors.new_password && <p className="form-error">{errors.new_password}</p>}
                  </div>

                  <div>
                    <label htmlFor="new_password_confirm" className="form-label">
                      Confirm New Password
                    </label>
                    <input
                      id="new_password_confirm"
                      name="new_password_confirm"
                      type="password"
                      className={`form-input ${errors.new_password_confirm ? 'error' : ''}`}
                      value={passwordData.new_password_confirm}
                      onChange={handlePasswordChange}
                    />
                    {errors.new_password_confirm && <p className="form-error">{errors.new_password_confirm}</p>}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-outline"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="spinner mr-2"></div>
                        Changing...
                      </div>
                    ) : (
                      'Change Password'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-gray-500">
                Click "Change" to update your password
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

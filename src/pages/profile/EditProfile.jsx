import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './editProfile.css';
import API from '../../services/api';

export default function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'supporter',
    profilePicture: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = Cookies.get('user');
    if (user) {
      try {
        const userObj = JSON.parse(user);
        setUserId(userObj.userId);
      } catch (err) {
        console.error('Failed to parse user cookie:', err);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await API.getUserProfile(userId);

      if (response.success) {
        const user = response.user;
        // Convert profilePicture from base64 to data URL if it exists
        const profilePictureUrl = user.profilePicture
          ? `data:image/png;base64,${user.profilePicture}`
          : '';

        const profileData = {
          username: user.username || '',
          email: user.email || '',
          password: '',
          confirmPassword: '',
          role: user.role?.toLowerCase() || 'supporter',
          profilePicture: profilePictureUrl
        };

        setFormData(profileData);
        setOriginalData(profileData);
      } else {
        setErrors({ submit: 'Failed to load profile' });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setErrors({ submit: err.message || 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters and numbers';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password is optional for update, but if provided, must meet requirements
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least 1 uppercase character';
      } else if (!/[!@#$%^&*]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least 1 special character';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      // Build update object with only changed fields
      const updateData = { userId };

      if (formData.username !== originalData.username) {
        updateData.username = formData.username;
      }
      if (formData.email !== originalData.email) {
        updateData.email = formData.email;
      }
      if (formData.password) {
        updateData.password = formData.password;
      }
      if (formData.profilePicture !== originalData.profilePicture) {
        // Extract base64 from data URL
        const base64Data = formData.profilePicture.split(',')[1];
        updateData.profilePicture = base64Data;
      }

      const response = await API.updateUserProfile(updateData);

      if (response.success) {
        // Update cookies with new user data
        const user = Cookies.get('user');
        if (user) {
          const userObj = JSON.parse(user);
          const updatedUser = {
            ...userObj,
            username: response.user.username,
            email: response.user.email,
            picture: response.user.profilePicture
              ? `data:image/png;base64,${response.user.profilePicture}`
              : '',
            role: response.user.role
          };
          Cookies.set('user', JSON.stringify(updatedUser));

          // Update localStorage for profile picture
          localStorage.setItem('profilePicture', JSON.stringify(updatedUser.picture));
          window.dispatchEvent(new Event('profileUpdated'));
        }

        // Navigate back to rewards page (where the profile is displayed)
        navigate('/rewards');
      } else {
        setErrors({ submit: response.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Update error:', error);
      setErrors({ submit: error.message || 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const isFormChanged = () => {
    return (
      formData.username !== originalData.username ||
      formData.email !== originalData.email ||
      formData.password !== '' ||
      formData.profilePicture !== originalData.profilePicture
    );
  };

  return (
    <div className="edit-profile-page">
      <h1>Update Profile</h1>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="profile-picture-upload">
          <div className="picture-preview">
            {formData.profilePicture ? (
              <img src={formData.profilePicture} alt="Profile" />
            ) : (
              <div className="placeholder">👤</div>
            )}
          </div>
          <label htmlFor="profile-picture" className="upload-label">
            + Upload Picture
          </label>
          <input
            type="file"
            id="profile-picture"
            accept="image/*"
            onChange={handleProfilePictureChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username*</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? 'error' : ''}
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label>I am a:*</label>
          <div className="role-selection">
            <label className="radio-label">
              <input
                type="radio"
                name="role"
                value="supporter"
                checked={formData.role === 'supporter'}
                onChange={() => handleRoleChange('supporter')}
              />
              <span>Supporter</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="role"
                value="business"
                checked={formData.role === 'business'}
                onChange={() => handleRoleChange('business')}
              />
              <span>Business Representative</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password*</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm password*</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            className={errors.confirmPassword ? 'error' : ''}
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        {errors.submit && <p className="error-message submit-error">{errors.submit}</p>}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={loading || !isFormChanged()}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}

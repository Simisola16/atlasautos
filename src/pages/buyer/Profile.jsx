import { useState } from 'react';
import { User, Camera, Phone, MapPin, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { NIGERIAN_STATES } from '../../utils/constants';
import toast from 'react-hot-toast';

const BuyerProfile = () => {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    state: user?.state || '',
    city: user?.city || ''
  });
  
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto || null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    const updateData = { ...formData };
    if (profilePhoto) {
      updateData.profilePhoto = profilePhoto;
    }
    
    const result = await updateProfile(updateData);
    
    setLoading(false);
    
    if (result.success) {
      toast.success('Profile updated successfully');
    }
  };

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">My Profile</h1>
          <p className="text-gray-400 mt-1">Manage your account information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo */}
          <div className="bg-dark-50 rounded-xl p-6 border border-dark-100">
            <h3 className="text-lg font-semibold text-white mb-4">Profile Photo</h3>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-dark-100 border-2 border-dashed border-dark-200 flex items-center justify-center overflow-hidden">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <p className="text-white font-medium">{user?.fullName}</p>
                <p className="text-gray-400 text-sm">{user?.email}</p>
                <p className="text-gray-400 text-sm">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-dark-50 rounded-xl p-6 border border-dark-100">
            <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-dark border border-dark-100 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full bg-dark border border-dark-100 rounded-lg py-3 pl-10 pr-4 text-gray-400 cursor-not-allowed"
                  />
                </div>
                <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full bg-dark border border-dark-100 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white focus:border-primary transition-colors"
                  >
                    <option value="">Select State</option>
                    {NIGERIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-dark border border-dark-100 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-600 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? <LoadingSpinner size="sm" /> : <span>Save Changes</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuyerProfile;

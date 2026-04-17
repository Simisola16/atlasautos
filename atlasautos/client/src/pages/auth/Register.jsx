import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin, Camera, ArrowRight, Building2, Store, FileText, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NIGERIAN_STATES } from '../../utils/constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Register = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    state: '',
    city: '',
    dealershipName: '',
    dealershipAddress: '',
    businessDescription: '',
    yearsInBusiness: '',
    profilePhoto: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePhoto: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    
    setLoading(true);
    const result = await register(formData, role);
    setLoading(false);
    
    if (result.success) {
      if (role === 'seller') {
        // Sellers need to verify email first
        navigate('/verify-email', { state: { email: formData.email } });
      } else {
        navigate('/browse');
      }
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white text-center">
        Choose Account Type
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => {
            setRole('buyer');
            setStep(2);
          }}
          className="p-6 bg-dark border-2 border-dark-100 rounded-xl hover:border-primary transition-all group"
        >
          <User className="w-10 h-10 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-white mb-2">I'm a Buyer</h3>
          <p className="text-sm text-gray-400">Looking to buy a car</p>
        </button>
        
        <button
          type="button"
          onClick={() => {
            setRole('seller');
            setStep(2);
          }}
          className="p-6 bg-dark border-2 border-dark-100 rounded-xl hover:border-primary transition-all group"
        >
          <Store className="w-10 h-10 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-white mb-2">I'm a Seller</h3>
          <p className="text-sm text-gray-400">Want to sell cars</p>
        </button>
      </div>
      
      <p className="text-center text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:text-primary-400 font-medium">
          Sign In
        </Link>
      </p>
    </div>
  );

  const renderStep2 = () => (
    <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="text-gray-400 hover:text-white text-sm"
        >
          ← Back
        </button>
        <span className="text-sm text-gray-400">Step 2 of 3</span>
      </div>

      {/* Profile Photo */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-dark-100 border-2 border-dashed border-dark-200 flex items-center justify-center overflow-hidden">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-gray-400" />
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
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
            required
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="08012345678"
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
            required
          />
        </div>
      </div>

      {/* State & City */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white focus:border-primary transition-colors"
            required
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
              placeholder="City"
              className="w-full bg-dark border border-dark-100 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
              required
            />
          </div>
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min 6 characters"
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 pl-10 pr-12 text-white placeholder-gray-500 focus:border-primary transition-colors"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
            required
          />
        </div>
        {formData.password !== formData.confirmPassword && formData.confirmPassword && (
          <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-primary hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
      >
        <span>Continue</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  );

  const renderStep3 = () => (
    role === 'seller' ? (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="text-gray-400 hover:text-white text-sm"
          >
            ← Back
          </button>
          <span className="text-sm text-gray-400">Step 3 of 3</span>
        </div>

        <h3 className="text-lg font-semibold text-white mb-4">Dealership Information</h3>

        {/* Dealership Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Dealership Name</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="dealershipName"
              value={formData.dealershipName}
              onChange={handleChange}
              placeholder="Your dealership name"
              className="w-full bg-dark border border-dark-100 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
              required
            />
          </div>
        </div>

        {/* Dealership Address */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Dealership Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="dealershipAddress"
              value={formData.dealershipAddress}
              onChange={handleChange}
              placeholder="Full address"
              className="w-full bg-dark border border-dark-100 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
              required
            />
          </div>
        </div>

        {/* Business Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Business Description</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <textarea
              name="businessDescription"
              value={formData.businessDescription}
              onChange={handleChange}
              placeholder="Tell us about your business..."
              rows={3}
              className="w-full bg-dark border border-dark-100 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-primary transition-colors resize-none"
              required
              maxLength={500}
            />
          </div>
        </div>

        {/* Years in Business */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Years in Business</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              name="yearsInBusiness"
              value={formData.yearsInBusiness}
              onChange={handleChange}
              placeholder="e.g., 5"
              min="0"
              className="w-full bg-dark border border-dark-100 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? <LoadingSpinner size="sm" /> : <span>Create Account</span>}
        </button>
      </form>
    ) : (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="text-gray-400 hover:text-white text-sm"
          >
            ← Back
          </button>
          <span className="text-sm text-gray-400">Step 3 of 3</span>
        </div>

        <div className="text-center py-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Ready to Join!</h3>
          <p className="text-gray-400">Click below to create your buyer account</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? <LoadingSpinner size="sm" /> : <span>Create Account</span>}
        </button>
      </form>
    )
  );

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-bold">
              <span className="text-primary">ATLAS</span>
              <span className="text-white">AUTOS</span>
            </span>
          </Link>
          <p className="text-gray-400 mt-2">Create your account to get started.</p>
        </div>

        {/* Form Container */}
        <div className="bg-dark-50 rounded-2xl p-6 md:p-8 border border-dark-100">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

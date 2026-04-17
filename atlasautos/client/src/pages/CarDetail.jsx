import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Share2, 
  MapPin, 
  MessageCircle, 
  Phone, 
  CheckCircle, 
  ArrowLeft,
  Gauge,
  Calendar,
  Users,
  Fuel,
  Settings,
  Car,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Flag
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  formatPrice, 
  formatMileage, 
  formatHP, 
  formatTorque,
  formatTopSpeed,
  formatAcceleration,
  formatFuelConsumption,
  formatFuelTank,
  formatDate,
  getInitials
} from '../utils/formatters';
import toast from 'react-hot-toast';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, api } = useAuth();
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/cars/${id}`);
      setCar(response.data.car);
      setIsFavorite(response.data.car.isFavorite);
      
      // Add to recently viewed
      addToRecentlyViewed(response.data.car);
    } catch (error) {
      console.error('Failed to fetch car details:', error);
      toast.error('Failed to load car details');
    } finally {
      setLoading(false);
    }
  };

  const addToRecentlyViewed = (carData) => {
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const filtered = viewed.filter(c => c._id !== carData._id);
    const updated = [carData, ...filtered].slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save favorites');
      return;
    }

    if (user?.role !== 'buyer') {
      toast.error('Only buyers can save favorites');
      return;
    }

    try {
      const response = await api.post(`/cars/${id}/favorite`);
      setIsFavorite(response.data.isFavorite);
      toast.success(response.data.isFavorite ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${car.year} ${car.brand} ${car.model} - AtlasAutos`,
          text: `Check out this ${car.year} ${car.brand} ${car.model} for ${formatPrice(car.price)}`,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleChat = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to chat with the seller');
      navigate('/login');
      return;
    }

    try {
      const response = await api.post('/chat', { carId: id });
      navigate(`/chat/${response.data.chat._id}`);
    } catch (error) {
      toast.error('Failed to start chat');
    }
  };

  const handleReport = async () => {
    if (!reportReason) {
      toast.error('Please select a reason');
      return;
    }

    try {
      await api.post(`/cars/${id}/report`, {
        reason: reportReason,
        description: reportDescription
      });
      toast.success('Report submitted successfully');
      setShowReportModal(false);
      setReportReason('');
      setReportDescription('');
    } catch (error) {
      toast.error('Failed to submit report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4">
        <Car className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Car Not Found</h2>
        <p className="text-gray-400 mb-6">The car you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/browse"
          className="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Browse Cars
        </Link>
      </div>
    );
  }

  const isOwner = user?._id === car.seller?._id;

  return (
    <div className="min-h-screen bg-dark pb-20">
      {/* Back Button & Actions */}
      <div className="sticky top-16 z-30 bg-dark/95 backdrop-blur-md border-b border-dark-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite 
                    ? 'bg-primary text-white' 
                    : 'bg-dark-100 text-gray-400 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-dark-100 text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              {isAuthenticated && user?.role === 'buyer' && (
                <button
                  onClick={() => setShowReportModal(true)}
                  className="p-2 bg-dark-100 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                >
                  <Flag className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-dark-50 rounded-xl overflow-hidden border border-dark-100">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="aspect-video"
                onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
              >
                {car.photos.map((photo, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={photo}
                      alt={`${car.brand} ${car.model} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Thumbnail Strip */}
              <div className="flex gap-2 p-4 overflow-x-auto">
                {car.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImageIndex === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Car Info */}
            <div className="bg-dark-50 rounded-xl p-6 border border-dark-100">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {car.year} {car.brand} {car.model}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{car.seller?.city}, {car.seller?.state}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl md:text-3xl font-bold text-primary">
                    {formatPrice(car.price)}
                  </p>
                  {car.negotiable && (
                    <span className="text-sm text-green-400">Negotiable</span>
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  car.condition === 'New' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {car.condition}
                </span>
                <span className="px-3 py-1 bg-dark-100 text-gray-300 rounded-full text-sm">
                  {car.bodyType}
                </span>
                <span className="px-3 py-1 bg-dark-100 text-gray-300 rounded-full text-sm">
                  {car.transmission}
                </span>
                <span className="px-3 py-1 bg-dark-100 text-gray-300 rounded-full text-sm">
                  {car.viewCount} views
                </span>
              </div>

              {/* Description */}
              {car.description && (
                <div className="border-t border-dark-100 pt-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-400 whitespace-pre-line">{car.description}</p>
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="bg-dark-50 rounded-xl p-6 border border-dark-100">
              <h3 className="text-lg font-semibold text-white mb-4">Specifications</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Basic Info */}
                <SpecItem icon={Car} label="Body Type" value={car.bodyType} />
                <SpecItem icon={Calendar} label="Year" value={car.year} />
                <SpecItem icon={Settings} label="Transmission" value={car.transmission} />
                <SpecItem icon={Fuel} label="Engine Type" value={car.engineType} />
                <SpecItem icon={Gauge} label="Engine Size" value={car.engineSize || 'N/A'} />
                <SpecItem icon={Users} label="Seats" value={`${car.numberOfSeats} seats`} />
                
                {/* Performance */}
                <SpecItem icon={Gauge} label="Horsepower" value={formatHP(car.horsepower)} />
                <SpecItem icon={Gauge} label="Torque" value={formatTorque(car.torque)} />
                <SpecItem icon={Gauge} label="Top Speed" value={formatTopSpeed(car.topSpeed)} />
                <SpecItem icon={Gauge} label="0-100 km/h" value={formatAcceleration(car.acceleration)} />
                
                {/* Fuel */}
                <SpecItem icon={Fuel} label="Fuel Consumption" value={formatFuelConsumption(car.fuelConsumption)} />
                <SpecItem icon={Fuel} label="Fuel Tank" value={formatFuelTank(car.fuelTankCapacity)} />
                
                {/* Used Car Specifics */}
                {car.condition === 'Used' && (
                  <>
                    <SpecItem icon={Gauge} label="Mileage" value={formatMileage(car.mileage)} />
                    <SpecItem icon={Users} label="Previous Owners" value={car.previousOwners || 'N/A'} />
                    <SpecItem icon={Calendar} label="Service History" value={car.serviceHistory || 'N/A'} />
                  </>
                )}
              </div>
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="bg-dark-50 rounded-xl p-6 border border-dark-100">
                <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Seller Info & Actions */}
          <div className="space-y-6">
            {/* Seller Card */}
            <div className="bg-dark-50 rounded-xl p-6 border border-dark-100 sticky top-32">
              <h3 className="text-lg font-semibold text-white mb-4">Seller Information</h3>
              
              <div className="flex items-center gap-4 mb-6">
                {car.seller?.profilePhoto ? (
                  <img
                    src={car.seller.profilePhoto}
                    alt={car.seller.dealershipName || car.seller.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-2xl text-white font-bold">
                      {getInitials(car.seller?.dealershipName || car.seller?.fullName)}
                    </span>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">
                      {car.seller?.dealershipName || car.seller?.fullName}
                    </h4>
                    {car.seller?.isVerified && (
                      <CheckCircle className="w-5 h-5 text-blue-500 fill-blue-500" />
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{car.seller?.city}, {car.seller?.state}</p>
                  {car.seller?.yearsInBusiness > 0 && (
                    <p className="text-gray-400 text-sm">
                      {car.seller.yearsInBusiness} years in business
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              {!isOwner && (
                <div className="space-y-3">
                  <button
                    onClick={handleChat}
                    className="w-full bg-primary hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat with Seller</span>
                  </button>
                  
                  <a
                    href={`tel:${car.seller?.phoneNumber}`}
                    className="w-full bg-dark-100 hover:bg-dark-200 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call Seller</span>
                  </a>
                </div>
              )}

              {/* View All Listings */}
              <Link
                to={`/seller/${car.seller?._id}`}
                className="block w-full text-center text-primary hover:text-primary-400 mt-4 text-sm font-medium"
              >
                View All Listings by This Seller
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-dark-50 rounded-xl p-6 max-w-md w-full border border-dark-100">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-semibold text-white">Report Listing</h3>
            </div>
            
            <p className="text-gray-400 mb-4">
              Please let us know why you're reporting this listing.
            </p>
            
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white mb-4"
            >
              <option value="">Select a reason</option>
              <option value="fraud">Fraudulent listing</option>
              <option value="incorrect">Incorrect information</option>
              <option value="sold">Car already sold</option>
              <option value="spam">Spam</option>
              <option value="other">Other</option>
            </select>
            
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Additional details (optional)"
              rows={3}
              className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white placeholder-gray-500 resize-none mb-4"
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 py-3 bg-dark-100 hover:bg-dark-200 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Spec Item Component
const SpecItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 bg-dark rounded-lg">
    <Icon className="w-5 h-5 text-primary flex-shrink-0" />
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  </div>
);

export default CarDetail;

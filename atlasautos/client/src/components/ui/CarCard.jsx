import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Gauge, MessageCircle, CheckCircle } from 'lucide-react';
import { formatPrice, formatMileage, truncateText } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CarCard = ({ car, showFavorite = true }) => {
  const [isFavorite, setIsFavorite] = useState(car.isFavorite || false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { user, isAuthenticated, api } = useAuth();

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to save favorites');
      return;
    }

    if (user?.role !== 'buyer') {
      toast.error('Only buyers can save favorites');
      return;
    }

    try {
      const response = await api.post(`/cars/${car._id}/favorite`);
      setIsFavorite(response.data.isFavorite);
      toast.success(response.data.isFavorite ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to chat with seller');
      return;
    }

    // Navigate to chat
    window.location.href = `/chat/new?carId=${car._id}`;
  };

  return (
    <Link
      to={`/car/${car._id}`}
      className="group bg-dark-50 rounded-xl overflow-hidden border border-dark-100 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}
        <img
          src={car.coverPhoto}
          alt={`${car.year} ${car.brand} ${car.model}`}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Condition Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            car.condition === 'New'
              ? 'bg-green-500/90 text-white'
              : 'bg-blue-500/90 text-white'
          }`}>
            {car.condition}
          </span>
        </div>

        {/* Favorite Button */}
        {showFavorite && (
          <button
            onClick={handleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
              isFavorite
                ? 'bg-primary text-white'
                : 'bg-black/50 text-white hover:bg-primary'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Negotiable Badge */}
        {car.negotiable && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-primary/90 text-white text-xs font-medium rounded">
              Negotiable
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors line-clamp-1">
          {car.year} {car.brand} {car.model}
        </h3>

        {/* Price */}
        <p className="text-xl font-bold text-primary mt-1">
          {formatPrice(car.price)}
        </p>

        {/* Specs */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="px-2 py-1 bg-dark-100 text-gray-400 text-xs rounded">
            {car.bodyType}
          </span>
          <span className="px-2 py-1 bg-dark-100 text-gray-400 text-xs rounded">
            {car.transmission}
          </span>
          {car.condition === 'Used' && car.mileage && (
            <span className="px-2 py-1 bg-dark-100 text-gray-400 text-xs rounded flex items-center gap-1">
              <Gauge className="w-3 h-3" />
              {formatMileage(car.mileage)}
            </span>
          )}
        </div>

        {/* Location & Seller */}
        <div className="mt-3 pt-3 border-t border-dark-100">
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{car.seller?.city}, {car.seller?.state}</span>
          </div>
          
          {car.seller && (
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                {car.seller.profilePhoto ? (
                  <img
                    src={car.seller.profilePhoto}
                    alt={car.seller.dealershipName || car.seller.fullName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs text-white font-medium">
                      {(car.seller.dealershipName || car.seller.fullName)?.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="text-sm text-gray-300 truncate max-w-[120px]">
                  {car.seller.dealershipName || car.seller.fullName}
                </span>
                {car.seller.isVerified && (
                  <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500" />
                )}
              </div>
              
              {user?.role === 'buyer' && (
                <button
                  onClick={handleChat}
                  className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CarCard;

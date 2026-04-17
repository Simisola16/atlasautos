import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, MapPin, Calendar, Car, Phone, MessageCircle, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CarCard from '../components/ui/CarCard';
import EmptyState from '../components/ui/EmptyState';

const SellerProfile = () => {
  const { sellerId } = useParams();
  const { api, user } = useAuth();
  
  const [seller, setSeller] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, currentPage: 1, totalPages: 1 });

  useEffect(() => {
    fetchSellerData();
  }, [sellerId]);

  const fetchSellerData = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/cars/seller/${sellerId}?page=${page}`);
      setSeller(response.data.seller);
      setCars(response.data.cars);
      setStats({
        total: response.data.total,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages
      });
    } catch (error) {
      console.error('Failed to fetch seller data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4">
        <p className="text-gray-400">Seller not found</p>
        <Link to="/browse" className="mt-4 text-primary hover:text-primary-400">
          Browse Cars
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Seller Header */}
        <div className="bg-dark-50 rounded-xl p-6 md:p-8 border border-dark-100 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            {seller.profilePhoto ? (
              <img
                src={seller.profilePhoto}
                alt={seller.dealershipName || seller.fullName}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary flex items-center justify-center">
                <span className="text-3xl md:text-4xl text-white font-bold">
                  {(seller.dealershipName || seller.fullName)?.charAt(0)}
                </span>
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {seller.dealershipName || seller.fullName}
                </h1>
                {seller.isVerified && (
                  <CheckCircle className="w-6 h-6 text-blue-500 fill-blue-500" />
                )}
              </div>

              <p className="text-gray-400 mb-4">{seller.businessDescription}</p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{seller.city}, {seller.state}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{seller.yearsInBusiness} years in business</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Car className="w-4 h-4" />
                  <span>{stats.total} listings</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Star className="w-4 h-4" />
                  <span>Member since {new Date(seller.createdAt).getFullYear()}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {user?._id !== seller._id && (
              <div className="flex flex-col gap-3">
                <a
                  href={`tel:${seller.phoneNumber}`}
                  className="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Call Seller
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Listings */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">
            Cars from this seller ({stats.total})
          </h2>

          {cars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cars.map(car => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Car}
              title="No listings"
              description="This seller doesn't have any active listings at the moment"
            />
          )}

          {/* Pagination */}
          {stats.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: stats.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => fetchSellerData(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    stats.currentPage === page
                      ? 'bg-primary text-white'
                      : 'bg-dark-50 text-gray-400 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;

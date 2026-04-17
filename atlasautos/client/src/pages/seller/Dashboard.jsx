import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Eye, 
  MessageCircle, 
  TrendingUp,
  PlusCircle,
  ChevronRight,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CarCard from '../../components/ui/CarCard';
import { formatNumber } from '../../utils/formatters';

const SellerDashboard = () => {
  const { api, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    fetchDashboardData();
    fetchUnreadMessages();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cars/seller/my-listings?limit=4');
      setStats(response.data.stats);
      setRecentListings(response.data.cars);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadMessages = async () => {
    try {
      const response = await api.get('/chat/unread-count');
      setUnreadMessages(response.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch unread messages:', error);
    }
  };

  const statCards = [
    { 
      icon: Car, 
      label: 'Total Listings', 
      value: stats?.totalListings || 0,
      color: 'bg-blue-500/10 text-blue-400',
      link: '/seller/listings'
    },
    { 
      icon: Activity, 
      label: 'Active Listings', 
      value: stats?.activeListings || 0,
      color: 'bg-green-500/10 text-green-400',
      link: '/seller/listings'
    },
    { 
      icon: Eye, 
      label: 'Total Views', 
      value: formatNumber(stats?.totalViews || 0),
      color: 'bg-purple-500/10 text-purple-400',
      link: '/seller/listings'
    },
    { 
      icon: MessageCircle, 
      label: 'Messages', 
      value: unreadMessages,
      color: 'bg-primary/10 text-primary',
      link: '/seller/messages',
      badge: unreadMessages > 0
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Welcome back, {user?.fullName?.split(' ')[0]}
          </h1>
          <p className="text-gray-400 mt-1">
            Here's what's happening with your listings
          </p>
        </div>
        <Link
          to="/seller/add-car"
          className="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add New Car</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-dark-50 rounded-xl p-4 md:p-6 border border-dark-100 hover:border-primary/30 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              {stat.badge && (
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white mt-4">
              {stat.value}
            </p>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Listings */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Listings</h2>
          <Link
            to="/seller/listings"
            className="flex items-center space-x-1 text-primary hover:text-primary-400 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {recentListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentListings.map(car => (
              <CarCard key={car._id} car={car} showFavorite={false} />
            ))}
          </div>
        ) : (
          <div className="bg-dark-50 rounded-xl p-12 text-center border border-dark-100">
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No listings yet</h3>
            <p className="text-gray-400 mb-6">
              Start selling by adding your first car listing
            </p>
            <Link
              to="/seller/add-car"
              className="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Your First Car</span>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Tips to Sell Faster
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Upload high-quality photos of your car
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Write a detailed description
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Respond to inquiries quickly
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Price competitively based on market value
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;

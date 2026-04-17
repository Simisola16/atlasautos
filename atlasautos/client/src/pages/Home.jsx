import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Car, MessageCircle, Shield, ChevronRight, TrendingUp, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CarCard from '../components/ui/CarCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import { CAR_BRANDS } from '../utils/constants';

const Home = () => {
  const { api } = useAuth();
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFeaturedCars();
    loadRecentlyViewed();
  }, []);

  const fetchFeaturedCars = async () => {
    try {
      const response = await api.get('/cars?limit=6&sortBy=most-viewed');
      setFeaturedCars(response.data.cars);
    } catch (error) {
      console.error('Failed to fetch featured cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentlyViewed = () => {
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentlyViewed(viewed.slice(0, 4));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const stats = [
    { icon: Car, value: '10,000+', label: 'Cars Listed' },
    { icon: Shield, value: '500+', label: 'Verified Sellers' },
    { icon: MessageCircle, value: '50,000+', label: 'Chats Initiated' },
    { icon: Star, value: '4.8', label: 'User Rating' },
  ];

  const features = [
    {
      icon: Search,
      title: 'Easy Search',
      description: 'Find your perfect car with advanced filters and search options'
    },
    {
      icon: MessageCircle,
      title: 'Direct Chat',
      description: 'Connect with sellers in real-time through our messaging system'
    },
    {
      icon: Shield,
      title: 'Verified Sellers',
      description: 'All sellers are verified for your peace of mind'
    },
    {
      icon: TrendingUp,
      title: 'Compare Cars',
      description: 'Compare up to 3 cars side by side to make the best choice'
    }
  ];

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-dark-50 to-dark py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Find Your <span className="gradient-text">Dream Car</span> Today
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8">
              Nigeria's premier marketplace for buying and selling cars. 
              Browse thousands of verified listings from trusted dealers.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by brand, model, or keyword..."
                  className="w-full bg-dark border border-dark-100 rounded-xl py-4 pl-14 pr-32 text-white placeholder-gray-500 focus:border-primary transition-colors text-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick Brand Links */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {['Toyota', 'Mercedes', 'BMW', 'Honda', 'Lexus'].map(brand => (
                <Link
                  key={brand}
                  to={`/browse?brand=${brand}`}
                  className="px-4 py-2 bg-dark-100 hover:bg-dark-200 text-gray-300 rounded-full text-sm transition-colors"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-dark-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Featured Cars</h2>
              <p className="text-gray-400 mt-1">Most popular listings this week</p>
            </div>
            <Link
              to="/browse"
              className="flex items-center space-x-2 text-primary hover:text-primary-400 transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              featuredCars.map(car => <CarCard key={car._id} car={car} />)
            )}
          </div>
        </div>
      </section>

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <section className="py-16 bg-dark-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Recently Viewed</h2>
                <p className="text-gray-400 mt-1">Cars you've checked out recently</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed.map(car => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Why Choose AtlasAutos?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We provide the best platform for buying and selling cars in Nigeria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-dark-50 rounded-xl p-6 border border-dark-100 hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl p-8 md:p-12 border border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Sell Your Car?
                </h2>
                <p className="text-gray-400 max-w-lg">
                  Join thousands of sellers on AtlasAutos. List your car for free and reach thousands of potential buyers.
                </p>
              </div>
              <Link
                to="/register"
                className="bg-primary hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors whitespace-nowrap"
              >
                Start Selling Today
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Brand */}
      <section className="py-16 border-t border-dark-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            Browse by Brand
          </h2>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4">
            {CAR_BRANDS.slice(0, 9).map(brand => (
              <Link
                key={brand}
                to={`/browse?brand=${brand}`}
                className="bg-dark-50 hover:bg-dark-100 border border-dark-100 rounded-lg p-4 text-center transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-primary transition-colors font-medium">
                  {brand}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

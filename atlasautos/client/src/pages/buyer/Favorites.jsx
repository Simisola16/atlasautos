import { useState, useEffect } from 'react';
import { Heart, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CarCard from '../../components/ui/CarCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import EmptyState from '../../components/ui/EmptyState';

const Favorites = () => {
  const { api } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cars/user/favorites');
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFavorites = favorites.filter(car => 
    `${car.brand} ${car.model}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.year.toString().includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">My Favorites</h1>
          <p className="text-gray-400 mt-1">
            {favorites.length} {favorites.length === 1 ? 'car' : 'cars'} saved
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search favorites..."
            className="w-full bg-dark-50 border border-dark-100 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
          />
        </div>

        {/* Favorites Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFavorites.map(car => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title={searchQuery ? 'No matches found' : 'No favorites yet'}
            description={
              searchQuery 
                ? 'Try adjusting your search query'
                : 'Browse cars and click the heart icon to save your favorites'
            }
            actionLabel="Browse Cars"
            actionLink="/browse"
          />
        )}
      </div>
    </div>
  );
};

export default Favorites;

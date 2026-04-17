import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CarCard from '../components/ui/CarCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import EmptyState from '../components/ui/EmptyState';
import { 
  CAR_BRANDS, 
  BODY_TYPES, 
  ENGINE_TYPES, 
  TRANSMISSION_TYPES,
  NIGERIAN_STATES,
  CAR_YEARS,
  SORT_OPTIONS,
  SEAT_OPTIONS
} from '../utils/constants';

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { api } = useAuth();
  
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    brand: searchParams.get('brand') || '',
    condition: searchParams.get('condition') || '',
    bodyType: searchParams.get('bodyType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minYear: searchParams.get('minYear') || '',
    maxYear: searchParams.get('maxYear') || '',
    transmission: searchParams.get('transmission') || '',
    engineType: searchParams.get('engineType') || '',
    state: searchParams.get('state') || '',
    seats: searchParams.get('seats') || '',
    sortBy: searchParams.get('sortBy') || 'newest'
  });

  const fetchCars = useCallback(async (pageNum = 1, isLoadMore = false) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append('page', pageNum);
      params.append('limit', 12);
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`/cars?${params.toString()}`);
      
      if (isLoadMore) {
        setCars(prev => [...prev, ...response.data.cars]);
      } else {
        setCars(response.data.cars);
      }
      
      setTotalPages(response.data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, api]);

  useEffect(() => {
    fetchCars(1);
  }, [fetchCars]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      brand: '',
      condition: '',
      bodyType: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      transmission: '',
      engineType: '',
      state: '',
      seats: '',
      sortBy: 'newest'
    });
    setSearchParams({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v && v !== 'newest');

  const loadMore = () => {
    if (page < totalPages) {
      fetchCars(page + 1, true);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-dark-50 border-b border-dark-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by brand, model, or keyword..."
              className="w-full bg-dark border border-dark-100 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
            />
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-dark border border-dark-100 rounded-lg text-gray-300 hover:text-white hover:border-primary transition-colors whitespace-nowrap"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-primary rounded-full"></span>
              )}
            </button>

            {/* Quick Filters */}
            <select
              value={filters.condition}
              onChange={(e) => handleFilterChange('condition', e.target.value)}
              className="px-4 py-2 bg-dark border border-dark-100 rounded-lg text-gray-300 focus:border-primary transition-colors"
            >
              <option value="">All Conditions</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
            </select>

            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="px-4 py-2 bg-dark border border-dark-100 rounded-lg text-gray-300 focus:border-primary transition-colors"
            >
              <option value="">All Brands</option>
              {CAR_BRANDS.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-4 py-2 bg-dark border border-dark-100 rounded-lg text-gray-300 focus:border-primary transition-colors"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 px-3 py-2 text-red-400 hover:text-red-300 transition-colors whitespace-nowrap"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            {loading && cars.length === 0 ? (
              'Loading...'
            ) : (
              <>
                Showing <span className="text-white font-medium">{cars.length}</span> cars
              </>
            )}
          </p>
        </div>

        {/* Cars Grid */}
        {cars.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cars.map(car => (
                <CarCard key={car._id} car={car} />
              ))}
              {loading && Array(4).fill(0).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)}
            </div>

            {/* Load More */}
            {page < totalPages && !loading && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  className="bg-dark-50 hover:bg-dark-100 border border-dark-100 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="No cars found"
            description="Try adjusting your filters or search query to find what you're looking for."
            actionLabel="Clear Filters"
            onAction={clearFilters}
          />
        )}
      </div>

      {/* Filter Drawer (Mobile) */}
      {showFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-dark-50 rounded-t-2xl max-h-[80vh] overflow-auto animate-slideUp">
            <div className="p-4 border-b border-dark-100 flex items-center justify-between sticky top-0 bg-dark-50">
              <h3 className="text-lg font-semibold text-white">Filters</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white"
                >
                  <option value="">All Brands</option>
                  {CAR_BRANDS.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Condition</label>
                <div className="flex gap-2">
                  {['', 'New', 'Used'].map(cond => (
                    <button
                      key={cond || 'all'}
                      onClick={() => handleFilterChange('condition', cond)}
                      className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                        filters.condition === cond
                          ? 'bg-primary border-primary text-white'
                          : 'bg-dark border-dark-100 text-gray-400 hover:text-white'
                      }`}
                    >
                      {cond || 'All'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Body Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Body Type</label>
                <select
                  value={filters.bodyType}
                  onChange={(e) => handleFilterChange('bodyType', e.target.value)}
                  className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white"
                >
                  <option value="">All Types</option>
                  {BODY_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="Min Price"
                    className="bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white placeholder-gray-500"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Max Price"
                    className="bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Year Range */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Year Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={filters.minYear}
                    onChange={(e) => handleFilterChange('minYear', e.target.value)}
                    className="bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white"
                  >
                    <option value="">Min Year</option>
                    {CAR_YEARS.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <select
                    value={filters.maxYear}
                    onChange={(e) => handleFilterChange('maxYear', e.target.value)}
                    className="bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white"
                  >
                    <option value="">Max Year</option>
                    {CAR_YEARS.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Transmission</label>
                <select
                  value={filters.transmission}
                  onChange={(e) => handleFilterChange('transmission', e.target.value)}
                  className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white"
                >
                  <option value="">All</option>
                  {TRANSMISSION_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Engine Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Engine Type</label>
                <select
                  value={filters.engineType}
                  onChange={(e) => handleFilterChange('engineType', e.target.value)}
                  className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white"
                >
                  <option value="">All</option>
                  {ENGINE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <select
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white"
                >
                  <option value="">All States</option>
                  {NIGERIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {/* Seats */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Seats</label>
                <select
                  value={filters.seats}
                  onChange={(e) => handleFilterChange('seats', e.target.value)}
                  className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white"
                >
                  <option value="">Any</option>
                  {SEAT_OPTIONS.map(seat => (
                    <option key={seat} value={seat}>{seat} Seats</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-dark-100 sticky bottom-0 bg-dark-50">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-primary hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;

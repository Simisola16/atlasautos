import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { X, Plus, Check, ChevronLeft, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { 
  formatPrice, 
  formatMileage, 
  formatHP, 
  formatTorque,
  formatTopSpeed,
  formatAcceleration,
  formatFuelConsumption
} from '../../utils/formatters';
import toast from 'react-hot-toast';

const Compare = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { api } = useAuth();
  
  const [compareList, setCompareList] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load compare list from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('compareList') || '[]');
    setCompareList(saved);
    
    if (saved.length > 0) {
      fetchCars(saved);
    }
  }, []);

  const fetchCars = async (ids) => {
    try {
      setLoading(true);
      const response = await api.post('/cars/compare', { carIds: ids });
      setCars(response.data.cars);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
      toast.error('Failed to load cars for comparison');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCompare = (carId) => {
    const updated = compareList.filter(id => id !== carId);
    setCompareList(updated);
    localStorage.setItem('compareList', JSON.stringify(updated));
    setCars(prev => prev.filter(car => car._id !== carId));
  };

  const clearCompare = () => {
    setCompareList([]);
    setCars([]);
    localStorage.removeItem('compareList');
  };

  const addToCompare = (carId) => {
    if (compareList.length >= 3) {
      toast.error('You can compare up to 3 cars');
      return;
    }
    if (compareList.includes(carId)) {
      toast.error('Car already in comparison');
      return;
    }
    const updated = [...compareList, carId];
    setCompareList(updated);
    localStorage.setItem('compareList', JSON.stringify(updated));
    fetchCars(updated);
  };

  const comparisonFields = [
    { label: 'Price', key: 'price', format: formatPrice },
    { label: 'Year', key: 'year' },
    { label: 'Condition', key: 'condition' },
    { label: 'Body Type', key: 'bodyType' },
    { label: 'Mileage', key: 'mileage', format: formatMileage },
    { label: 'Engine Type', key: 'engineType' },
    { label: 'Engine Size', key: 'engineSize' },
    { label: 'Horsepower', key: 'horsepower', format: formatHP },
    { label: 'Torque', key: 'torque', format: formatTorque },
    { label: 'Transmission', key: 'transmission' },
    { label: 'Drive Type', key: 'driveType' },
    { label: 'Fuel Consumption', key: 'fuelConsumption', format: formatFuelConsumption },
    { label: 'Seats', key: 'numberOfSeats', format: (v) => `${v} seats` },
    { label: 'Doors', key: 'numberOfDoors', format: (v) => `${v} doors` },
  ];

  if (cars.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-dark py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Compare Cars</h1>
          <p className="text-gray-400 mb-8">
            Select cars to compare side by side and find the best option for you.
          </p>
          <Link
            to="/browse"
            className="bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Browse Cars to Compare
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Compare Cars</h1>
            <p className="text-gray-400 mt-1">
              {cars.length} of 3 cars selected
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/browse"
              className="bg-dark-50 hover:bg-dark-100 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Car
            </Link>
            {cars.length > 0 && (
              <button
                onClick={clearCompare}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium sticky left-0 bg-dark z-10">Feature</th>
                  {cars.map(car => (
                    <th key={car._id} className="py-4 px-4 min-w-[250px]">
                      <div className="relative">
                        <button
                          onClick={() => removeFromCompare(car._id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-dark-100 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-full flex items-center justify-center transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <Link to={`/car/${car._id}`} className="block">
                          <img
                            src={car.coverPhoto}
                            alt={`${car.brand} ${car.model}`}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <p className="text-white font-medium text-left">
                            {car.year} {car.brand} {car.model}
                          </p>
                          <p className="text-primary font-bold text-left">
                            {formatPrice(car.price)}
                          </p>
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFields.map((field, index) => (
                  <tr key={field.key} className={index % 2 === 0 ? 'bg-dark-50/50' : ''}>
                    <td className="py-3 px-4 text-gray-300 font-medium sticky left-0 bg-dark z-10">
                      {field.label}
                    </td>
                    {cars.map(car => (
                      <td key={car._id} className="py-3 px-4 text-white">
                        {field.format 
                          ? field.format(car[field.key]) 
                          : car[field.key] || 'N/A'
                        }
                      </td>
                    ))}
                  </tr>
                ))}
                
                {/* Features */}
                <tr className="bg-dark-50/50">
                  <td className="py-3 px-4 text-gray-300 font-medium sticky left-0 bg-dark z-10">
                    Features
                  </td>
                  {cars.map(car => (
                    <td key={car._id} className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {car.features?.slice(0, 5).map((feature, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded"
                          >
                            {feature}
                          </span>
                        ))}
                        {car.features?.length > 5 && (
                          <span className="text-gray-400 text-xs">
                            +{car.features.length - 5} more
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr>
                  <td className="py-4 px-4 sticky left-0 bg-dark z-10"></td>
                  {cars.map(car => (
                    <td key={car._id} className="py-4 px-4">
                      <Link
                        to={`/car/${car._id}`}
                        className="block w-full bg-primary hover:bg-primary-600 text-white text-center py-2 rounded-lg font-medium transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;

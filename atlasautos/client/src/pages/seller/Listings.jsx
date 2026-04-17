import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit2, Trash2, Eye, MoreVertical } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';

const SellerListings = () => {
  const { api } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cars/seller/my-listings?limit=100');
      setListings(response.data.cars);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      setDeletingId(id);
      await api.delete(`/cars/${id}`);
      setListings(prev => prev.filter(listing => listing._id !== id));
      toast.success('Listing deleted successfully');
    } catch (error) {
      toast.error('Failed to delete listing');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Available: 'bg-green-500/20 text-green-400',
      Sold: 'bg-red-500/20 text-red-400',
      Reserved: 'bg-yellow-500/20 text-yellow-400'
    };
    return styles[status] || 'bg-gray-500/20 text-gray-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">My Listings</h1>
          <p className="text-gray-400 mt-1">
            Manage your car listings
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

      {/* Listings */}
      {listings.length > 0 ? (
        <div className="bg-dark-50 rounded-xl border border-dark-100 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-100">
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Car</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Price</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Views</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map(listing => (
                  <tr key={listing._id} className="border-b border-dark-100 last:border-0 hover:bg-dark/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={listing.coverPhoto}
                          alt={`${listing.brand} ${listing.model}`}
                          className="w-16 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-white">
                            {listing.year} {listing.brand} {listing.model}
                          </p>
                          <p className="text-sm text-gray-400">{listing.condition}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-primary">{formatPrice(listing.price)}</p>
                      {listing.negotiable && (
                        <span className="text-xs text-green-400">Negotiable</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(listing.availabilityStatus)}`}>
                        {listing.availabilityStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span>{listing.viewCount}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/car/${listing._id}`}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/seller/edit-car/${listing._id}`}
                          className="p-2 text-gray-400 hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(listing._id)}
                          disabled={deletingId === listing._id}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === listing._id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-dark-100">
            {listings.map(listing => (
              <div key={listing._id} className="p-4">
                <div className="flex gap-4">
                  <img
                    src={listing.coverPhoto}
                    alt={`${listing.brand} ${listing.model}`}
                    className="w-24 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-white truncate">
                          {listing.year} {listing.brand} {listing.model}
                        </p>
                        <p className="text-lg font-bold text-primary mt-1">
                          {formatPrice(listing.price)}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getStatusBadge(listing.availabilityStatus)}`}>
                        {listing.availabilityStatus}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {listing.viewCount}
                      </span>
                      <span>{listing.condition}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Link
                        to={`/car/${listing._id}`}
                        className="flex-1 py-2 bg-dark-100 text-white text-center rounded-lg text-sm font-medium"
                      >
                        View
                      </Link>
                      <Link
                        to={`/seller/edit-car/${listing._id}`}
                        className="flex-1 py-2 bg-primary text-white text-center rounded-lg text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(listing._id)}
                        disabled={deletingId === listing._id}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={PlusCircle}
          title="No listings yet"
          description="Start selling by adding your first car listing"
          actionLabel="Add Your First Car"
          actionLink="/seller/add-car"
        />
      )}
    </div>
  );
};

export default SellerListings;

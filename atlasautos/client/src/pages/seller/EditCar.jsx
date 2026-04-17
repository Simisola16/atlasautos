import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, X, Check, Camera, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { 
  CAR_BRANDS, 
  BODY_TYPES, 
  ENGINE_TYPES, 
  TRANSMISSION_TYPES,
  DRIVE_TYPES,
  SEAT_OPTIONS,
  DOOR_OPTIONS,
  CAR_YEARS,
  CAR_FEATURES,
  SERVICE_HISTORY,
  IMPORT_TYPES,
  AVAILABILITY_STATUS
} from '../../utils/constants';
import toast from 'react-hot-toast';

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [newPhotoFiles, setNewPhotoFiles] = useState([]);
  const [deletedPhotos, setDeletedPhotos] = useState([]);
  
  const [formData, setFormData] = useState({
    condition: 'New',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    bodyType: '',
    color: '',
    engineType: '',
    engineSize: '',
    horsepower: '',
    torque: '',
    topSpeed: '',
    acceleration: '',
    transmission: '',
    driveType: '',
    numberOfSeats: 5,
    numberOfDoors: 4,
    tyreSize: '',
    fuelTankCapacity: '',
    fuelConsumption: '',
    features: [],
    price: '',
    negotiable: false,
    description: '',
    availabilityStatus: 'Available',
    mileage: '',
    previousOwners: '',
    registeredState: '',
    registeredCity: '',
    importType: '',
    serviceHistory: '',
    accidentHistory: { hasAccident: false, description: '' },
    lastServiceDate: '',
    remainingWarranty: ''
  });

  useEffect(() => {
    fetchCarData();
  }, [id]);

  const fetchCarData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/cars/${id}`);
      const car = response.data.car;
      
      setPhotos(car.photos || []);
      setFormData({
        condition: car.condition,
        brand: car.brand,
        model: car.model,
        year: car.year,
        bodyType: car.bodyType,
        color: car.color,
        engineType: car.engineType,
        engineSize: car.engineSize || '',
        horsepower: car.horsepower || '',
        torque: car.torque || '',
        topSpeed: car.topSpeed || '',
        acceleration: car.acceleration || '',
        transmission: car.transmission,
        driveType: car.driveType,
        numberOfSeats: car.numberOfSeats,
        numberOfDoors: car.numberOfDoors,
        tyreSize: car.tyreSize || '',
        fuelTankCapacity: car.fuelTankCapacity || '',
        fuelConsumption: car.fuelConsumption || '',
        features: car.features || [],
        price: car.price,
        negotiable: car.negotiable,
        description: car.description || '',
        availabilityStatus: car.availabilityStatus,
        mileage: car.mileage || '',
        previousOwners: car.previousOwners || '',
        registeredState: car.registeredState || '',
        registeredCity: car.registeredCity || '',
        importType: car.importType || '',
        serviceHistory: car.serviceHistory || '',
        accidentHistory: car.accidentHistory || { hasAccident: false, description: '' },
        lastServiceDate: car.lastServiceDate ? car.lastServiceDate.split('T')[0] : '',
        remainingWarranty: car.remainingWarranty || ''
      });
    } catch (error) {
      console.error('Failed to fetch car:', error);
      toast.error('Failed to load car details');
      navigate('/seller/listings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNewPhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (photos.length - deletedPhotos.length + newPhotoFiles.length + files.length > 10) {
      toast.error('Maximum 10 photos allowed');
      return;
    }
    
    const newPhotos = files.map(file => URL.createObjectURL(file));
    setPhotos(prev => [...prev, ...newPhotos]);
    setNewPhotoFiles(prev => [...prev, ...files]);
  };

  const removePhoto = (index) => {
    const photo = photos[index];
    
    // Check if it's an existing photo (starts with http) or new photo
    if (photo.startsWith('http')) {
      setDeletedPhotos(prev => [...prev, index]);
    } else {
      // It's a new photo, remove from newPhotoFiles
      const newPhotoIndex = photos.slice(0, index).filter(p => !p.startsWith('http')).length;
      setNewPhotoFiles(prev => prev.filter((_, i) => i !== newPhotoIndex));
    }
    
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      
      const data = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'features' || key === 'accidentHistory') {
          data.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null && value !== '') {
          data.append(key, value);
        }
      });
      
      // Append new photos
      newPhotoFiles.forEach(file => {
        data.append('photos', file);
      });

      await api.put(`/cars/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Listing updated successfully!');
      navigate('/seller/listings');
    } catch (error) {
      console.error('Failed to update listing:', error);
      toast.error(error.response?.data?.message || 'Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Listing</h1>
        <p className="text-gray-400 mt-1">Update your car listing information</p>
      </div>

      <div className="space-y-6">
        {/* Photos */}
        <div className="bg-dark-50 rounded-xl p-6 border border-dark-100">
          <h3 className="text-lg font-semibold text-white mb-4">Photos</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                <img 
                  src={photo.startsWith('http') ? photo : photo} 
                  alt={`Photo ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-primary text-white text-xs rounded">
                    Cover
                  </span>
                )}
              </div>
            ))}
            
            {photos.length < 10 && (
              <label className="aspect-square rounded-lg border-2 border-dashed border-dark-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <Camera className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-xs text-gray-400">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleNewPhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-dark-50 rounded-xl p-6 border border-dark-100">
          <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Brand</label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white"
                >
                  {CAR_BRANDS.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Year</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white"
                >
                  {CAR_YEARS.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Body Type</label>
                <select
                  name="bodyType"
                  value={formData.bodyType}
                  onChange={handleChange}
                  className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white"
                >
                  {BODY_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Availability</label>
              <select
                name="availabilityStatus"
                value={formData.availabilityStatus}
                onChange={handleChange}
                className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white"
              >
                {AVAILABILITY_STATUS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="bg-dark-50 rounded-xl p-6 border border-dark-100">
          <h3 className="text-lg font-semibold text-white mb-4">Pricing</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Price (₦)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white"
              />
            </div>
            
            <label className="flex items-center gap-3 text-gray-300">
              <input
                type="checkbox"
                name="negotiable"
                checked={formData.negotiable}
                onChange={handleChange}
                className="w-5 h-5 rounded border-dark-100"
              />
              <span>Price is negotiable</span>
            </label>
          </div>
        </div>

        {/* Features */}
        <div className="bg-dark-50 rounded-xl p-6 border border-dark-100">
          <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CAR_FEATURES.map(feature => (
              <label
                key={feature}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  formData.features.includes(feature)
                    ? 'border-primary bg-primary/10'
                    : 'border-dark-100 bg-dark hover:border-dark-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.features.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                  formData.features.includes(feature)
                    ? 'bg-primary border-primary'
                    : 'border-gray-500'
                }`}>
                  {formData.features.includes(feature) && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm ${formData.features.includes(feature) ? 'text-primary' : 'text-gray-300'}`}>
                  {feature}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-dark-50 rounded-xl p-6 border border-dark-100">
          <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            maxLength={2000}
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white resize-none"
          />
          <p className="text-gray-400 text-sm mt-1">
            {formData.description.length}/2000 characters
          </p>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/seller/listings')}
            className="flex-1 bg-dark-100 hover:bg-dark-200 text-white py-4 rounded-xl font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 bg-primary hover:bg-primary-600 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? <LoadingSpinner size="sm" /> : <span>Save Changes</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCar;

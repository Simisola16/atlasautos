import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Check,
  Camera,
  AlertTriangle
} from 'lucide-react';
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

const AddCar = () => {
  const navigate = useNavigate();
  const { api } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [inspectionReport, setInspectionReport] = useState(null);
  
  const [formData, setFormData] = useState({
    // Basic Info
    condition: 'New',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    bodyType: '',
    color: '',
    
    // Engine & Performance
    engineType: '',
    engineSize: '',
    horsepower: '',
    torque: '',
    topSpeed: '',
    acceleration: '',
    
    // Transmission & Drive
    transmission: '',
    driveType: '',
    
    // Dimensions
    numberOfSeats: 5,
    numberOfDoors: 4,
    tyreSize: '',
    
    // Fuel
    fuelTankCapacity: '',
    fuelConsumption: '',
    
    // Features
    features: [],
    
    // Price
    price: '',
    negotiable: false,
    
    // Description
    description: '',
    availabilityStatus: 'Available',
    
    // Used Car Fields
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (photoFiles.length + files.length > 10) {
      toast.error('Maximum 10 photos allowed');
      return;
    }
    
    const newPhotos = files.map(file => URL.createObjectURL(file));
    setPhotos(prev => [...prev, ...newPhotos]);
    setPhotoFiles(prev => [...prev, ...files]);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
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
    if (photoFiles.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    try {
      setLoading(true);
      
      const data = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'features') {
          data.append(key, JSON.stringify(value));
        } else if (key === 'accidentHistory') {
          data.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null && value !== '') {
          data.append(key, value);
        }
      });
      
      // Append photos
      photoFiles.forEach(file => {
        data.append('photos', file);
      });
      
      // Append inspection report if exists
      if (inspectionReport) {
        data.append('inspectionReport', inspectionReport);
      }

      await api.post('/cars', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Car listing created successfully!');
      navigate('/seller/listings');
    } catch (error) {
      console.error('Failed to create listing:', error);
      toast.error(error.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Basic Information</h3>
      
      {/* Condition */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Car Condition *</label>
        <div className="flex gap-4">
          {['New', 'Used'].map(cond => (
            <label
              key={cond}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                formData.condition === cond
                  ? 'border-primary bg-primary/10'
                  : 'border-dark-100 bg-dark hover:border-dark-200'
              }`}
            >
              <input
                type="radio"
                name="condition"
                value={cond}
                checked={formData.condition === cond}
                onChange={handleChange}
                className="hidden"
              />
              <span className={`font-medium ${formData.condition === cond ? 'text-primary' : 'text-gray-300'}`}>
                {cond}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand & Model */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Brand *</label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white focus:border-primary transition-colors"
            required
          >
            <option value="">Select Brand</option>
            {CAR_BRANDS.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Model *</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="e.g., Camry"
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
            required
          />
        </div>
      </div>

      {/* Year & Body Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Year *</label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white focus:border-primary transition-colors"
            required
          >
            {CAR_YEARS.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Body Type *</label>
          <select
            name="bodyType"
            value={formData.bodyType}
            onChange={handleChange}
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white focus:border-primary transition-colors"
            required
          >
            <option value="">Select Type</option>
            {BODY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Color *</label>
        <input
          type="text"
          name="color"
          value={formData.color}
          onChange={handleChange}
          placeholder="e.g., Black"
          className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
          required
        />
      </div>

      {/* Used Car Fields */}
      {formData.condition === 'Used' && (
        <div className="border-t border-dark-100 pt-6 space-y-4">
          <h4 className="text-md font-medium text-white">Used Car Information</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mileage (km) *</label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                placeholder="e.g., 50000"
                className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Previous Owners</label>
              <input
                type="number"
                name="previousOwners"
                value={formData.previousOwners}
                onChange={handleChange}
                placeholder="e.g., 1"
                min="0"
                className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Import Type</label>
              <select
                name="importType"
                value={formData.importType}
                onChange={handleChange}
                className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white focus:border-primary transition-colors"
              >
                <option value="">Select</option>
                {IMPORT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Service History</label>
              <select
                name="serviceHistory"
                value={formData.serviceHistory}
                onChange={handleChange}
                className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white focus:border-primary transition-colors"
              >
                <option value="">Select</option>
                {SERVICE_HISTORY.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Accident History */}
          <div>
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                name="accidentHistory.hasAccident"
                checked={formData.accidentHistory.hasAccident}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  accidentHistory: { ...prev.accidentHistory, hasAccident: e.target.checked }
                }))}
                className="w-4 h-4 rounded border-dark-100"
              />
              <span>Has Accident History</span>
            </label>
            {formData.accidentHistory.hasAccident && (
              <textarea
                value={formData.accidentHistory.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  accidentHistory: { ...prev.accidentHistory, description: e.target.value }
                }))}
                placeholder="Describe the accident..."
                rows={3}
                className="w-full mt-2 bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-primary transition-colors resize-none"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Engine & Performance</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Engine Type *</label>
          <select
            name="engineType"
            value={formData.engineType}
            onChange={handleChange}
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white focus:border-primary transition-colors"
            required
          >
            <option value="">Select</option>
            {ENGINE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Engine Size</label>
          <input
            type="text"
            name="engineSize"
            value={formData.engineSize}
            onChange={handleChange}
            placeholder="e.g., 2.0L"
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Horsepower</label>
          <input
            type="number"
            name="horsepower"
            value={formData.horsepower}
            onChange={handleChange}
            placeholder="e.g., 200"
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Torque (Nm)</label>
          <input
            type="number"
            name="torque"
            value={formData.torque}
            onChange={handleChange}
            placeholder="e.g., 350"
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Top Speed (km/h)</label>
          <input
            type="number"
            name="topSpeed"
            value={formData.topSpeed}
            onChange={handleChange}
            placeholder="e.g., 220"
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">0-100 km/h (seconds)</label>
          <input
            type="number"
            name="acceleration"
            value={formData.acceleration}
            onChange={handleChange}
            placeholder="e.g., 8.5"
            step="0.1"
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Transmission *</label>
          <select
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white focus:border-primary transition-colors"
            required
          >
            <option value="">Select</option>
            {TRANSMISSION_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Drive Type *</label>
          <select
            name="driveType"
            value={formData.driveType}
            onChange={handleChange}
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white focus:border-primary transition-colors"
            required
          >
            <option value="">Select</option>
            {DRIVE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Fuel Tank Capacity (L)</label>
          <input
            type="number"
            name="fuelTankCapacity"
            value={formData.fuelTankCapacity}
            onChange={handleChange}
            placeholder="e.g., 60"
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Fuel Consumption (L/100km)</label>
          <input
            type="number"
            name="fuelConsumption"
            value={formData.fuelConsumption}
            onChange={handleChange}
            placeholder="e.g., 7.5"
            step="0.1"
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Seats *</label>
          <select
            name="numberOfSeats"
            value={formData.numberOfSeats}
            onChange={handleChange}
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white focus:border-primary transition-colors"
            required
          >
            {SEAT_OPTIONS.map(seat => (
              <option key={seat} value={seat}>{seat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Doors *</label>
          <select
            name="numberOfDoors"
            value={formData.numberOfDoors}
            onChange={handleChange}
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white focus:border-primary transition-colors"
            required
          >
            {DOOR_OPTIONS.map(door => (
              <option key={door} value={door}>{door}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tyre Size</label>
          <input
            type="text"
            name="tyreSize"
            value={formData.tyreSize}
            onChange={handleChange}
            placeholder="e.g., 225/45R17"
            className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Features</h3>
      <p className="text-gray-400">Select all features that apply to your car</p>
      
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
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Photos & Pricing</h3>
      
      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Car Photos * (Max 10)
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
              <img src={photo} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
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
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
        <p className="text-gray-400 text-sm mt-2">
          First photo will be used as the cover image. Drag to reorder (coming soon).
        </p>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Price (₦) *</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="e.g., 5000000"
          className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
          required
        />
      </div>

      {/* Negotiable */}
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

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your car in detail..."
          rows={5}
          maxLength={2000}
          className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-primary transition-colors resize-none"
        />
        <p className="text-gray-400 text-sm mt-1">
          {formData.description.length}/2000 characters
        </p>
      </div>

      {/* Availability */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Availability</label>
        <select
          name="availabilityStatus"
          value={formData.availabilityStatus}
          onChange={handleChange}
          className="w-full bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white focus:border-primary transition-colors"
        >
          {AVAILABILITY_STATUS.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Inspection Report (for used cars) */}
      {formData.condition === 'Used' && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Inspection Report (Optional)
          </label>
          <label className="flex items-center gap-3 p-4 border border-dashed border-dark-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
            <Upload className="w-6 h-6 text-gray-400" />
            <div>
              <p className="text-gray-300">
                {inspectionReport ? inspectionReport.name : 'Upload inspection report'}
              </p>
              <p className="text-gray-400 text-sm">PDF, JPG, or PNG</p>
            </div>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setInspectionReport(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );

  const steps = [
    { number: 1, title: 'Basic Info', render: renderStep1 },
    { number: 2, title: 'Performance', render: renderStep2 },
    { number: 3, title: 'Features', render: renderStep3 },
    { number: 4, title: 'Photos & Price', render: renderStep4 },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Add New Car</h1>
        <p className="text-gray-400 mt-1">List your car for sale on AtlasAutos</p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, index) => (
          <div key={s.number} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= s.number
                ? 'bg-primary text-white'
                : 'bg-dark-100 text-gray-400'
            }`}>
              {step > s.number ? <Check className="w-4 h-4" /> : s.number}
            </div>
            <span className={`hidden sm:block ml-2 text-sm ${
              step >= s.number ? 'text-white' : 'text-gray-400'
            }`}>
              {s.title}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-8 sm:w-12 h-0.5 mx-2 ${
                step > s.number ? 'bg-primary' : 'bg-dark-100'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-dark-50 rounded-xl p-6 border border-dark-100">
        {steps[step - 1].render()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
          className="flex items-center space-x-2 px-6 py-3 bg-dark-100 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>
        
        {step < steps.length ? (
          <button
            onClick={() => setStep(step + 1)}
            className="flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <span>Publish Listing</span>
                <Check className="w-5 h-5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddCar;

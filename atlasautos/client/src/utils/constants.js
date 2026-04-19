// Car brands
export const CAR_BRANDS = [
  'Toyota',
  'Mercedes',
  'BMW',
  'Honda',
  'Ford',
  'Lexus',
  'Hyundai',
  'Kia',
  'Audi',
  'Volkswagen',
  'Nissan',
  'Peugeot',
  'Mitsubishi',
  'Range Rover',
  'Porsche',
  'Ferrari',
  'Lamborghini',
  'Other'
];

// Body types
export const BODY_TYPES = [
  'Sedan',
  'SUV',
  'Coupe',
  'Hatchback',
  'Pickup Truck',
  'Van',
  'Convertible',
  'Station Wagon'
];

// Engine types
export const ENGINE_TYPES = [
  'Petrol',
  'Diesel',
  'Electric',
  'Hybrid',
  'Plug-in Hybrid'
];

// Transmission types
export const TRANSMISSION_TYPES = [
  'Automatic',
  'Manual',
  'CVT',
  'Semi-Automatic'
];

// Drive types
export const DRIVE_TYPES = [
  'FWD',
  'RWD',
  'AWD',
  '4WD'
];

// Seat options
export const SEAT_OPTIONS = [2, 4, 5, 7, 8, 9];

// Door options
export const DOOR_OPTIONS = [2, 3, 4, 5];

// Car features
export const CAR_FEATURES = [
  'Sunroof',
  'Leather Seats',
  'Heated Seats',
  'Blind Spot Monitor',
  'Lane Assist',
  'Adaptive Cruise Control',
  '360 Camera',
  'Apple CarPlay',
  'Android Auto',
  'Wireless Charging',
  'Keyless Entry',
  'Push Start',
  'Electric Windows',
  'Climate Control',
  'Parking Sensors',
  'Navigation/GPS',
  'Bluetooth',
  'USB Ports',
  'Third Row Seating',
  'Electric Boot'
];

// Years (1950-Present)
export const CAR_YEARS = Array.from({ length: new Date().getFullYear() + 1 - 1950 + 1 }, (_, i) => 1950 + i).reverse();

// Nigerian states
export const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'FCT - Abuja',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara'
];

// Service history options
export const SERVICE_HISTORY = ['Full', 'Partial', 'None'];

// Import types
export const IMPORT_TYPES = ['Import', 'Locally Used'];

// Availability status
export const AVAILABILITY_STATUS = ['Available', 'Sold', 'Reserved'];

// Sort options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'most-viewed', label: 'Most Viewed' }
];

// Price ranges for filters
export const PRICE_RANGES = [
  { min: 0, max: 5000000, label: 'Under ₦5M' },
  { min: 5000000, max: 10000000, label: '₦5M - ₦10M' },
  { min: 10000000, max: 20000000, label: '₦10M - ₦20M' },
  { min: 20000000, max: 50000000, label: '₦20M - ₦50M' },
  { min: 50000000, max: 100000000, label: '₦50M - ₦100M' },
  { min: 100000000, max: null, label: 'Above ₦100M' }
];

// Colors
export const CAR_COLORS = [
  'Black',
  'White',
  'Silver',
  'Gray',
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Orange',
  'Brown',
  'Beige',
  'Gold',
  'Purple',
  'Maroon',
  'Navy',
  'Other'
];

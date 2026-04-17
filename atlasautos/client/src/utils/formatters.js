// Format price in Naira
export const formatPrice = (price) => {
  if (!price && price !== 0) return '₦0';
  return '₦' + price.toLocaleString('en-NG');
};

// Format number with commas
export const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  return num.toLocaleString('en-NG');
};

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(dateString);
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Format mileage
export const formatMileage = (mileage) => {
  if (!mileage && mileage !== 0) return 'N/A';
  return formatNumber(mileage) + ' km';
};

// Format engine size
export const formatEngineSize = (size) => {
  if (!size) return 'N/A';
  return size + 'L';
};

// Format horsepower
export const formatHP = (hp) => {
  if (!hp && hp !== 0) return 'N/A';
  return hp + ' HP';
};

// Format torque
export const formatTorque = (torque) => {
  if (!torque && torque !== 0) return 'N/A';
  return torque + ' Nm';
};

// Format top speed
export const formatTopSpeed = (speed) => {
  if (!speed && speed !== 0) return 'N/A';
  return speed + ' km/h';
};

// Format acceleration
export const formatAcceleration = (acc) => {
  if (!acc && acc !== 0) return 'N/A';
  return acc + 's';
};

// Format fuel consumption
export const formatFuelConsumption = (consumption) => {
  if (!consumption && consumption !== 0) return 'N/A';
  return consumption + ' L/100km';
};

// Format fuel tank capacity
export const formatFuelTank = (capacity) => {
  if (!capacity && capacity !== 0) return 'N/A';
  return capacity + ' L';
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Format phone number (Nigerian format)
export const formatPhone = (phone) => {
  if (!phone) return '';
  // Remove non-digits
  const cleaned = phone.replace(/\D/g, '');
  // Format as +234 XXX XXX XXXX
  if (cleaned.length === 11) {
    return `+234 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  if (cleaned.length === 13 && cleaned.startsWith('234')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  return phone;
};

import { Car } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center p-4">
        {/* The drifting car */}
        <div className="animate-drift text-primary z-10">
          <Car className={`${sizeClasses[size]} drop-shadow-lg`} strokeWidth={1.5} />
        </div>
        
        {/* Dust trails */}
        <div className="absolute bottom-2 left-2 w-3 h-3 bg-white/40 rounded-full blur-[2px] animate-dust-1 z-0"></div>
        <div className="absolute bottom-4 right-2 w-4 h-4 bg-white/30 rounded-full blur-[3px] animate-dust-2 z-0"></div>
        <div className="absolute bottom-1 left-6 w-2 h-2 bg-white/50 rounded-full blur-[2px] animate-dust-3 z-0"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

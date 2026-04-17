const SkeletonCard = () => {
  return (
    <div className="bg-dark-50 rounded-xl overflow-hidden border border-dark-100">
      {/* Image skeleton */}
      <div className="aspect-video skeleton" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 w-3/4 skeleton rounded" />
        
        {/* Price */}
        <div className="h-6 w-1/2 skeleton rounded" />
        
        {/* Details */}
        <div className="flex gap-2">
          <div className="h-4 w-16 skeleton rounded" />
          <div className="h-4 w-16 skeleton rounded" />
          <div className="h-4 w-16 skeleton rounded" />
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 w-20 skeleton rounded" />
          <div className="h-8 w-24 skeleton rounded" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;

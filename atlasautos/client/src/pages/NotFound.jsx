import { Link } from 'react-router-dom';
import { Car, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Graphic */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-dark-100">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Car className="w-24 h-24 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        
        <p className="text-gray-400 mb-8">
          Oops! Looks like you've taken a wrong turn. The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-dark-50 hover:bg-dark-100 text-white rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-dark-100">
          <p className="text-gray-400 text-sm mb-4">Popular pages</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/browse"
              className="px-4 py-2 bg-dark-50 hover:bg-dark-100 text-gray-300 rounded-lg text-sm transition-colors"
            >
              Browse Cars
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-dark-50 hover:bg-dark-100 text-gray-300 rounded-lg text-sm transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-dark-50 hover:bg-dark-100 text-gray-300 rounded-lg text-sm transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

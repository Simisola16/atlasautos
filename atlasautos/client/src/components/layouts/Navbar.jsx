import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Heart, MessageCircle, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/browse', label: 'Browse Cars' },
  ];

  const authLinks = user?.role === 'buyer' ? [
    { to: '/favorites', label: 'Favorites', icon: Heart },
    { to: '/conversations', label: 'Messages', icon: MessageCircle },
    { to: '/profile', label: 'Profile', icon: User },
  ] : [];

  return (
    <nav className="sticky top-0 z-50 bg-dark/95 backdrop-blur-md border-b border-dark-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">
              <span className="text-primary">ATLAS</span>
              <span className="text-white">AUTOS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-300 hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'buyer' && (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/favorites"
                      className="text-gray-300 hover:text-primary transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                    </Link>
                    <Link
                      to="/conversations"
                      className="text-gray-300 hover:text-primary transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </Link>
                  </div>
                )}
                {user?.role === 'seller' && (
                  <Link
                    to="/seller/dashboard"
                    className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="font-medium">{user?.fullName?.split(' ')[0]}</span>
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-dark-50 rounded-lg shadow-lg border border-dark-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      to={user?.role === 'seller' ? '/seller/profile' : '/profile'}
                      className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-100 transition-colors"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-dark-100 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-50 border-t border-dark-100 animate-fadeIn">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="block text-gray-300 hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated && authLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 text-gray-300 hover:text-primary transition-colors font-medium"
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            ))}
            
            <div className="border-t border-dark-100 pt-4">
              {isAuthenticated ? (
                <>
                  {user?.role === 'seller' && (
                    <Link
                      to="/seller/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center bg-primary hover:bg-primary-600 text-white px-4 py-3 rounded-lg font-medium transition-colors mb-3"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center text-gray-300 hover:text-white transition-colors font-medium py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-primary hover:bg-primary-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

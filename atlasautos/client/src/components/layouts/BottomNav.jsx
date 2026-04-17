import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, MessageCircle, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BottomNav = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Don't show bottom nav on seller routes
  if (location.pathname.startsWith('/seller')) {
    return null;
  }

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/browse', icon: Search, label: 'Browse' },
  ];

  // Add authenticated-only items
  if (isAuthenticated && user?.role === 'buyer') {
    navItems.push(
      { to: '/favorites', icon: Heart, label: 'Saved' },
      { to: '/conversations', icon: MessageCircle, label: 'Messages' },
      { to: '/profile', icon: User, label: 'Profile' }
    );
  } else if (isAuthenticated && user?.role === 'seller') {
    navItems.push(
      { to: '/seller/messages', icon: MessageCircle, label: 'Messages' },
      { to: '/seller/profile', icon: User, label: 'Profile' }
    );
  } else {
    navItems.push(
      { to: '/login', icon: User, label: 'Account' }
    );
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-50 border-t border-dark-100 z-50 safe-area-pb">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'stroke-2' : 'stroke-1.5'}`} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

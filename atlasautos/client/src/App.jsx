import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import SellerLayout from './components/layouts/SellerLayout';

// Public Pages
import Home from './pages/Home';
import Browse from './pages/Browse';
import CarDetail from './pages/CarDetail';
import SellerProfile from './pages/SellerProfile';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Buyer Pages
import Favorites from './pages/buyer/Favorites';
import Compare from './pages/buyer/Compare';
import BuyerProfile from './pages/buyer/Profile';
import Chat from './pages/buyer/Chat';
import Conversations from './pages/buyer/Conversations';

// Seller Pages
import SellerDashboard from './pages/seller/Dashboard';
import SellerListings from './pages/seller/Listings';
import AddCar from './pages/seller/AddCar';
import EditCar from './pages/seller/EditCar';
import SellerMessages from './pages/seller/Messages';
import SellerProfilePage from './pages/seller/Profile';

// Shared
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.role === 'seller') {
      return <Navigate to="/seller/dashboard" replace />;
    }
    return <Navigate to="/browse" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="browse" element={<Browse />} />
        <Route path="car/:id" element={<CarDetail />} />
        <Route path="seller/:sellerId" element={<SellerProfile />} />
        <Route path="compare" element={<Compare />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      <Route path="/forgot-password" element={
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      } />
      <Route path="/reset-password" element={
        <PublicRoute>
          <ResetPassword />
        </PublicRoute>
      } />

      {/* Buyer Routes */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['buyer']}>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="favorites" element={<Favorites />} />
        <Route path="profile" element={<BuyerProfile />} />
        <Route path="conversations" element={<Conversations />} />
        <Route path="chat/:chatId" element={<Chat />} />
      </Route>

      {/* Seller Routes */}
      <Route path="/seller" element={
        <ProtectedRoute allowedRoles={['seller']}>
          <SellerLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<SellerDashboard />} />
        <Route path="listings" element={<SellerListings />} />
        <Route path="add-car" element={<AddCar />} />
        <Route path="edit-car/:id" element={<EditCar />} />
        <Route path="messages" element={<SellerMessages />} />
        <Route path="profile" element={<SellerProfilePage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Car, MessageCircle, Shield, ChevronRight, TrendingUp, Star, MapPin } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { useAuth } from '../context/AuthContext';
import CarCard from '../components/ui/CarCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import { CAR_BRANDS } from '../utils/constants';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const heroSlides = [
  {
    image: '/assets/luxury_gwagon.png',
    tag: 'Premium Collection',
    title: 'Experience the',
    highlight: 'Urban Legend',
    desc: 'The Mercedes-Benz G-Wagon. Uncompromising performance meets unparalleled luxury.'
  },
  {
    image: '/assets/luxury_bmw_m5.png',
    tag: 'M Performance',
    title: 'Precision Meets',
    highlight: 'Pure Power',
    desc: 'The BMW M5 Competition. Master every corner with legendary engineering and M xDrive.'
  },
  {
    image: '/assets/luxury_ferrari.png',
    tag: 'Sports & Performance',
    title: 'Dominate the',
    highlight: 'Open Road',
    desc: 'Engineered for speed, designed for soul. Discover our collection of high-performance supercars.'
  },
  {
    image: '/assets/luxury_amg_gtr.png',
    tag: 'AMG Driving Performance',
    title: 'Forged in the',
    highlight: 'Green Hell',
    desc: 'The Mercedes-AMG GT R. Pure track-bred technology for the ultimate road experience.'
  },
  {
    image: '/assets/luxury_rolls_royce.png',
    tag: 'Elite Status',
    title: 'The Pinnacle of',
    highlight: 'Automotive Art',
    desc: 'Rolls-Royce Phantom. More than a car, it is a statement of success and timeless elegance.'
  }
];

const Home = () => {
  const { api } = useAuth();
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFeaturedCars();
    loadRecentlyViewed();
  }, []);

  const fetchFeaturedCars = async () => {
    try {
      const response = await api.get('/cars?limit=6&sortBy=most-viewed');
      setFeaturedCars(response.data.cars);
    } catch (error) {
      console.error('Failed to fetch featured cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentlyViewed = () => {
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentlyViewed(viewed.slice(0, 4));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const stats = [
    { icon: Car, value: '10,000+', label: 'Cars Listed' },
    { icon: Shield, value: '500+', label: 'Verified Sellers' },
    { icon: MessageCircle, value: '50,000+', label: 'Chats Initiated' },
    { icon: Star, value: '4.8', label: 'User Rating' },
  ];

  const features = [
    {
      icon: Search,
      title: 'Easy Search',
      description: 'Find your perfect car with advanced filters and search options'
    },
    {
      icon: MessageCircle,
      title: 'Direct Chat',
      description: 'Connect with sellers in real-time through our messaging system'
    },
    {
      icon: Shield,
      title: 'Verified Sellers',
      description: 'All sellers are verified for your peace of mind'
    },
    {
      icon: TrendingUp,
      title: 'Compare Cars',
      description: 'Compare up to 3 cars side by side to make the best choice'
    }
  ];

  return (
    <div className="min-h-screen bg-dark">
      {/* Cinematic Hero Slider */}
      <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          loop={true}
          navigation={{
            nextEl: '.swiper-button-next-hero',
            prevEl: '.swiper-button-prev-hero',
          }}
          pagination={{ clickable: true }}
          className="h-full w-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full w-full">
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/40 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-black/20 z-10"></div>
                
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="h-full w-full object-cover scale-105 animate-slow-zoom"
                />

                <div className="absolute inset-0 z-20 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-2 mb-6">
                        <span className="h-1 w-12 bg-primary rounded-full"></span>
                        <span className="text-primary font-black uppercase tracking-[.3em] text-[10px] md:text-xs">
                          {slide.tag}
                        </span>
                      </div>
                      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tighter mb-6">
                        {slide.title} <br />
                        <span className="text-orange-gradient font-black">{slide.highlight}</span>
                      </h1>
                      <p className="text-lg md:text-xl text-slate-300 font-medium max-w-lg mb-10 leading-relaxed">
                        {slide.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Global Search Interface (Floating) */}
        <div className="absolute bottom-12 left-0 right-0 z-30 px-4 md:px-0">
          <div className="max-w-5xl mx-auto">
            <div className="glass p-2 md:p-3 rounded-2xl md:rounded-[2rem] border-white/10 shadow-2xl">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-2">
                <div className="relative flex-grow w-full">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by brand, performance, or keyword..."
                    className="w-full bg-slate-900/50 border-none rounded-xl md:rounded-2xl py-4 md:py-6 pl-14 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                  />
                </div>
                <div className="hidden lg:flex items-center gap-4 px-6 border-x border-white/5">
                  <MapPin className="text-primary w-5 h-5 shrink-0" />
                  <select className="bg-transparent text-white font-bold border-none focus:ring-0 cursor-pointer text-sm">
                    <option className="bg-dark">All Nigeria</option>
                    <option className="bg-dark">Lagos</option>
                    <option className="bg-dark">Abuja</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto bg-primary hover:bg-primary-600 text-white px-10 py-4 md:py-6 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-sm transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 z-30 hidden lg:block">
           <button className="swiper-button-prev-hero w-12 h-12 bg-white/5 hover:bg-primary/20 text-white rounded-xl flex items-center justify-center transition-all border border-white/5">
              <ChevronRight size={24} className="rotate-180" />
           </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 z-30 hidden lg:block">
           <button className="swiper-button-next-hero w-12 h-12 bg-white/5 hover:bg-primary/20 text-white rounded-xl flex items-center justify-center transition-all border border-white/5">
              <ChevronRight size={24} />
           </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-dark-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Featured Cars</h2>
              <p className="text-gray-400 mt-1">Most popular listings this week</p>
            </div>
            <Link
              to="/browse"
              className="flex items-center space-x-2 text-primary hover:text-primary-400 transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              featuredCars.map(car => <CarCard key={car._id} car={car} />)
            )}
          </div>
        </div>
      </section>

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <section className="py-16 bg-dark-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Recently Viewed</h2>
                <p className="text-gray-400 mt-1">Cars you've checked out recently</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed.map(car => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Why Choose AtlasAutos?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We provide the best platform for buying and selling cars in Nigeria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-dark-50 rounded-xl p-6 border border-dark-100 hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl p-8 md:p-12 border border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Sell Your Car?
                </h2>
                <p className="text-gray-400 max-w-lg">
                  Join thousands of sellers on AtlasAutos. List your car for free and reach thousands of potential buyers.
                </p>
              </div>
              <Link
                to="/register"
                className="bg-primary hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors whitespace-nowrap"
              >
                Start Selling Today
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Brand */}
      <section className="py-16 border-t border-dark-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            Browse by Brand
          </h2>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4">
            {CAR_BRANDS.slice(0, 9).map(brand => (
              <Link
                key={brand}
                to={`/browse?brand=${brand}`}
                className="bg-dark-50 hover:bg-dark-100 border border-dark-100 rounded-lg p-4 text-center transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-primary transition-colors font-medium">
                  {brand}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

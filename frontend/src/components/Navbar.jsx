import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ShoppingCart, User, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="glass-dark border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="text-3xl font-black gradient-text flex items-center gap-2"
            >
              <span className="text-4xl">🛍️</span>
              <span>ShopHub</span>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-all duration-200 font-medium hover:scale-105 transform"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-300 hover:text-white transition-all duration-200 font-medium hover:scale-105 transform"
            >
              Products
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/orders"
                  className="text-gray-300 hover:text-white transition-all duration-200 font-medium hover:scale-105 transform"
                >
                  Orders
                </Link>
                <Link
                  to="/wishlist"
                  className="text-gray-300 hover:text-white transition-all duration-200 font-medium hover:scale-105 transform"
                >
                  Wishlist
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="text-yellow-400" size={20} />
              ) : (
                <Moon className="text-indigo-600" size={20} />
              )}
            </motion.button>

            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="sm" className="relative">
                      <ShoppingCart className="mr-2" size={20} />
                      Cart
                      {itemCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 bg-gradient-primary text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-glow"
                        >
                          {itemCount}
                        </motion.span>
                      )}
                    </Button>
                  </motion.div>
                </Link>

                {user?.role === 'CUSTOMER' && (
                  <Link to="/dashboard">
                    <Button variant="secondary" size="sm" className="gap-2">
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Button>
                  </Link>
                )}

                {user?.role === 'VENDOR' && (
                  <Link to="/vendor">
                    <Button variant="secondary" size="sm" className="gap-2">
                      <LayoutDashboard size={16} />
                      Vendor
                    </Button>
                  </Link>
                )}

                {user?.role === 'ADMIN' && (
                  <Link to="/admin">
                    <Button variant="secondary" size="sm" className="gap-2">
                      <LayoutDashboard size={16} />
                      Admin
                    </Button>
                  </Link>
                )}

                <div className="flex items-center gap-3 px-4 py-2 glass rounded-lg">
                  <User size={18} className="text-primary-400" />
                  <span className="text-white font-medium">{user?.name}</span>
                  <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
                    <LogOut size={16} />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="gradient-primary" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

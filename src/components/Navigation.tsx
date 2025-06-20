import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Search, Users, LogIn, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SignInDialog } from './auth/SignIn';
import { ReportItem } from './ReportItem';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Check auth status on mount and token changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsSignedIn(!!token);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsSignedIn(false);
    window.location.href = '/';
  };

  const getActiveTab = () => {
    if (location.pathname === '/') return 'HOME';
    if (location.pathname === '/catalog') return 'CATALOG';
    if (location.pathname === '/about') return 'ABOUT US';
    return 'HOME';
  };

  const activeTab = getActiveTab();

  const navItems = [
    { id: 'HOME', label: 'HOME', icon: Home, path: '/' },
    { id: 'CATALOG', label: 'CATALOG', icon: Search, path: '/catalog' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <motion.div 
              className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              UniFind
            </motion.div>
          </Link>

          {/* Centered Navigation Links */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <Link key={item.id} to={item.path}>
                  <motion.div
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex-shrink-0 flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => setIsReportOpen(true)}
                  >
                    Report Item
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    className="border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white px-6 py-3 rounded-full transition-all duration-300"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </motion.div>
              </>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  className="border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white px-6 py-3 rounded-full transition-all duration-300"
                  onClick={() => setIsSignInOpen(true)}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <SignInDialog open={isSignInOpen} onOpenChange={setIsSignInOpen} />
      <ReportItem open={isReportOpen} onOpenChange={setIsReportOpen} />
    </nav>
  );
};

export default Navigation;

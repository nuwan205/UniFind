import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, Users, LogIn, LogOut, Menu, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/80 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <motion.div 
                className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                UniFind
              </motion.div>
            </Link>

            {/* Desktop Navigation Links - hidden on mobile */}
            <div className="hidden md:flex items-center justify-center flex-1">
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

            {/* Desktop Action Buttons - hidden on mobile */}
            <div className="hidden md:flex items-center space-x-4">
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

            {/* Mobile menu button - only visible on mobile */}
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-purple-100/50 hover:bg-purple-100"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6 text-purple-600" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Add this spacer div to prevent content from hiding under the navbar */}
      <div className="h-16 md:h-20"></div>

      {/* Mobile Off-Canvas Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeMobileMenu}
            />
            
            {/* Slide-in Menu */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 max-w-[85%] w-80 z-50 md:hidden"
            >
              <div className="relative h-full bg-gradient-to-br from-white to-purple-50 p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
                    Menu
                  </h2>
                  <Button 
                    onClick={closeMobileMenu} 
                    variant="ghost" 
                    size="icon"
                    className="rounded-full bg-white/80 hover:bg-white"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </Button>
                </div>
                
                <div className="space-y-4 mb-8">
                  {navItems.map((item) => (
                    <Link 
                      key={item.id} 
                      to={item.path}
                      onClick={closeMobileMenu}
                    >
                      <motion.div
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                          activeTab === item.id
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                            : 'bg-white/50 text-gray-700 hover:bg-white'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium text-lg">{item.label}</span>
                      </motion.div>
                    </Link>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  {isSignedIn ? (
                    <>
                      <Button 
                        className="w-full bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                        onClick={() => {
                          setIsReportOpen(true);
                          closeMobileMenu();
                        }}
                      >
                        Report Lost Item
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white py-3 rounded-xl transition-all duration-300"
                        onClick={() => {
                          handleSignOut();
                          closeMobileMenu();
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white py-3 rounded-xl transition-all duration-300"
                      onClick={() => {
                        setIsSignInOpen(true);
                        closeMobileMenu();
                      }}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modals */}
      <SignInDialog open={isSignInOpen} onOpenChange={setIsSignInOpen} />
      <ReportItem open={isReportOpen} onOpenChange={setIsReportOpen} />
    </>
  );
};

export default Navigation;

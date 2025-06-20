import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, MapPin, Calendar, Shield, CheckCircle, ArrowRight, Users, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import FloatingObjects from '@/components/FloatingObjects';
import Navigation from '@/components/Navigation';
import { Link, useNavigate } from 'react-router-dom';
import { ReportItem } from '@/components/ReportItem'; // Import the ReportItem component
import { ItemService } from '@/services/item.service';
import { useToast } from '@/hooks/use-toast';
import { ItemDetailsDialog } from '@/components/ItemDetailsDialog';
import   { API_URL }  from '@/../config/env.config';

const categories = ['All', 'ID Cards', 'Electronics', 'Books', 'Clothing', 'Keys', 'Other'];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState<Array<{
    id: number;
    title: string;
    category: string;
    description?: string;
    images: Array<{ imagePath: string }>;
    item_type: number;
    date: string;
    time: string;
    location: string;
    addedBy: {
      id: number;
      name: string;
    };
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [currentStory, setCurrentStory] = useState(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); // Add isReportModalOpen state
  const [displayCount, setDisplayCount] = useState(4);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const itemService = new ItemService();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const filters = {
        keywords: searchTerm || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => 
        filters[key] === undefined && delete filters[key]
      );

      const response = await itemService.searchItems(filters);
      setItems(response || []); // Ensure items is always an array
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setItems([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect to trigger search when filters change
  useEffect(() => {
    const debounce = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm, selectedCategory]);

  // Add this useEffect to check auth status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const successStories = [
    {
      name: "Emma Wilson",
      item: "Lost wallet",
      story: "Thanks to this platform, I got my wallet back within 24 hours! The person who found it was so kind.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c0763fb3?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Jake Martinez",
      item: "Car keys",
      story: "I thought I'd never see my car keys again, but someone posted them here the same day I lost them!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Sophie Chen",
      item: "Textbook",
      story: "Found my expensive textbook thanks to this amazing community. Students helping students!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % successStories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Report submitted successfully!",
      description: "We'll notify you if someone finds your item.",
    });
    setIsModalOpen(false);
  };

  const handleReportClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to report a lost item",
        variant: "destructive",
      });
      // Optional: Trigger sign in dialog or redirect
      return;
    }
    setIsReportModalOpen(true);
  };

  const handleContactClick = (itemId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to view item details and contact information.",
      });
      return;
    }
    setSelectedItemId(itemId);
  };

  return (
    <>
    <Navigation/>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <FloatingObjects />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-lg bg-white/30 rounded-3xl p-8 border border-white/30 shadow-2xl"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-7 pb-2 bg-gradient-to-r from-teal-700 via-purple-700 to-teal-700 bg-clip-text text-transparent drop-shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Lost Something?
            </motion.h1>
            <motion.h2 
              className="text-3xl md:text-4xl font-semibold mb-8 text-gray-800 drop-shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Let's Find It Together.
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-800 font-medium mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Connect with your university community to reunite lost items with their owners. 
              Fast, secure, and completely free for students.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Search Lost Items
                <Search className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white px-8 py-4 rounded-full text-lg font-semibold backdrop-blur-sm bg-white/20 transform hover:scale-105 transition-all duration-200"
                onClick={handleReportClick}
              >
                Report Item
                <Plus className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search-section" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-sm bg-white/30 rounded-2xl p-8 border border-white/30 shadow-xl mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for lost items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-6 text-lg rounded-full border-0 bg-white/50 backdrop-blur-sm"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 py-6 rounded-full border-0 bg-white/50 backdrop-blur-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Items Grid */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <motion.div 
                    className="col-span-full flex justify-center items-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
                  </motion.div>
                ) : (
                  items.slice(0, displayCount).map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group"
                    >
                      <Card className="overflow-hidden backdrop-blur-sm bg-white/40 border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <div className="relative aspect-video">
                          {item.images[0] && (
                            <img 
                              src={`${API_URL}/uploads/items/${item.images[0].imagePath}`}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                          <Badge 
                            className={`absolute top-3 right-3 ${
                              item.item_type === 0
                                ? 'bg-red-500 hover:bg-red-600' 
                                : 'bg-green-500 hover:bg-green-600'
                            } text-white`}
                          >
                            {item.item_type === 0 ? 'Lost' : 'Found'}
                          </Badge>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-xl text-gray-800">{item.title}</h3>
                            <Badge variant="outline">{item.category}</Badge>
                          </div>
                          <p className="text-gray-600 mb-4 line-clamp-2">{item.descs}</p>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-500">
                              <User className="h-4 w-4 mr-2 text-purple-500" />
                              {item.addedBy?.name}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-2 text-teal-500" />
                              {item.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                              {new Date(item.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-2 text-orange-500" />
                              {item.time}
                            </div>
                          </div>
                          <Button 
                            className="w-full mt-4 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white rounded-full"
                            onClick={() => handleContactClick(item.id)}
                          >
                            Contact Owner
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* View More Button */}
            {!loading && items.length > displayCount && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-8"
              >
                <Link to="/catalog">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white px-8 py-4 rounded-full text-lg font-semibold backdrop-blur-sm bg-white/20 transform hover:scale-105 transition-all duration-200"
                  >
                    View More Items
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="backdrop-blur-md bg-white/60 rounded-3xl p-8 text-center border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Search className="h-16 w-16 text-purple-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Smart Search</h3>
              <p className="text-gray-600 leading-relaxed">Advanced filtering by category, location, date, and visual characteristics to find your items quickly.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="backdrop-blur-md bg-white/60 rounded-3xl p-8 text-center border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Shield className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Secure Platform</h3>
              <p className="text-gray-600 leading-relaxed">University-verified system ensuring safe exchanges between students with verified identities.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="backdrop-blur-md bg-white/60 rounded-3xl p-8 text-center border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Users className="h-16 w-16 text-teal-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Community Driven</h3>
              <p className="text-gray-600 leading-relaxed">Built by students, for students. Help your campus community thrive and recover lost items together.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-4 bg-gradient-to-r from-teal-100/50 to-purple-100/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-4xl font-bold mb-12 bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Success Stories
          </motion.h2>
          
          <motion.div
            key={currentStory}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-sm bg-white/40 rounded-2xl p-8 border border-white/30 shadow-xl"
          >
            <div className="flex items-center justify-center mb-6">
              <img 
                src={successStories[currentStory].avatar} 
                alt={successStories[currentStory].name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{successStories[currentStory].name}</h3>
                <p className="text-teal-600 font-medium">Recovered: {successStories[currentStory].item}</p>
              </div>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed italic">
              "{successStories[currentStory].story}"
            </p>
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mt-4" />
          </motion.div>
          
          <div className="flex justify-center mt-6 space-x-2">
            {successStories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStory(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStory ? 'bg-teal-500' : 'bg-gray-300'
                }`}
                aria-label={`Show success story ${index + 1}`}
                title={`Show success story ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                UniFind
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Connecting our university community through lost and found items.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-purple-300">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Help & Support</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-blue-300">Campus Info</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Student Services Center</li>
                <li>📍 Building A, Room 101</li>
                <li>📞 (555) 123-4567</li>
                <li>✉️ support@unifind.edu</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-teal-300">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors">
                  📘
                </a>
                <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                  🐦
                </a>
                <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors">
                  📷
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 UniFind. All rights reserved. Made with ❤️ for our university community.</p>
          </div>
        </div>
      </footer>

      {/* Report Item Modal - Always keep this at the end of your component */}
      <ReportItem 
        open={isReportModalOpen} 
        onOpenChange={setIsReportModalOpen}
      />
      <ItemDetailsDialog
        itemId={selectedItemId!}
        open={!!selectedItemId}
        onOpenChange={(open) => !open && setSelectedItemId(null)}
      />
    </div>
    </>
    )
};

export default Index;

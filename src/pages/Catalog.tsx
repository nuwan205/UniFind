import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ItemService, Item } from '@/services/item.service';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ArrowRight, User, Clock } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import   { API_URL }  from '@/../config/env.config';

import Navigation from '@/components/Navigation';
import FilterSidebar from '@/components/FilterSidebar';
import { ItemDetailsDialog } from '@/components/ItemDetailsDialog';

const Catalog = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const itemService = new ItemService();
  const { toast } = useToast();

  const handleFilterChange = async (filters) => {
    setLoading(true);
    try {
      const items = await itemService.searchItems(filters);
      setItems(items);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFilterChange({});
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cream-50">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold pb-3 mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Lost & Found Catalog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse through lost and found items using our smart filtering system
            </p>
          </motion.div>

          <div className="flex gap-8">
            <FilterSidebar onFilterChange={handleFilterChange} />
            
            <div className="flex-1">
              {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="group"
                      >
                        <Card className="overflow-hidden backdrop-blur-sm bg-white/40 border-white/30 shadow-md hover:shadow-xl transition-all duration-300">
                          <div className="relative aspect-video">
                            {item.images[0] ? (
                              <img 
                                src={`${API_URL}/uploads/items/${item.images[0].imagePath}`}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <svg 
                                  className="w-12 h-12 text-gray-400"
                                  xmlns="http://www.w3.org/2000/svg" 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={1.5} 
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                                  />
                                </svg>
                              </div>
                            )}
                            <Badge 
                              className={`absolute top-2 right-2 ${
                                item.item_type === 0
                                  ? 'bg-red-500 hover:bg-red-600' 
                                  : 'bg-green-500 hover:bg-green-600'
                              } text-white text-xs px-2 py-1`}
                            >
                              {item.item_type === 0 ? 'Lost' : 'Found'}
                            </Badge>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-base text-gray-800 truncate">{item.title}</h3>
                              <Badge variant="outline" className="text-xs">{item.category}</Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-1">{item.descs}</p>
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center text-gray-500">
                                <User className="h-3 w-3 mr-1 text-purple-500" />
                                <span className="truncate">{item.addedBy?.name}</span>
                              </div>
                              <div className="flex items-center text-gray-500">
                                <MapPin className="h-3 w-3 mr-1 text-teal-500" />
                                <span className="truncate">{item.location}</span>
                              </div>
                              <div className="flex items-center text-gray-500">
                                <Calendar className="h-3 w-3 mr-1 text-blue-500" />
                                <span>{new Date(item.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <Button 
                              className="w-full mt-3 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white rounded-full text-xs py-1"
                              onClick={() => handleContactClick(item.id)}
                            >
                              Contact
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ItemDetailsDialog
        itemId={selectedItemId!}
        open={!!selectedItemId}
        onOpenChange={(open) => !open && setSelectedItemId(null)}
      />
    </div>
  );
};

export default Catalog;

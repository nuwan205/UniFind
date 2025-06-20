
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import ItemCard from './ItemCard';

const lostItems = [
  {
    id: 1,
    title: "Blue iPhone 14",
    description: "Lost my blue iPhone 14 near the library entrance. Has a clear case with stickers.",
    category: "Electronics",
    location: "Main Library",
    date: "2 hours ago",
    image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&h=300&fit=crop",
    status: "lost" as const
  },
  {
    id: 2,
    title: "Student ID Card",
    description: "Found a student ID card for Sarah Johnson in the cafeteria.",
    category: "ID Cards",
    location: "Student Cafeteria",
    date: "1 day ago",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
    status: "found" as const
  },
  {
    id: 3,
    title: "MacBook Pro 13\"",
    description: "Silver MacBook Pro with university stickers. Last seen in Study Room B.",
    category: "Electronics",
    location: "Study Room B",
    date: "3 days ago",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
    status: "lost" as const
  },
  {
    id: 4,
    title: "Black Leather Backpack",
    description: "Black leather backpack with laptop compartment. Contains important documents.",
    category: "Bags",
    location: "Engineering Building",
    date: "5 days ago",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    status: "lost" as const
  },
  {
    id: 5,
    title: "Red Winter Jacket",
    description: "Warm red winter jacket left in the gymnasium after workout session.",
    category: "Clothing",
    location: "University Gym",
    date: "1 week ago",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
    status: "found" as const
  },
  {
    id: 6,
    title: "Calculus Textbook",
    description: "Heavy calculus textbook with notes inside. Name written on cover.",
    category: "Books",
    location: "Mathematics Building",
    date: "4 days ago",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    status: "lost" as const
  }
];

const ItemsGrid = () => {
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost');
  const [sortBy, setSortBy] = useState('newest');

  const filteredItems = lostItems.filter(item => item.status === activeTab);

  return (
    <div className="space-y-6">
      {/* Tabs and Sort */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 backdrop-blur-md bg-white/40 rounded-2xl p-1 border border-white/30">
          {['lost', 'found'].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab as 'lost' | 'found')}
              className={cn(
                "px-6 py-3 rounded-xl font-medium transition-all duration-300 capitalize",
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-white/50'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab} Items
            </motion.button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 backdrop-blur-sm bg-white/50 border-white/30 rounded-xl">
              <SelectValue />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="location">By Location</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Items Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredItems.map((item, index) => (
            <ItemCard
              key={item.id}
              {...item}
              index={index}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-gray-500 text-lg">No {activeTab} items found</div>
          <div className="text-gray-400 text-sm mt-2">Try adjusting your filters</div>
        </motion.div>
      )}
    </div>
  );
};

export default ItemsGrid;

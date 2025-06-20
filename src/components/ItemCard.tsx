import { motion } from 'framer-motion';
import { MapPin, Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ItemCardProps {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  image: string;
  status: 'lost' | 'found';
  index: number;
}

const ItemCard = ({ title, description, category, location, date, image, status, index }: ItemCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <Card className="overflow-hidden backdrop-blur-md bg-white/60 border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
        <div className="relative">
          <motion.img 
            src={image} 
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            whileHover={{ scale: 1.05 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Badge 
            className={cn(
              "absolute top-3 right-3 text-white font-medium px-3 py-1 rounded-full",
              status === 'lost' 
                ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-lg' 
                : 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg'
            )}
          >
            {status === 'lost' ? 'Lost' : 'Found'}
          </Badge>
        </div>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-xl mb-2 text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                {title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                {description}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                <span>{location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                <span>{date}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <User className="h-4 w-4 mr-2 text-green-500" />
                <span>Reported by Student</span>
              </div>
            </div>
            
            <div className="pt-2">
              <Badge variant="outline" className="text-xs px-2 py-1 bg-purple-50 text-purple-600 border-purple-200">
                {category}
              </Badge>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                <span>Contact Owner</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ItemCard;

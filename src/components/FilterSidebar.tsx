import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Tag, Search, X, AlertCircle, BookCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const itemTypes = ['Clothing', 'Electronics', 'ID Cards', 'Books', 'Keys', 'Bags', 'Other'];
const venues = ['Library', 'Student Center', 'Cafeteria', 'Gym', 'Classroom Building', 'Dormitory', 'Parking Lot'];
const colors = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Yellow', value: '#f59e0b' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#ffffff' },
  { name: 'Gray', value: '#6b7280' },
  { name: 'Brown', value: '#92400e' },
];

// Update the FilterSidebarProps interface
interface FilterSidebarProps {
  onFilterChange: (filters: {
    date?: string;
    location?: string;
    category?: string;
    color?: string;
    keywords?: string;
    item_type?: number;  // Add this line
  }) => void;
}

const FilterSidebar = ({ onFilterChange }: FilterSidebarProps) => {
  const [date, setDate] = useState<Date>();
  const [selectedVenue, setSelectedVenue] = useState('');
  const [selectedItemType, setSelectedItemType] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [itemStatus, setItemStatus] = useState<'lost' | 'found' | null>(null);

  const handleColorSelect = (colorName: string) => {
    const newColors = selectedColors.includes(colorName)
      ? selectedColors.filter(c => c !== colorName)
      : [...selectedColors, colorName];
    setSelectedColors(newColors);
    
    // Update active filters
    const colorFilters = activeFilters.filter(f => !colors.some(c => c.name === f));
    setActiveFilters([...colorFilters, ...newColors]);
  };

  const clearAllFilters = () => {
    setDate(undefined);
    setSelectedVenue('');
    setSelectedItemType('');
    setSelectedColors([]);
    setSearchKeyword('');
    setItemStatus(null);
    setActiveFilters([]);
  };

  const removeFilter = (filterToRemove: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filterToRemove));
    
    // Remove from specific filter states
    if (colors.some(c => c.name === filterToRemove)) {
      setSelectedColors(selectedColors.filter(c => c !== filterToRemove));
    }
    if (filterToRemove === selectedVenue) setSelectedVenue('');
    if (filterToRemove === selectedItemType) setSelectedItemType('');
  };

  // Update the useEffect hook that handles filter changes
  useEffect(() => {
    const filters = {
      date: date ? format(date, 'yyyy-MM-dd') : undefined,
      location: selectedVenue || undefined,
      category: selectedItemType || undefined,
      color: selectedColors.length > 0 ? selectedColors[0] : undefined,
      keywords: searchKeyword || undefined,
      item_type: itemStatus === 'found' ? 1 : itemStatus === 'lost' ? 0 : undefined
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );

    onFilterChange(filters);
  }, [date, selectedVenue, selectedItemType, selectedColors, searchKeyword, itemStatus]);

  return (
    <div className="h-fit backdrop-blur-md bg-white/60 rounded-3xl border border-white/30 md:shadow-xl p-4 md:p-6 w-full md:sticky md:top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 bg-clip-text text-transparent">
          Smart Filters
        </h3>
        {(activeFilters.length > 0 || itemStatus) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700 bg-white/50 rounded-full"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Quick Filter Buttons */}
      <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
        <Button
          variant={itemStatus === 'lost' ? 'default' : 'outline'}
          className={cn(
            "w-full rounded-full text-xs md:text-sm py-1 md:py-2",
            itemStatus === 'lost' 
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "hover:bg-red-50 text-red-500 border-red-200"
          )}
          onClick={() => setItemStatus(prev => prev === 'lost' ? null : 'lost')}
        >
          <AlertCircle className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
          <span className="truncate">Lost</span>
        </Button>
        <Button
          variant={itemStatus === 'found' ? 'default' : 'outline'}
          className={cn(
            "w-full rounded-full text-xs md:text-sm py-1 md:py-2",
            itemStatus === 'found'
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "hover:bg-green-50 text-green-500 border-green-200"
          )}
          onClick={() => setItemStatus(prev => prev === 'found' ? null : 'found')}
        >
          <BookCheck className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
          <span className="truncate">Found</span>
        </Button>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="mb-4 md:mb-6">
          <div className="flex flex-wrap gap-1 md:gap-2">
            {activeFilters.map((filter) => (
              <Badge
                key={filter}
                variant="secondary"
                className="flex items-center gap-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 hover:from-purple-200 hover:to-blue-200 border-purple-200 rounded-full text-xs"
              >
                {filter}
                <X
                  className="h-2 w-2 md:h-3 md:w-3 cursor-pointer"
                  onClick={() => removeFilter(filter)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 md:space-y-6">
        {/* Date Picker */}
        <div className="space-y-2 md:space-y-3">
          <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-gray-700">
            <Calendar className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />
            Date Range
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left text-xs md:text-sm font-normal backdrop-blur-sm bg-white/70 border-white/40 rounded-xl md:rounded-2xl hover:bg-white/80 py-1 md:py-2",
                  !date && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Venue/Location */}
        <div className="space-y-2 md:space-y-3">
          <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-gray-700">
            <MapPin className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
            Campus Location
          </label>
          <Select value={selectedVenue} onValueChange={setSelectedVenue}>
            <SelectTrigger className="backdrop-blur-sm bg-white/70 border-white/40 rounded-xl md:rounded-2xl hover:bg-white/80 h-8 md:h-10 text-xs md:text-sm">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {venues.map((venue) => (
                <SelectItem key={venue} value={venue}>{venue}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Item Type */}
        <div className="space-y-2 md:space-y-3">
          <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-gray-700">
            <Tag className="h-4 w-4 md:h-5 md:w-5 text-teal-500" />
            Item Category
          </label>
          <Select value={selectedItemType} onValueChange={setSelectedItemType}>
            <SelectTrigger className="backdrop-blur-sm bg-white/70 border-white/40 rounded-xl md:rounded-2xl hover:bg-white/80 h-8 md:h-10 text-xs md:text-sm">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {itemTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color Filter */}
        <div className="space-y-2 md:space-y-3">
          <label className="text-xs md:text-sm font-semibold text-gray-700">Item Colors</label>
          <div className="grid grid-cols-5 gap-2 md:gap-3">
            {colors.map((color) => (
              <motion.button
                key={color.name}
                onClick={() => handleColorSelect(color.name)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-all duration-200",
                  selectedColors.includes(color.name)
                    ? "border-purple-500 ring-2 ring-purple-200"
                    : "border-gray-300 hover:border-purple-300"
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Keyword Search */}
        <div className="space-y-2 md:space-y-3">
          <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-gray-700">
            <Search className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
            Search Keywords
          </label>
          <Input
            placeholder="Describe your item..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="backdrop-blur-sm bg-white/70 border-white/40 rounded-xl md:rounded-2xl hover:bg-white/80 focus:bg-white/90 h-8 md:h-10 text-xs md:text-sm px-3"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;

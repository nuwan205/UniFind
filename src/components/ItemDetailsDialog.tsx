import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ItemService } from '@/services/item.service';
import { MapPin, Calendar, Phone, User, Clock, Building, Mail } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { API_URL } from '@/../config/env.config';

interface ItemDetailsDialogProps {
  itemId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemDetailsDialog({ itemId, open, onOpenChange }: ItemDetailsDialogProps) {
  const [itemDetails, setItemDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [emblaRef] = useEmblaCarousel();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Create ItemService instance only once using useMemo
  const itemService = useMemo(() => new ItemService(), []);
  const { toast } = useToast();
  
  // Use ref to track if we've already fetched for this itemId
  const fetchedItemId = useRef<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Simplified fetch function without dependencies that change
  const fetchItemDetails = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const response = await itemService.getItemById(id);
      console.log('Full response:', response); // Debug log
      
      if (response.status && response.data) {
        setItemDetails(response.data);
        console.log('Item details set:', response.data); // Debug log
      } else {
        throw new Error(response.message || 'Failed to fetch item details');
      }
    } catch (error) {
      console.error('Failed to fetch item details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load item details. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [itemService, toast]);

  useEffect(() => {
    // Check authentication
    if (open && !isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to view item details and contact information.",
      });
      onOpenChange(false);
      return;
    }

    // Fetch item details only if conditions are met and we haven't already fetched this item
    if (open && isAuthenticated && itemId && fetchedItemId.current !== itemId) {
      fetchedItemId.current = itemId;
      fetchItemDetails(itemId);
    }

    // Reset when dialog closes
    if (!open) {
      setItemDetails(null);
      setLoading(true);
      fetchedItemId.current = null;
    }
  }, [open, isAuthenticated, itemId, fetchItemDetails, onOpenChange, toast]);

  // Retry function for manual retry
  const handleRetry = useCallback(() => {
    if (itemId) {
      fetchedItemId.current = null; // Reset the ref to allow refetch
      fetchItemDetails(itemId);
    }
  }, [itemId, fetchItemDetails]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg border-white/20">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
          </div>
        ) : itemDetails ? (
          <div className="space-y-6">
            {/* Image Carousel */}
            <div className="overflow-hidden rounded-xl" ref={emblaRef}>
              <div className="flex">
                {itemDetails?.images && itemDetails.images.length > 0 ? (
                  itemDetails.images.map((image: any, index: number) => (
                    <div key={image.id} className="relative flex-[0_0_100%]">
                      <img
                        src={`${API_URL}/uploads/items/${image.imagePath}`}
                        alt={`${itemDetails.title} - ${index + 1}`}
                        className="w-full aspect-video object-cover"
                        onError={(e) => {
                          console.error('Image failed to load:', image.imagePath);
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex-[0_0_100%] bg-gray-200 aspect-video flex items-center justify-center">
                    <span className="text-gray-500">No images available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Header Section */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{itemDetails?.title}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    className={`${
                      itemDetails?.item_type === 0
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white`}
                  >
                    {itemDetails?.item_type === 0 ? 'Lost' : 'Found'}
                  </Badge>
                  <Badge variant="outline">{itemDetails?.category}</Badge>
                  <Badge variant="outline" className="bg-white/50">{itemDetails?.color}</Badge>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600">{itemDetails?.descs}</p>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2 text-teal-500" />
                  {itemDetails?.location}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  {itemDetails?.date ? new Date(itemDetails.date).toLocaleDateString() : 'N/A'}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2 text-orange-500" />
                  {itemDetails?.time || 'N/A'}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-2 text-purple-500" />
                  {itemDetails?.addedBy?.name || 'N/A'}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Building className="h-4 w-4 mr-2 text-indigo-500" />
                  {itemDetails?.addedBy?.faculty || 'N/A'}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="h-4 w-4 mr-2 text-green-500" />
                  {itemDetails?.conatct_info || 'N/A'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {itemDetails?.conatct_info && (
              <div className="flex gap-4 pt-4">
                <Button 
                  className="flex-1 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white rounded-full"
                  onClick={() => window.open(`tel:${itemDetails.conatct_info}`, '_self')}
                >
                  Call Now
                  <Phone className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white rounded-full"
                  onClick={() => window.open(`sms:${itemDetails.conatct_info}`, '_self')}
                >
                  Send SMS
                  <Mail className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center h-60">
            <div className="text-center">
              <p className="text-gray-600">Failed to load item details</p>
              <Button 
                onClick={handleRetry}
                className="mt-4"
                variant="outline"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Retry'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
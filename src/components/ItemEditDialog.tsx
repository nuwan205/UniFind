import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { X, Upload, Calendar, Palette, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { ItemService, Item, UpdateItemData } from '@/services/item.service';
import { AuthService } from '@/services/auth.service';
import { API_URL } from '@/../config/env.config';

interface ItemEditDialogProps {
  item: Item | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemUpdated: () => void;
  onImageDeleted?: () => void;
}

interface EditForm {
  type: string;
  category: string;
  title: string;
  description: string;
  location: string;
  contact: string;
  date: string;
  color: string;
  images: File[];
}

export const ItemEditDialog = ({ item, open, onOpenChange, onItemUpdated, onImageDeleted }: ItemEditDialogProps) => {
  const [formData, setFormData] = useState<EditForm>({
    type: '',
    category: '',
    title: '',
    description: '',
    location: '',
    contact: '',
    date: '',
    color: '',
    images: []
  });
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [deletingImages, setDeletingImages] = useState<Set<number>>(new Set());
  
  const itemService = new ItemService();
  const authService = new AuthService();
  const { toast } = useToast();

  const categories = [
    'Electronics', 'Clothing', 'Accessories', 'Documents', 'Keys', 
    'Bags', 'Jewelry', 'Books', 'Sports', 'Other'
  ];

  // Helper function to safely format date
  const formatDateForInput = (dateValue: any): string => {
    try {
      if (!dateValue) {
        return new Date().toISOString().split('T')[0]; // Default to today
      }

      let date: Date;
      
      // Handle different date formats
      if (typeof dateValue === 'string') {
        // Try parsing the string
        date = new Date(dateValue);
      } else if (typeof dateValue === 'number') {
        // Handle timestamp
        date = new Date(dateValue);
      } else if (dateValue instanceof Date) {
        date = dateValue;
      } else {
        // Fallback to current date
        console.warn('Unknown date format:', dateValue);
        date = new Date();
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date value:', dateValue);
        return new Date().toISOString().split('T')[0]; // Default to today
      }

      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error, 'Value:', dateValue);
      return new Date().toISOString().split('T')[0]; // Default to today
    }
  };

  useEffect(() => {
    if (item) {
      console.log('Setting form data for item:', item);
      console.log('Item date value:', item.date, 'Type:', typeof item.date);
      
      try {
        setFormData({
          type: item.item_type === 0 ? 'lost' : 'found',
          category: item.category || '',
          title: item.title || '',
          description: item.descs || '',
          location: item.location || '',
          contact: item.conatct_info || '',
          date: formatDateForInput(item.date),
          color: item.color || '',
          images: []
        });
        setExistingImages(item.images || []);
        setPreviewUrls([]);
        setDeletingImages(new Set());
      } catch (error) {
        console.error('Error setting form data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load item data. Some fields may be empty.",
        });
      }
    }
  }, [item]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = files.length + formData.images.length + existingImages.length;
    
    if (totalImages > 5) {
      toast({
        variant: "destructive",
        title: "Too many images",
        description: "You can upload maximum 5 images per item.",
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    // Create preview URLs for new images
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeNewImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    // Clean up preview URL
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleDeleteExistingImage = async (imageId: number) => {
    console.log('Deleting image directly:', imageId);
    
    setDeletingImages(prev => new Set(prev).add(imageId));
    
    try {
      await itemService.deleteItemImage(imageId);
      
      // Remove from existing images locally (immediate UI update)
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      
      toast({
        title: "Success",
        description: "Image deleted successfully",
        variant: "default",
      });

      // Call the onImageDeleted callback if provided
      if (onImageDeleted) {
        onImageDeleted();
      }
      
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete image",
      });
    } finally {
      setDeletingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    
    setLoading(true);
    try {
      // Prepare update data
      const updateData: UpdateItemData = {
        item_type: formData.type === 'lost' ? 0 : 1,
        category: formData.category,
        title: formData.title,
        descs: formData.description,
        location: formData.location,
        conatct_info: formData.contact,
        date: formData.date,
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        color: formData.color
      };

      // Update item data
      const result = await itemService.updateItem(item.id, updateData);
      
      if (result.success) {
        // Handle new image uploads
        if (formData.images.length > 0) {
          try {
            // Upload new images
            const imagePaths = await authService.uploadItemImages(formData.images);
            
            // Associate new images with the item
            await authService.addItemImages(item.id, imagePaths);
          } catch (imageError) {
            console.error('Failed to upload images:', imageError);
            toast({
              variant: "default",
              title: "Item Updated",
              description: "Item updated successfully, but some images failed to upload.",
            });
          }
        }

        // Clean up preview URLs
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setPreviewUrls([]);

        toast({
          title: "Success!",
          description: result.message || "Item updated successfully",
          variant: "default",
        });
        
        // Call the main update callback which will close the dialog
        onItemUpdated();
        
        // Force cleanup pointer events
        setTimeout(() => {
          document.body.style.pointerEvents = '';
          document.documentElement.style.pointerEvents = '';
        }, 100);
        
      } else {
        throw new Error('Update failed');
      }
      
    } catch (error) {
      console.error('Failed to update item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update item",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-none">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Edit Item: {item.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-2 pr-2 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Item Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="lost">Lost Item</SelectItem>
                    <SelectItem value="found">Found Item</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="date"
                    className="pl-10"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="relative">
                  <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="e.g., Blue, Red, etc."
                    className="pl-10"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label>Item Title *</Label>
              <Input
                placeholder="e.g., Blue iPhone 14"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                placeholder="Provide details about the item..."
                className="min-h-[100px]"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Location *</Label>
              <Input
                placeholder="Where was it lost/found?"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>

            {/* Images Section */}
            <div className="space-y-4">
              <Label>Images ({existingImages.length + formData.images.length}/5)</Label>
              
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div>
                  <Label className="text-sm text-gray-600">Current Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
                    {existingImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={`${API_URL}/uploads/items/${image.imagePath}`}
                          alt="Current"
                          className="w-full h-20 object-cover rounded-lg border"
                          onError={(e) => {
                            console.error('Failed to load image:', image.imagePath);
                            (e.target as HTMLImageElement).src = '/placeholder-image.png';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteExistingImage(image.id)}
                          disabled={deletingImages.has(image.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 hover:bg-red-600"
                          title="Delete image"
                        >
                          {deletingImages.has(image.id) ? (
                            <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* New Images */}
              {formData.images.length > 0 && (
                <div>
                  <Label className="text-sm text-gray-600">New Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`New ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          title="Remove image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Upload Button */}
              {(formData.images.length + existingImages.length) < 5 && (
                <div>
                  <input
                    type="file"
                    id="image-upload-edit"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Label htmlFor="image-upload-edit" className="cursor-pointer">
                    <Card className="border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload images</span>
                        <span className="text-xs text-gray-400 mt-1">
                          {5 - formData.images.length - existingImages.length} remaining
                        </span>
                      </CardContent>
                    </Card>
                  </Label>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              <Label>Contact Information</Label>
              <Input
                placeholder="Your email or phone number"
                value={formData.contact}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Item'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

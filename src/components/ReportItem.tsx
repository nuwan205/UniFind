import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthService } from '@/services/auth.service';
import { toast } from '@/components/ui/use-toast';

interface ReportItemProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ReportForm {
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

export const ReportItem = ({ open, onOpenChange }: ReportItemProps) => {
  const [formData, setFormData] = useState<ReportForm>({
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
  const [isControlled] = useState(open !== undefined && onOpenChange !== undefined);
  const [internalOpen, setInternalOpen] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  const categories = ['ID Cards', 'Electronics', 'Books', 'Clothing', 'Keys', 'Other'];

  const authService = new AuthService();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // First, create the item
      const requestData = {
        item_type: formData.type === 'lost' ? 0 : 1,
        category: formData.category,
        date: formData.date,
        color: formData.color,
        title: formData.title,
        descs: formData.description,
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        location: formData.location,
        conatct_info: formData.contact,
        status: 1
      };

      const itemResponse = await authService.createItem(requestData);
      const itemId = itemResponse.data?.id;

      // If there are images and item was created successfully
      if (formData.images.length > 0 && itemId) {
        // First upload the images
        const imagePaths = await authService.uploadItemImages(formData.images);
        
        // Then associate the images with the item
        await authService.addItemImages(itemId, imagePaths);
      }

      // Close dialog and reset form
      setIsOpen(false);
      
      // Reset form data
      setFormData({
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

      // Cleanup preview URLs
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);

      toast({
        title: "Success!",
        description: "Item reported and images uploaded successfully",
        variant: "default",
      });

    } catch (error) {
      console.error('Failed to create item or upload images:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to report item",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white px-8 py-4 rounded-full text-lg font-semibold backdrop-blur-sm bg-white/20 transform hover:scale-105 transition-all duration-200"
          >
            Report Item
            <Plus className="ml-2 h-5 w-5" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-none">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
            Report Lost or Found Item
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Item Type</Label>
                <Select
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lost">Lost Item</SelectItem>
                    <SelectItem value="found">Found Item</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
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
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Item Title</Label>
              <Input
                placeholder="e.g., Blue iPhone 14"
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Provide details about the item..."
                className="min-h-[100px]"
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="Where was it lost/found?"
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex items-center justify-center space-x-2 text-gray-600"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Images (Max 5)</span>
                </label>
              </div>
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Contact Information</Label>
              <Input
                placeholder="Your email or phone number"
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white"
            >
              Submit Report
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
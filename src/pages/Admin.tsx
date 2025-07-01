import { motion, AnimatePresence } from 'framer-motion';
import { ItemService, Item } from '@/services/item.service';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MapPin, Calendar, User, Clock, SlidersHorizontal, X, Edit, Trash2, Plus, Search, Filter, MoreHorizontal, Eye } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { API_URL } from '@/../config/env.config';
import Navigation from '@/components/Navigation';
import { ItemEditDialog } from '@/components/ItemEditDialog';
import { ReportItem } from '@/components/ReportItem';
import { useState, useEffect, useCallback, useMemo } from 'react';

const Admin = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const itemService = useMemo(() => new ItemService(), []);
  const { toast } = useToast();

  // Updated fetch function to use my-items API
  const fetchItems = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const fetchedItems = await itemService.getMyItems();
      setItems(fetchedItems);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch your items. Please try again.",
      });
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [itemService, toast]);

  useEffect(() => {
    fetchItems(true);
  }, [fetchItems]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descs.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' ||
        (filterType === 'lost' && item.item_type === 0) ||
        (filterType === 'found' && item.item_type === 1);
      return matchesSearch && matchesType;
    });
  }, [items, searchTerm, filterType]);

  const handleEdit = useCallback((item: Item) => {
    setSelectedItem(item);
    setEditDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!itemToDelete) return;
    setDeleteLoading(true);
    try {
      const result = await itemService.deleteItem(itemToDelete.id);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Item deleted successfully.",
          variant: "default",
        });
        setDeleteDialogOpen(false);
        setItemToDelete(null);
        await fetchItems(false); // Reload without showing loading overlay
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete item. Please try again.",
      });
    } finally {
      setDeleteLoading(false);
    }
  }, [itemToDelete, itemService, toast, fetchItems]);

  const handleItemUpdated = useCallback(async () => {
    setEditDialogOpen(false);
    setSelectedItem(null);
    await fetchItems(false); // Reload without showing loading overlay
  }, [fetchItems]);

  const handleImageDeleted = useCallback(async () => {
    await fetchItems(false); // Reload without showing loading overlay
  }, [fetchItems]);

  const handleItemCreated = useCallback(async () => {
    setCreateDialogOpen(false);
    // Reload the list after creating an item
    await fetchItems(false);
    toast({
      title: "Success",
      description: "Item created successfully and list has been updated.",
      variant: "default",
    });
  }, [fetchItems, toast]);

  const handleEditDialogClose = useCallback((open: boolean) => {
    setEditDialogOpen(open);
    if (!open) setSelectedItem(null);
  }, []);

  const handleCreateDialogClose = useCallback((open: boolean) => {
    setCreateDialogOpen(open);
  }, []);

  const stats = useMemo(() => ({
    total: items.length,
    lost: items.filter(item => item.item_type === 0).length,
    found: items.filter(item => item.item_type === 1).length,
    recent: items.filter(item => {
      const itemDate = new Date(item.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return itemDate > weekAgo;
    }).length
  }), [items]);

  // Loading overlay component
  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-xl flex items-center space-x-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
        <span className="text-gray-700 font-medium">Loading your items...</span>
      </div>
    </div>
  );

  useEffect(() => {
    // Clean up pointer-events when any dialog closes
    if (!editDialogOpen && !createDialogOpen && !deleteDialogOpen) {
      // Remove pointer-events: none from body and html
      document.body.style.pointerEvents = '';
      document.documentElement.style.pointerEvents = '';
      
      // Also remove any data attributes that might be causing issues
      document.body.removeAttribute('data-scroll-locked');
      document.body.style.overflow = '';
      
      console.log('Cleaned up pointer events after dialog close');
    }
  }, [editDialogOpen, createDialogOpen, deleteDialogOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      <Navigation />

      {loading && <LoadingOverlay />}

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  My Items
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage your lost and found items
                </p>
              </div>
              <Button 
                onClick={() => setCreateDialogOpen(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                disabled={loading}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Item
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white/70 backdrop-blur-sm border-white/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
                  <div className="text-sm text-gray-600">Your Items</div>
                </CardContent>
              </Card>
              <Card className="bg-white/70 backdrop-blur-sm border-white/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">{stats.lost}</div>
                  <div className="text-sm text-gray-600">Lost Items</div>
                </CardContent>
              </Card>
              <Card className="bg-white/70 backdrop-blur-sm border-white/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{stats.found}</div>
                  <div className="text-sm text-gray-600">Found Items</div>
                </CardContent>
              </Card>
              <Card className="bg-white/70 backdrop-blur-sm border-white/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">{stats.recent}</div>
                  <div className="text-sm text-gray-600">This Week</div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter Controls */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/50 mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search your items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>

                    {/* Type Filter Tabs */}
                    <Tabs value={filterType} onValueChange={(value) => setFilterType(value as 'all' | 'lost' | 'found')}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all" disabled={loading}>All</TabsTrigger>
                        <TabsTrigger value="lost" disabled={loading}>Lost</TabsTrigger>
                        <TabsTrigger value="found" disabled={loading}>Found</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={viewMode === 'table' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('table')}
                      disabled={loading}
                    >
                      Table
                    </Button>
                    <Button 
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      disabled={loading}
                    >
                      Grid
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Items Display */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
                <p className="text-gray-600">Loading your items...</p>
              </div>
            </div>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
              <CardContent className="p-6">
                {viewMode === 'table' ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredItems.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-gray-50/50"
                          >
                            <TableCell>
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                {item.images && item.images.length > 0 ? (
                                  <img 
                                    src={`${API_URL}/uploads/items/${item.images[0].imagePath}`}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Eye className="h-4 w-4 text-gray-400" />
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>
                              <Badge 
                                className={`${
                                  item.item_type === 0
                                    ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                                }`}
                              >
                                {item.item_type === 0 ? 'Lost' : 'Found'}
                              </Badge>
                            </TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell className="max-w-32 truncate">{item.location}</TableCell>
                            <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    className="h-8 w-8 p-0"
                                    disabled={loading}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white">
                                  <DropdownMenuItem onClick={() => handleEdit(item)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setItemToDelete(item);
                                      setDeleteDialogOpen(true);
                                    }}
                                    className="text-red-600 focus:text-red-700 focus:bg-red-50"
                                    disabled={deleteLoading && itemToDelete?.id === item.id}
                                  >
                                    {deleteLoading && itemToDelete?.id === item.id ? (
                                      <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2" />
                                        Deleting...
                                      </>
                                    ) : (
                                      <>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <AnimatePresence mode="popLayout">
                      {filteredItems.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="group"
                        >
                          <Card className="overflow-hidden backdrop-blur-sm bg-white/60 border-white/40 hover:shadow-lg transition-all duration-300">
                            <div className="relative aspect-video">
                              {item.images && item.images.length > 0 ? (
                                <img 
                                  src={`${API_URL}/uploads/items/${item.images[0].imagePath}`}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <Eye className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                              <Badge 
                                className={`absolute top-2 right-2 ${
                                  item.item_type === 0
                                    ? 'bg-red-500 hover:bg-red-600' 
                                    : 'bg-green-500 hover:bg-green-600'
                                } text-white text-xs`}
                              >
                                {item.item_type === 0 ? 'Lost' : 'Found'}
                              </Badge>
                            </div>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-sm text-gray-800 truncate">{item.title}</h3>
                                <Badge variant="outline" className="text-xs">{item.category}</Badge>
                              </div>
                              <p className="text-gray-600 text-xs mb-2 line-clamp-2">{item.descs}</p>
                              <div className="space-y-1 text-xs mb-3">
                                <div className="flex items-center text-gray-500">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span className="truncate">{item.location}</span>
                                </div>
                                <div className="flex items-center text-gray-500">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>{new Date(item.date).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="flex-1 text-xs"
                                  onClick={() => handleEdit(item)}
                                  disabled={loading}
                                >
                                  <Edit className="mr-1 h-3 w-3" />
                                  Edit
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => {
                                    setItemToDelete(item);
                                    setDeleteDialogOpen(true);
                                  }}
                                  disabled={loading}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {filteredItems.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Search className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No items found</h3>
                    <p className="text-gray-500">
                      {searchTerm || filterType !== 'all' 
                        ? "Try adjusting your search or filter criteria." 
                        : "You haven't added any items yet. Click 'Add New Item' to get started."
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <ItemEditDialog
        item={selectedItem}
        open={editDialogOpen}
        onOpenChange={handleEditDialogClose}
        onItemUpdated={handleItemUpdated}
        onImageDeleted={handleImageDeleted}
      />

      {/* Create Dialog */}
      <ReportItem
        open={createDialogOpen}
        onOpenChange={handleCreateDialogClose}
        onItemCreated={handleItemCreated}
      />

      {/* Enhanced Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Are you sure you want to delete this item?</p>
              {itemToDelete && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">"{itemToDelete.title}"</p>
                  <p className="text-sm text-gray-600">
                    {itemToDelete.item_type === 0 ? 'Lost' : 'Found'} • {itemToDelete.category}
                  </p>
                  <p className="text-sm text-gray-600">{itemToDelete.location}</p>
                </div>
              )}
              <p className="text-red-600 font-medium">
                This action cannot be undone. This will permanently delete the item and all its images.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleteLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Item
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;

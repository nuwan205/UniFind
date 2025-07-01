import axios from 'axios';

interface SearchFilters {
  date?: string;
  location?: string;
  category?: string;
  color?: string;
  keywords?: string;
}

export interface ItemImage {
  id: number;
  itemId: number;
  imagePath: string;
  status: number;
  addedBy: number;
}

export interface Item {
  created_at: string | number | Date;
  id: number;
  item_type: number;
  category: string;
  date: string;
  color: string;
  title: string;
  descs: string;
  time: string;
  location: string;
  conatct_info: string;
  status: number;
  userId: number;
  addedBy: {
    id: number;
    name: string;
  };
  added_time: string;
  images: ItemImage[];
}

// Update item data interface
export interface UpdateItemData {
  item_type?: number;
  category?: string;
  title?: string;
  descs?: string;
  location?: string;
  conatct_info?: string;
  date?: string;
  time?: string;
  color?: string;
  status?: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class ItemService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async searchItems(filters: SearchFilters): Promise<Item[]> {
    try {
      const response = await axios.get(`${API_URL}/items/search`, { 
        params: filters,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.status) {
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('Failed to fetch items:', error);
      return [];
    }
  }

  async getItemById(id: number) {
    try {
      const response = await axios.get(`${API_URL}/items/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch item details:', error);
      throw error;
    }
  }

  /**
   * Update an existing item
   * @param id - Item ID to update
   * @param updateData - Partial item data to update
   * @returns Promise with update result
   */
  async updateItem(id: number, updateData: UpdateItemData) {
    try {
      const response = await axios.put(
        `${API_URL}/items/update/${id}`,
        updateData,
        {
          headers: this.getAuthHeaders()
        }
      );

      if (response.data.status) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to update item');
      }
    } catch (error) {
      console.error('Failed to update item:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        const statusCode = error.response?.status;
        
        // Handle specific error cases
        switch (statusCode) {
          case 401:
            throw new Error('Unauthorized: Please log in again');
          case 403:
            throw new Error('Forbidden: You can only update items that you own');
          case 404:
            throw new Error('Item not found');
          case 400:
            throw new Error(`Invalid data: ${errorMessage}`);
          default:
            throw new Error(errorMessage || 'Failed to update item');
        }
      }
      
      throw new Error('Network error: Please check your connection');
    }
  }

  /**
   * Delete an item by ID
   * @param id - Item ID to delete
   */
  async deleteItem(id: number) {
    try {
      const response = await axios.delete(`${API_URL}/items/${id}`, {
        headers: this.getAuthHeaders()
      });

      if (response.data.status) {
        return {
          success: true,
          message: response.data.message || 'Item deleted successfully'
        };
      } else {
        throw new Error(response.data.message || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        const statusCode = error.response?.status;
        
        switch (statusCode) {
          case 401:
            throw new Error('Unauthorized: Please log in again');
          case 403:
            throw new Error('Forbidden: You can only delete items that you own');
          case 404:
            throw new Error('Item not found');
          default:
            throw new Error(errorMessage || 'Failed to delete item');
        }
      }
      
      throw new Error('Network error: Please check your connection');
    }
  }

  /**
   * Create a new item
   * @param itemData - Item data to create
   */
  async createItem(itemData: any) {
    try {
      const response = await axios.post(
        `${API_URL}/items/create`,
        itemData,
        {
          headers: this.getAuthHeaders()
        }
      );

      if (response.data.status) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to create item');
      }
    } catch (error) {
      console.error('Failed to create item:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage || 'Failed to create item');
      }
      
      throw new Error('Network error: Please check your connection');
    }
  }

  /**
   * Delete an item image by ID
   * @param imageId - Image ID to delete
   */
  async deleteItemImage(imageId: number) {
    try {
      const response = await axios.delete(`${API_URL}/items/images/${imageId}`, {
        headers: this.getAuthHeaders()
      });

      if (response.data.status) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        const statusCode = error.response?.status;
        
        switch (statusCode) {
          case 401:
            throw new Error('Unauthorized: Please log in again');
          case 403:
            throw new Error('Forbidden: You can only delete images from items that you own');
          case 404:
            throw new Error('Image not found');
          default:
            throw new Error(errorMessage || 'Failed to delete image');
        }
      }
      
      throw new Error('Network error: Please check your connection');
    }
  }

  /**
   * Get items added by the current authenticated user
   * @returns Promise with user's items
   */
  async getMyItems(): Promise<Item[]> {
    try {
      const response = await axios.get(`${API_URL}/items/my-items`, {
        headers: this.getAuthHeaders()
      });

      if (response.data.status) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch your items');
    } catch (error) {
      console.error('Failed to fetch user items:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        const statusCode = error.response?.status;
        
        switch (statusCode) {
          case 401:
            throw new Error('Unauthorized: Please log in again');
          default:
            throw new Error(errorMessage || 'Failed to fetch your items');
        }
      }
      
      throw new Error('Network error: Please check your connection');
    }
  }
}
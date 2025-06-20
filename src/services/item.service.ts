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

const API_URL =  import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class ItemService {
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
}
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

interface AuthResponse {
  data: any;
  status: boolean;
  message: string;
  access_token: string;
}

interface SignUpForm {
  email: string;
  password: string;
  name: string;
  age: number;
  phone: string;
  faculty: string;
}

interface CreateItemResponse {
  status: boolean;
  message: string;
  data?: any;
}

interface CreateItemRequest {
  item_type: number;  // 0 for lost, 1 for found
  category: string;
  date: string;
  color: string;
  title: string;
  descs: string;
  time: string;
  location: string;
  conatct_info: string;
  status: number;
}

interface UploadImagesResponse {
  status: boolean;
  message: string;
  data: string[]
}

interface AddImagesRequest {
  item_id: number;
  image_paths: string[];
}

const API_URL =  import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class AuthService {
  async signIn(data: { email: string; password: string }): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, data);
      if (response.data.status) {
        this.setToken(response.data.data.access_token);
        toast({
          title: "Success!",
          description: response.data.message || "Successfully signed in",
          variant: "default",
        });
        return response.data;
      }
      throw new Error(response.data.message || 'Login failed');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to sign in';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  }

  async signUp(data: SignUpForm): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, data);
      if (response.data.status) {
        this.setToken(response.data.access_token);
        toast({
          title: "Success!",
          description: "Successfully registered",
          variant: "default",
        });
        return response.data;
      }
      throw new Error(response.data.message || 'Registration failed');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to register';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    toast({
      title: "Logged out",
      description: "Successfully logged out",
      variant: "default",
    });
    
  }

  async createItem(data: CreateItemRequest): Promise<CreateItemResponse> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.post<CreateItemResponse>(
        `${API_URL}/items/create`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status) {
        toast({
          title: "Success!",
          description: "Item reported successfully",
          variant: "default",
        });
        return response.data;
      }

      throw new Error(response.data.message || 'Failed to create item');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to report item';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  }

  async uploadItemImages(images: File[]): Promise<string[]> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const formData = new FormData();
      images.forEach(image => {
        formData.append('images', image);
      });

      const response = await axios.post<UploadImagesResponse>(
        `${API_URL}/items/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.status) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to upload images');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to upload images';
      throw new Error(errorMessage);
    }
  }

  async addItemImages(itemId: number, imagePaths: string[]): Promise<void> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.post(
        `${API_URL}/items/add-images`,
        {
          item_id: itemId,
          image_paths: imagePaths
        } as AddImagesRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data.status) {
        throw new Error(response.data.message || 'Failed to add images to item');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add images to item';
      throw new Error(errorMessage);
    }
  }
}
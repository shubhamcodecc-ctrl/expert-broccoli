import { config } from '../config';
import { StorageService } from './storageService';

export class ApiService {
  private static baseURL = config.API_URL || 'http://localhost:5000/api';

  /**
   * Register user
   */
  static async register(email: string, password: string, name?: string) {
    return this.post('/auth/register', {
      email,
      password,
      name,
    });
  }

  /**
   * Login user
   */
  static async login(email: string, password: string) {
    return this.post('/auth/login', {
      email,
      password,
    });
  }

  /**
   * Get user profile
   */
  static async getProfile() {
    return this.get('/users/profile');
  }

  /**
   * Get personalized recommendations
   */
  static async getRecommendations(limit: number = 10, offset: number = 0) {
    const response = await this.get(
      `/videos/recommendations?limit=${limit}&offset=${offset}`
    );
    return response.data || [];
  }

  /**
   * Get video details
   */
  static async getVideoDetails(youtubeId: string) {
    return this.get(`/videos/${youtubeId}`);
  }

  /**
   * Get video reliability score
   */
  static async getReliabilityScore(youtubeId: string) {
    return this.get(`/videos/${youtubeId}/reliability-score`);
  }

  /**
   * Log watch event
   */
  static async logWatch(
    videoId: string,
    watchedDuration: number,
    totalDuration: number,
    completionRate: number
  ) {
    return this.post('/videos/watch-history', {
      videoId,
      watchedDuration,
      totalDuration,
      completionRate,
    });
  }

  /**
   * Get user preferences
   */
  static async getPreferences() {
    return this.get('/users/preferences');
  }

  /**
   * Update user preferences
   */
  static async updatePreferences(preferences: any) {
    return this.put('/users/preferences', preferences);
  }

  /**
   * Make GET request
   */
  private static async get(endpoint: string) {
    const token = await StorageService.getToken();
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    return this.handleResponse(response);
  }

  /**
   * Make POST request
   */
  private static async post(endpoint: string, data: any) {
    const token = await StorageService.getToken();
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  /**
   * Make PUT request
   */
  private static async put(endpoint: string, data: any) {
    const token = await StorageService.getToken();
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  /**
   * Handle API response
   */
  private static async handleResponse(response: Response) {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || `API Error: ${response.status}`
      );
    }

    return data;
  }
}

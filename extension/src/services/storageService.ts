export class StorageService {
  /**
   * Get authentication token
   */
  static async getToken(): Promise<string | null> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['auth_token'], (result) => {
        resolve(result.auth_token || null);
      });
    });
  }

  /**
   * Set authentication token
   */
  static async setToken(token: string): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ auth_token: token }, () => {
        resolve();
      });
    });
  }

  /**
   * Clear authentication token
   */
  static async clearToken(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.remove(['auth_token'], () => {
        resolve();
      });
    });
  }

  /**
   * Get user preferences
   */
  static async getPreferences(): Promise<any> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['user_preferences'], (result) => {
        resolve(result.user_preferences || {});
      });
    });
  }

  /**
   * Save user preferences
   */
  static async setPreferences(preferences: any): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ user_preferences: preferences }, () => {
        resolve();
      });
    });
  }

  /**
   * Get watch history from local storage
   */
  static async getWatchHistory(): Promise<any[]> {
    return new Promise((resolve) => {
      chrome.storage.local.get(['watch_history'], (result) => {
        resolve(result.watch_history || []);
      });
    });
  }

  /**
   * Add to watch history
   */
  static async addToWatchHistory(videoData: any): Promise<void> {
    const history = await this.getWatchHistory();
    history.push({
      ...videoData,
      timestamp: Date.now(),
    });
    return new Promise((resolve) => {
      chrome.storage.local.set({ watch_history: history }, () => {
        resolve();
      });
    });
  }
}

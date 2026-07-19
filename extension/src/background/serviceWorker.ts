import { StorageService } from '../services/storageService';
import { ApiService } from '../services/apiService';

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'logWatch') {
    logWatch(request.data);
  } else if (request.action === 'getRecommendations') {
    getRecommendations().then(sendResponse);
    return true; // Will respond asynchronously
  }
});

/**
 * Log watch event to backend
 */
async function logWatch(data: any) {
  try {
    await ApiService.logWatch(
      data.videoId,
      data.watchedDuration,
      data.totalDuration,
      data.completionRate
    );
    console.log('Watch event logged:', data);
  } catch (error) {
    console.error('Failed to log watch event:', error);
  }
}

/**
 * Get recommendations
 */
async function getRecommendations() {
  try {
    const token = await StorageService.getToken();
    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    const recommendations = await ApiService.getRecommendations(10);
    return { success: true, data: recommendations };
  } catch (error: any) {
    console.error('Failed to get recommendations:', error);
    return { success: false, error: error.message };
  }
}

// Log service worker activation
console.log('🔧 YouTube Recommender service worker activated');

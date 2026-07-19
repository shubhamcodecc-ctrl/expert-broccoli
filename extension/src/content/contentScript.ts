import { StorageService } from '../services/storageService';
import { ApiService } from '../services/apiService';

/**
 * Inject recommendation widget into YouTube page
 */
function injectRecommendationWidget() {
  const videoPlayer = document.querySelector('.html5-video-container');
  if (!videoPlayer) return;

  // Create widget container
  const widget = document.createElement('div');
  widget.id = 'youtube-recommender-widget';
  widget.className = 'yt-recommender-widget';
  widget.innerHTML = `
    <div class="yt-recommender-header">
      <span>🎬 Recommended for You</span>
      <button id="yt-rec-close" class="yt-rec-close">×</button>
    </div>
    <div id="yt-rec-content" class="yt-recommender-content">
      <p>Loading recommendations...</p>
    </div>
  `;

  document.body.appendChild(widget);

  // Load recommendations
  loadRecommendations();

  // Handle close button
  document.getElementById('yt-rec-close')?.addEventListener('click', () => {
    widget.remove();
  });
}

/**
 * Load and display recommendations
 */
async function loadRecommendations() {
  try {
    const response = await new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action: 'getRecommendations' },
        resolve
      );
    });

    const content = document.getElementById('yt-rec-content');
    if (!content) return;

    if (response.success && response.data.length > 0) {
      content.innerHTML = response.data
        .slice(0, 3)
        .map(
          (rec: any) => `
        <div class="yt-rec-item">
          <img src="${rec.thumbnail}" alt="${rec.title}" />
          <h4>${rec.title}</h4>
          <p>${rec.channelName}</p>
          <a href="https://youtube.com/watch?v=${rec.youtubeId}" target="_blank">Watch</a>
        </div>
      `
        )
        .join('');
    } else {
      content.innerHTML =
        '<p>No recommendations available. Watch more videos!</p>';
    }
  } catch (error) {
    console.error('Failed to load recommendations:', error);
    const content = document.getElementById('yt-rec-content');
    if (content) {
      content.innerHTML = '<p>Failed to load recommendations</p>';
    }
  }
}

/**
 * Track video watch time
 */
function trackWatchTime() {
  const videoElement = document.querySelector(
    'video'
  ) as HTMLVideoElement | null;
  if (!videoElement) return;

  const videoId = getVideoId();
  if (!videoId) return;

  let isPlaying = false;

  const handlePlay = () => {
    isPlaying = true;
  };

  const handlePause = () => {
    isPlaying = false;
  };

  const handleEnded = () => {
    isPlaying = false;
    logVideoWatch(videoId, videoElement.duration, videoElement.duration, 100);
  };

  const handleTimeUpdate = () => {
    // Log periodically (every 10 seconds)
    if (isPlaying && Math.floor(videoElement.currentTime) % 10 === 0) {
      const completionRate = (videoElement.currentTime / videoElement.duration) * 100;
      logVideoWatch(
        videoId,
        videoElement.currentTime,
        videoElement.duration,
        completionRate
      );
    }
  };

  videoElement.addEventListener('play', handlePlay);
  videoElement.addEventListener('pause', handlePause);
  videoElement.addEventListener('ended', handleEnded);
  videoElement.addEventListener('timeupdate', handleTimeUpdate);
}

/**
 * Get YouTube video ID from URL
 */
function getVideoId(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('v');
}

/**
 * Log video watch to background script
 */
function logVideoWatch(
  videoId: string,
  watchedDuration: number,
  totalDuration: number,
  completionRate: number
) {
  chrome.runtime.sendMessage({
    action: 'logWatch',
    data: {
      videoId,
      watchedDuration,
      totalDuration,
      completionRate,
    },
  });
}

// Wait for YouTube player to load
window.addEventListener('load', () => {
  console.log('🎥 Content script loaded on YouTube page');

  // Inject styles
  injectStyles();

  // Inject widget after a delay
  setTimeout(() => {
    injectRecommendationWidget();
    trackWatchTime();
  }, 1000);
});

/**
 * Inject CSS styles
 */
function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .yt-recommender-widget {
      position: fixed;
      right: 20px;
      bottom: 100px;
      width: 300px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }

    .yt-recommender-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border-bottom: 1px solid #eee;
      font-weight: 600;
      color: #030;
    }

    .yt-rec-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #999;
    }

    .yt-recommender-content {
      padding: 12px;
      max-height: 400px;
      overflow-y: auto;
    }

    .yt-rec-item {
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #eee;
    }

    .yt-rec-item:last-child {
      border-bottom: none;
    }

    .yt-rec-item img {
      width: 100%;
      height: auto;
      border-radius: 4px;
      margin-bottom: 8px;
    }

    .yt-rec-item h4 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
      color: #030;
    }

    .yt-rec-item p {
      font-size: 12px;
      color: #606060;
      margin-bottom: 8px;
    }

    .yt-rec-item a {
      display: inline-block;
      padding: 6px 12px;
      background: #065fd4;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .yt-rec-item a:hover {
      background: #0052a3;
    }
  `;
  document.head.appendChild(style);
}

console.log('🎬 YouTube Recommender content script loaded');

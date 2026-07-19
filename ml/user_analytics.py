import pandas as pd
import numpy as np
from typing import List, Dict, Tuple
from datetime import datetime, timedelta


class UserAnalytics:
    """
    Analyze user behavior patterns from watch history.
    """

    @staticmethod
    def get_favorite_categories(watch_history: List[Dict]) -> Dict[str, float]:
        """
        Identify user's favorite categories from watch history.
        
        Args:
            watch_history: List of watched videos
            
        Returns:
            Dict of {category: preference_score}
        """
        if not watch_history:
            return {}
        
        categories = {}
        total_weight = 0
        
        for video in watch_history:
            category = video.get('category', 'Unknown')
            completion_rate = video.get('completion_rate', 0) / 100.0
            
            if category not in categories:
                categories[category] = 0
            
            categories[category] += completion_rate
            total_weight += completion_rate
        
        # Normalize
        if total_weight > 0:
            for category in categories:
                categories[category] /= total_weight
        
        return dict(sorted(categories.items(), key=lambda x: x[1], reverse=True))

    @staticmethod
    def get_favorite_channels(watch_history: List[Dict]) -> Dict[str, float]:
        """
        Identify user's favorite channels.
        
        Args:
            watch_history: List of watched videos
            
        Returns:
            Dict of {channel: preference_score}
        """
        if not watch_history:
            return {}
        
        channels = {}
        total_weight = 0
        
        for video in watch_history:
            channel = video.get('channel', 'Unknown')
            completion_rate = video.get('completion_rate', 0) / 100.0
            
            if channel not in channels:
                channels[channel] = 0
            
            channels[channel] += completion_rate
            total_weight += completion_rate
        
        # Normalize
        if total_weight > 0:
            for channel in channels:
                channels[channel] /= total_weight
        
        return dict(sorted(channels.items(), key=lambda x: x[1], reverse=True))

    @staticmethod
    def get_viewing_habits(watch_history: List[Dict]) -> Dict:
        """
        Analyze viewing habits (time of day, duration, etc.).
        
        Args:
            watch_history: List of watched videos
            
        Returns:
            Dict with viewing habit metrics
        """
        if not watch_history:
            return {}
        
        durations = [v.get('watch_duration', 0) for v in watch_history]
        completion_rates = [v.get('completion_rate', 0) for v in watch_history]
        
        return {
            'avg_watch_duration': np.mean(durations) if durations else 0,
            'max_watch_duration': np.max(durations) if durations else 0,
            'min_watch_duration': np.min(durations) if durations else 0,
            'avg_completion_rate': np.mean(completion_rates) if completion_rates else 0,
            'total_videos_watched': len(watch_history),
            'total_watch_time': sum(durations),
        }

    @staticmethod
    def predict_user_interest(watch_history: List[Dict], new_video: Dict) -> float:
        """
        Predict how interested user would be in a new video.
        
        Args:
            watch_history: User's watch history
            new_video: New video to predict interest for
            
        Returns:
            Interest score (0-1)
        """
        if not watch_history:
            return 0.5  # Default for new users
        
        favorite_categories = UserAnalytics.get_favorite_categories(watch_history)
        favorite_channels = UserAnalytics.get_favorite_channels(watch_history)
        
        video_category = new_video.get('category', 'Unknown')
        video_channel = new_video.get('channel', 'Unknown')
        
        # Category score
        category_score = favorite_categories.get(video_category, 0) * 0.6
        
        # Channel score
        channel_score = favorite_channels.get(video_channel, 0) * 0.4
        
        return category_score + channel_score

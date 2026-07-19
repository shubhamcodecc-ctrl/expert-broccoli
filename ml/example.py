import os
import sys
import json
from typing import List, Dict
from recommendation_engine import RecommendationEngine
from user_analytics import UserAnalytics


def main():
    """
    Example usage of recommendation engine.
    """
    # Initialize engine
    engine = RecommendationEngine()
    
    # Sample watch history
    watch_history = [
        {
            'title': 'Python Tutorial for Beginners',
            'category': 'Technology',
            'channel': 'Tech Learning Hub',
            'completion_rate': 95,
            'views': 100000,
            'likes': 5000,
            'dislikes': 100,
            'comments': 500,
            'channel_subscribers': 500000,
            'published_at': '2024-01-15',
        },
        {
            'title': 'Advanced Python Techniques',
            'category': 'Technology',
            'channel': 'Tech Learning Hub',
            'completion_rate': 87,
            'views': 50000,
            'likes': 2500,
            'dislikes': 50,
            'comments': 300,
            'channel_subscribers': 500000,
            'published_at': '2024-01-20',
        },
    ]
    
    # Sample candidate videos
    candidates = [
        {
            'title': 'Web Development with Django',
            'description': 'Learn web development using Django framework',
            'category': 'Technology',
            'channel': 'Tech Learning Hub',
            'views': 80000,
            'likes': 3500,
            'dislikes': 75,
            'comments': 400,
            'channel_subscribers': 500000,
            'published_at': '2024-02-01',
        },
        {
            'title': 'Gaming Review - New RPG',
            'description': 'Review of the latest RPG game',
            'category': 'Gaming',
            'channel': 'Game Reviews',
            'views': 200000,
            'likes': 8000,
            'dislikes': 200,
            'comments': 1000,
            'channel_subscribers': 1000000,
            'published_at': '2024-02-03',
        },
        {
            'title': 'Music Production Basics',
            'description': 'Learn the basics of music production',
            'category': 'Music',
            'channel': 'Music Academy',
            'views': 120000,
            'likes': 4000,
            'dislikes': 100,
            'comments': 600,
            'channel_subscribers': 300000,
            'published_at': '2024-02-02',
        },
    ]
    
    # Build user vector
    user_vector = engine.build_user_vector(watch_history)
    print(f"User vector shape: {user_vector.shape}")
    
    # Get recommendations
    recommendations = engine.recommend(user_vector, candidates, top_n=2)
    
    print("\n=== Recommendations ===")
    for video, score in recommendations:
        print(f"\n{video['title']}")
        print(f"  Score: {score:.3f}")
        print(f"  Category: {video['category']}")
        print(f"  Channel: {video['channel']}")
    
    # Analyze user
    print("\n=== User Analytics ===")
    print(f"Favorite Categories: {UserAnalytics.get_favorite_categories(watch_history)}")
    print(f"Favorite Channels: {UserAnalytics.get_favorite_channels(watch_history)}")
    print(f"Viewing Habits: {UserAnalytics.get_viewing_habits(watch_history)}")


if __name__ == '__main__':
    main()

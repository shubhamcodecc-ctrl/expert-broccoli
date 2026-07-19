import sys
import os
import json
from datetime import datetime

# Add backend src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'src'))


class TestDataGenerator:
    """
    Generate test data for the YouTube recommender system.
    """

    @staticmethod
    def generate_test_videos(count: int = 50) -> list:
        """
        Generate test video data.
        """
        videos = []
        categories = ['Technology', 'Gaming', 'Music', 'Education', 'Entertainment', 'Sports']
        channels = [
            'Tech Learning Hub',
            'Game Reviews',
            'Music Academy',
            'Educational Videos',
            'Entertainment Daily',
            'Sports Channel',
        ]

        for i in range(count):
            video = {
                'youtubeId': f'video_{i:04d}',
                'title': f'Sample Video {i}',
                'description': f'This is a sample video {i} for testing purposes.',
                'channelId': f'channel_{i % 6:02d}',
                'channelName': channels[i % 6],
                'channelSubscribers': (i + 1) * 10000,
                'thumbnail': f'https://img.youtube.com/vi/video_{i:04d}/0.jpg',
                'duration': 'PT10M30S',
                'metrics': {
                    'views': (i + 1) * 5000,
                    'likes': (i + 1) * 500,
                    'dislikes': (i + 1) * 10,
                    'comments': (i + 1) * 50,
                },
                'category': categories[i % 6],
                'publishedAt': datetime.now().isoformat(),
            }
            videos.append(video)

        return videos

    @staticmethod
    def generate_test_watch_history(count: int = 20) -> list:
        """
        Generate test watch history data.
        """
        watch_history = []

        for i in range(count):
            watch_log = {
                'youtubeVideoId': f'video_{i % 50:04d}',
                'watchedAt': datetime.now().isoformat(),
                'watchedDuration': 600 + i * 30,
                'totalDuration': 630 + i * 30,
                'completionRate': 85 + (i % 15),
                'liked': True if i % 3 == 0 else (False if i % 3 == 1 else None),
            }
            watch_history.append(watch_log)

        return watch_history

    @staticmethod
    def generate_test_user() -> dict:
        """
        Generate test user data.
        """
        return {
            'email': 'testuser@example.com',
            'password': 'testpassword123',
            'name': 'Test User',
            'preferences': {
                'categories': ['Technology', 'Gaming'],
                'blockedChannels': [],
                'blockedVideos': [],
                'language': 'en',
                'maturityRating': 'PG-13',
            },
        }

    @staticmethod
    def save_test_data(filepath: str) -> None:
        """
        Save test data to a JSON file.
        """
        test_data = {
            'videos': TestDataGenerator.generate_test_videos(50),
            'watch_history': TestDataGenerator.generate_test_watch_history(20),
            'user': TestDataGenerator.generate_test_user(),
        }

        with open(filepath, 'w') as f:
            json.dump(test_data, f, indent=2, default=str)

        print(f"Test data saved to {filepath}")


if __name__ == '__main__':
    TestDataGenerator.save_test_data('test_data.json')

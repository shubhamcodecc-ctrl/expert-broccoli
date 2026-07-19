import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(__file__))

from recommendation_engine import RecommendationEngine
from user_analytics import UserAnalytics


def test_recommendation_engine():
    """Test recommendation engine."""
    engine = RecommendationEngine()
    
    # Test user vector building
    watch_history = [
        {
            'title': 'Python Tutorial',
            'category': 'Technology',
            'channel': 'Tech Hub',
            'completion_rate': 95,
        }
    ]
    
    user_vector = engine.build_user_vector(watch_history)
    assert user_vector.shape == (100,), "User vector should have 100 dimensions"
    print("✓ User vector building works")
    
    # Test video vector building
    video = {
        'title': 'Django Tutorial',
        'description': 'Learn Django web framework',
        'category': 'Technology',
    }
    
    video_vector = engine.build_video_vector(video)
    assert video_vector.shape == (100,), "Video vector should have 100 dimensions"
    print("✓ Video vector building works")
    
    # Test similarity calculation
    similarity = engine.calculate_similarity(user_vector, video_vector)
    assert 0 <= similarity <= 1, "Similarity should be between 0 and 1"
    print(f"✓ Similarity calculation works (similarity: {similarity:.3f})")
    
    # Test video scoring
    scores = engine.score_video(video, user_vector, engagement_score=0.8)
    assert 'final_score' in scores, "Scores should contain final_score"
    assert 0 <= scores['final_score'] <= 1, "Final score should be between 0 and 1"
    print(f"✓ Video scoring works (score: {scores['final_score']:.3f})")
    
    # Test recommendations
    candidates = [video, video, video]
    recommendations = engine.recommend(user_vector, candidates, top_n=2)
    assert len(recommendations) <= 2, "Should return at most 2 recommendations"
    print(f"✓ Recommendation works (got {len(recommendations)} recommendations)")


def test_user_analytics():
    """Test user analytics."""
    watch_history = [
        {'category': 'Tech', 'channel': 'TechHub', 'completion_rate': 95},
        {'category': 'Tech', 'channel': 'TechHub', 'completion_rate': 85},
        {'category': 'Gaming', 'channel': 'GameReviews', 'completion_rate': 70},
    ]
    
    # Test favorite categories
    categories = UserAnalytics.get_favorite_categories(watch_history)
    assert 'Tech' in categories, "Should identify Tech category"
    assert categories['Tech'] > categories['Gaming'], "Tech should be top category"
    print("✓ Favorite categories detection works")
    
    # Test favorite channels
    channels = UserAnalytics.get_favorite_channels(watch_history)
    assert 'TechHub' in channels, "Should identify TechHub channel"
    assert channels['TechHub'] > channels['GameReviews'], "TechHub should be top channel"
    print("✓ Favorite channels detection works")
    
    # Test viewing habits
    habits = UserAnalytics.get_viewing_habits(watch_history)
    assert habits['total_videos_watched'] == 3, "Should count 3 videos"
    print(f"✓ Viewing habits analysis works")
    
    # Test interest prediction
    new_video = {'category': 'Tech', 'channel': 'TechHub'}
    interest = UserAnalytics.predict_user_interest(watch_history, new_video)
    assert 0 <= interest <= 1, "Interest score should be between 0 and 1"
    print(f"✓ Interest prediction works (interest: {interest:.3f})")


if __name__ == '__main__':
    print("Running ML module tests...\n")
    
    print("Testing Recommendation Engine:")
    test_recommendation_engine()
    
    print("\nTesting User Analytics:")
    test_user_analytics()
    
    print("\n✅ All ML tests passed!")

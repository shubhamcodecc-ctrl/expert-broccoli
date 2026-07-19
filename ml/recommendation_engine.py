import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Tuple


class RecommendationEngine:
    """
    Machine Learning recommendation engine using collaborative filtering
    and content-based filtering hybrid approach.
    """

    def __init__(self):
        self.user_item_matrix = None
        self.video_features = None
        self.tfidf_vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
        self.user_vectors = {}
        self.video_vectors = {}

    def build_user_vector(self, watch_history: List[Dict]) -> np.ndarray:
        """
        Build user preference vector from watch history.
        
        Args:
            watch_history: List of watched videos with engagement metrics
            
        Returns:
            User preference vector (numpy array)
        """
        if not watch_history:
            return np.zeros(100)  # Empty vector

        # Extract features from watch history
        features = []
        weights = []

        for video in watch_history:
            # Weight by completion rate
            completion_rate = video.get('completion_rate', 0) / 100.0
            
            # Extract video features
            title = video.get('title', '')
            category = video.get('category', '')
            channel = video.get('channel', '')
            
            features.append(f"{title} {category} {channel}")
            weights.append(completion_rate)

        if not features:
            return np.zeros(100)

        # TF-IDF vectorization
        try:
            tfidf_matrix = self.tfidf_vectorizer.fit_transform(features)
            
            # Weight by completion rate
            weighted_matrix = tfidf_matrix.multiply(np.array(weights).reshape(-1, 1))
            
            # Average to get user vector
            user_vector = np.asarray(weighted_matrix.mean(axis=0)).flatten()
            
            # Pad to 100 dimensions
            if len(user_vector) < 100:
                user_vector = np.pad(user_vector, (0, 100 - len(user_vector)))
            else:
                user_vector = user_vector[:100]
                
            return user_vector
        except Exception as e:
            print(f"Error building user vector: {e}")
            return np.zeros(100)

    def build_video_vector(self, video: Dict) -> np.ndarray:
        """
        Build video feature vector.
        
        Args:
            video: Video metadata dictionary
            
        Returns:
            Video feature vector (numpy array)
        """
        title = video.get('title', '')
        description = video.get('description', '')
        category = video.get('category', '')
        
        text = f"{title} {description} {category}"
        
        try:
            # Initialize vectorizer if not done
            if not hasattr(self.tfidf_vectorizer, 'vocabulary_'):
                self.tfidf_vectorizer.fit_transform([text])
            
            vector = self.tfidf_vectorizer.transform([text]).toarray().flatten()
            
            # Pad to 100 dimensions
            if len(vector) < 100:
                vector = np.pad(vector, (0, 100 - len(vector)))
            else:
                vector = vector[:100]
                
            return vector
        except Exception as e:
            print(f"Error building video vector: {e}")
            return np.zeros(100)

    def calculate_similarity(
        self,
        user_vector: np.ndarray,
        video_vector: np.ndarray
    ) -> float:
        """
        Calculate cosine similarity between user and video vectors.
        
        Args:
            user_vector: User preference vector
            video_vector: Video feature vector
            
        Returns:
            Similarity score (0-1)
        """
        user_vector = user_vector.reshape(1, -1)
        video_vector = video_vector.reshape(1, -1)
        
        similarity = cosine_similarity(user_vector, video_vector)[0][0]
        return float(similarity)

    def score_video(
        self,
        video: Dict,
        user_vector: np.ndarray,
        engagement_score: float = 0.5
    ) -> Dict:
        """
        Score a video for recommendation.
        
        Args:
            video: Video metadata
            user_vector: User preference vector
            engagement_score: Video engagement score (0-1)
            
        Returns:
            Scoring dict with components
        """
        # Get video vector
        video_vector = self.build_video_vector(video)
        
        # Content similarity
        content_similarity = self.calculate_similarity(user_vector, video_vector)
        
        # Engagement score
        engagement = engagement_score
        
        # Popularity score (normalized from metrics)
        views = video.get('views', 0)
        popularity = min(1.0, np.log10(views + 1) / 8)  # Log scale
        
        # Channel credibility
        subscribers = video.get('channel_subscribers', 0)
        credibility = min(1.0, np.log10(subscribers + 1) / 8)
        
        # Recency score
        import datetime
        published_at = video.get('published_at', datetime.datetime.now())
        days_old = (datetime.datetime.now() - published_at).days
        recency = max(0, np.exp(-days_old / 30))  # Decay over 30 days
        
        # Weighted combination
        final_score = (
            0.35 * content_similarity +
            0.25 * engagement +
            0.20 * popularity +
            0.15 * credibility +
            0.05 * recency
        )
        
        return {
            'final_score': float(final_score),
            'content_similarity': float(content_similarity),
            'engagement_score': float(engagement),
            'popularity_score': float(popularity),
            'credibility_score': float(credibility),
            'recency_score': float(recency),
        }

    def recommend(
        self,
        user_vector: np.ndarray,
        candidates: List[Dict],
        top_n: int = 10
    ) -> List[Tuple[Dict, float]]:
        """
        Recommend top N videos for user.
        
        Args:
            user_vector: User preference vector
            candidates: List of candidate videos
            top_n: Number of recommendations to return
            
        Returns:
            List of (video, score) tuples
        """
        scored_videos = []
        
        for video in candidates:
            engagement_score = self._calculate_engagement_score(video)
            scores = self.score_video(video, user_vector, engagement_score)
            scored_videos.append((video, scores['final_score']))
        
        # Sort by score and return top N
        scored_videos.sort(key=lambda x: x[1], reverse=True)
        return scored_videos[:top_n]

    def _calculate_engagement_score(self, video: Dict) -> float:
        """
        Calculate engagement score from video metrics.
        
        Args:
            video: Video metadata
            
        Returns:
            Engagement score (0-1)
        """
        likes = video.get('likes', 0)
        dislikes = video.get('dislikes', 0)
        comments = video.get('comments', 0)
        views = video.get('views', 1)
        
        # Like ratio
        total_ratings = likes + dislikes or 1
        like_ratio = likes / total_ratings
        
        # Engagement rate
        engagement_rate = (likes + comments) / views
        
        # Normalized score
        score = like_ratio * 0.7 + engagement_rate * 0.3
        return min(1.0, score)

import React from 'react';

interface Recommendation {
  youtubeId: string;
  title: string;
  channelName: string;
  thumbnail: string;
  reliability_score: number;
  reason: string;
}

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
}) => {
  if (recommendations.length === 0) {
    return (
      <div className="empty-state">
        <p>No recommendations available yet.</p>
        <p>Watch more videos to get personalized recommendations!</p>
      </div>
    );
  }

  return (
    <div className="recommendations-list">
      {recommendations.map((rec) => (
        <div key={rec.youtubeId} className="recommendation-card">
          <img
            src={rec.thumbnail}
            alt={rec.title}
            className="recommendation-thumbnail"
          />
          <div className="recommendation-content">
            <h3 className="recommendation-title">{rec.title}</h3>
            <p className="recommendation-channel">{rec.channelName}</p>
            <div className="recommendation-footer">
              <span className="reliability-badge">
                ⭐ {(rec.reliability_score * 100).toFixed(0)}%
              </span>
              <a
                href={`https://youtube.com/watch?v=${rec.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="watch-link"
              >
                Watch →
              </a>
            </div>
            <p className="recommendation-reason">{rec.reason}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

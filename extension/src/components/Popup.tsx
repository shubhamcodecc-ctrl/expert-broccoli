import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { ApiService } from '../services/apiService';
import { RecommendationsList } from './RecommendationsList';
import { AuthForm } from './AuthForm';
import { LoadingSpinner } from './LoadingSpinner';

export const Popup: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    const token = await StorageService.getToken();
    if (token) {
      setIsAuthenticated(true);
      fetchRecommendations();
    }
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const recs = await ApiService.getRecommendations(10);
      setRecommendations(recs);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await StorageService.clearToken();
    setIsAuthenticated(false);
    setRecommendations([]);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    fetchRecommendations();
  };

  if (!isAuthenticated) {
    return <AuthForm onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="popup-container">
      <div className="popup-header">
        <h1>🎬 YouTube Recommender</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchRecommendations}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <RecommendationsList recommendations={recommendations} />
      )}
    </div>
  );
};

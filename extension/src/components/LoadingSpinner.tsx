import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading recommendations...</p>
    </div>
  );
};

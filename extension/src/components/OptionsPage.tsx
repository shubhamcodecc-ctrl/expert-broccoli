import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { ApiService } from '../services/apiService';

export const OptionsPage: React.FC = () => {
  const [preferences, setPreferences] = useState({
    categories: [] as string[],
    blockedChannels: [] as string[],
    language: 'en',
  });
  const [newCategory, setNewCategory] = useState('');
  const [newBlockedChannel, setNewBlockedChannel] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const prefs = await ApiService.getPreferences();
      setPreferences(prefs.data || preferences);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await ApiService.updatePreferences(preferences);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const addCategory = () => {
    if (newCategory && !preferences.categories.includes(newCategory)) {
      setPreferences({
        ...preferences,
        categories: [...preferences.categories, newCategory],
      });
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setPreferences({
      ...preferences,
      categories: preferences.categories.filter((c) => c !== category),
    });
  };

  const addBlockedChannel = () => {
    if (newBlockedChannel && !preferences.blockedChannels.includes(newBlockedChannel)) {
      setPreferences({
        ...preferences,
        blockedChannels: [...preferences.blockedChannels, newBlockedChannel],
      });
      setNewBlockedChannel('');
    }
  };

  const removeBlockedChannel = (channel: string) => {
    setPreferences({
      ...preferences,
      blockedChannels: preferences.blockedChannels.filter((c) => c !== channel),
    });
  };

  if (loading) {
    return <div className="options-container"><p>Loading...</p></div>;
  }

  return (
    <div className="options-container">
      <h1>YouTube Recommender Settings</h1>

      <div className="settings-section">
        <h2>Preferred Categories</h2>
        <div className="input-group">
          <input
            type="text"
            placeholder="Add category (e.g., Technology, Gaming)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCategory()}
          />
          <button onClick={addCategory}>Add</button>
        </div>
        <div className="tag-list">
          {preferences.categories.map((cat) => (
            <span key={cat} className="tag">
              {cat}
              <button onClick={() => removeCategory(cat)}>×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h2>Blocked Channels</h2>
        <div className="input-group">
          <input
            type="text"
            placeholder="Add channel ID to block"
            value={newBlockedChannel}
            onChange={(e) => setNewBlockedChannel(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addBlockedChannel()}
          />
          <button onClick={addBlockedChannel}>Block</button>
        </div>
        <div className="tag-list">
          {preferences.blockedChannels.map((channel) => (
            <span key={channel} className="tag blocked">
              {channel}
              <button onClick={() => removeBlockedChannel(channel)}>×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <label>
          <span>Language:</span>
          <select
            value={preferences.language}
            onChange={(e) =>
              setPreferences({ ...preferences, language: e.target.value })
            }
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="hi">Hindi</option>
          </select>
        </label>
      </div>

      {saved && <div className="success-message">✓ Settings saved!</div>}
      <button onClick={handleSave} className="save-button">Save Settings</button>
    </div>
  );
};

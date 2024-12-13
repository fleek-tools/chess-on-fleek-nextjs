"use client";

import { useState, useEffect } from 'react';

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

interface LeaderboardEntry {
  id: number;
  player_name: string;
  time_seconds: number;
  created_at: string;
}

export default function LeaderboardUI() {
  const [leaderboards, setLeaderboards] = useState<{
    easy: LeaderboardEntry[];
    medium: LeaderboardEntry[];
    hard: LeaderboardEntry[];
  }>({
    easy: [],
    medium: [],
    hard: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('easy');
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async (difficulty: string) => {
    try {
      const response = await fetch(`/api/leaderboard?difficulty=${difficulty}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLeaderboards(prev => ({
        ...prev,
        [difficulty]: Array.isArray(data) ? data : []
      }));
    } catch (error) {
      console.error(`Error fetching ${difficulty} leaderboard:`, error);
      setError('Failed to load leaderboard data');
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchLeaderboard('easy'),
        fetchLeaderboard('medium'),
        fetchLeaderboard('hard')
      ]);
      setIsLoading(false);
    };

    fetchAll();
    const interval = setInterval(fetchAll, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      const initializeDB = async () => {
          try {
              await fetch('/api/init-db', { method: 'POST' });
          } catch (error) {
              console.error('Error initializing database:', error);
          }
      };
  
      initializeDB();
  }, []); // Run once on component mount
  
  const renderLeaderboard = (data: LeaderboardEntry[]) => (
    <div className="w-full">
      {isLoading ? (
        <div className="text-center py-4 text-gray-300">Loading...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-400">{error}</div>
      ) : data.length === 0 ? (
        <div className="text-center py-4 text-gray-300">No records yet</div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-3 font-bold p-2 bg-gray-800 rounded text-gray-200">
            <div>Rank</div>
            <div>Player</div>
            <div>Time</div>
          </div>
          {data.map((entry, index) => (
            <div key={entry.id} 
              className="grid grid-cols-3 p-2 hover:bg-gray-700 rounded transition-colors duration-200 text-gray-300">
              <div>#{index + 1}</div>
              <div>{entry.player_name}</div>
              <div>{formatTime(entry.time_seconds)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 pt-4">
        <h4 className="text-lg font-bold text-gray-200">Leaderboards</h4>
      </div>
      
      <div className="px-4 py-2">
        <div className="flex border-b border-gray-700 mb-4">
          {['easy', 'medium', 'hard'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 ${
                activeTab === tab
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              } capitalize transition-colors duration-200`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="pb-4">
          {renderLeaderboard(leaderboards[activeTab as keyof typeof leaderboards])}
        </div>
      </div>
    </div>
  );
}

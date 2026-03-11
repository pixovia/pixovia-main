import React, { useState, useEffect } from 'react';
import { appsService } from '../lib/supabase';
import AppCard from '../components/AppCard';
import { useSEO } from '../lib/useSEO';
import toast from 'react-hot-toast';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'All Free Games - Pixovia Store',
    description: 'Download the latest games on Pixovia Store freely. Browse free gaming titles for Windows and other platforms.',
    keywords: 'free games, topgames, fitgirlrepack, free gaming, download free games, free windows games, free game store',
    url: 'https://pixovia.pages.dev/store/games',
    type: 'website'
  });

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const data = await appsService.getApps();
      const gamesList = data.filter(app => app.app_type === 'game') || [];
      const shuffledGames = gamesList.sort(() => Math.random() - 0.5);
      setGames(shuffledGames);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching games:', error);
      toast.error('Failed to load games');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Loading free games...</h2>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#00d4ff' }}>
        Free Games
      </h1>
      {games.length > 0 ? (
        <>
          <p style={{ color: '#888', marginBottom: '2rem', fontSize: '1.1rem' }}>
            🎮 All {games.length} games are completely free to download and play!
          </p>
          <div className="apps-grid">
            {games.map(game => (
              <AppCard key={game.id} app={game} />
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
          <p>No free games available yet.</p>
        </div>
      )}
    </div>
  );
};

export default Games;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MusicHome from './pages/MusicHome';
import SongsPage from './pages/SongsPage';
import AlbumsPage from './pages/AlbumsPage';
import ArtistsPage from './pages/ArtistsPage';
import AlbumPage from './pages/AlbumPage';
import ArtistPage from './pages/ArtistPage';
import PlayerPage from './pages/PlayerPage';
import SearchResults from './pages/SearchResults';
import SEO from '../components/SEO';

function Music() {
  return (
    <>
      <SEO 
        title="Pixovia Music - Free Music Streaming"
        description="Listen to unlimited music for free. All genres, artists, and albums on Pixovia Music."
        keywords="free music, music streaming, songs, albums, artists"
        canonicalUrl="https://pixovia.pages.dev/music"
      />
      <Routes>
        <Route path="/" element={<MusicHome />} />
        <Route path="/songs" element={<SongsPage />} />
        <Route path="/albums" element={<AlbumsPage />} />
        <Route path="/artists" element={<ArtistsPage />} />
        <Route path="/album/:id" element={<AlbumPage />} />
        <Route path="/artist/:name" element={<ArtistPage />} />
        <Route path="/player/:id" element={<PlayerPage />} />
        <Route path="/search/:query" element={<SearchResults />} />
      </Routes>
    </>
  );
}

export default Music;
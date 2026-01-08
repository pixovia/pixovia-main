import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './lib/auth';
import Header from './components/Header';
import Home from './pages/Home';
import Albums from './pages/Albums';
import AlbumDetails from './pages/AlbumDetails';
import Files from './pages/Files';
import FileDetails from './pages/FileDetails';
import SearchResults from './pages/SearchResults';
import Profile from './pages/Profile';
import Adult from './pages/Adult';
import './styles/Library.css';

const Library = () => {
  return (
    <AuthProvider>
      <div className="Library">
        <Header />
        <main className="library-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/album/:id" element={<AlbumDetails />} />
            <Route path="/files" element={<Files />} />
            <Route path="/file/:id" element={<FileDetails />} />
            <Route path="/search/:query" element={<SearchResults />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/adult" element={<Adult />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
};

export default Library;
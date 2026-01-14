import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MoviesHome from './pages/MoviesHome';
import MovieDetails from './pages/MovieDetails';
import SEO from '../components/SEO';

function Movies() {
  return (
    <>
      <SEO 
  title="Pixovia Movies - Free Movies for Everyone"
  description="Watch unlimited movies for free. All genres, all languages, latest releases and classic films on Pixovia Movies."
  keywords="free movies, watch movies online, streaming, films, cinema"
  url="https://pixovia.pages.dev/movies"
/>
      <Routes>
        <Route path="/" element={<MoviesHome />} />
        <Route path="/:id" element={<MovieDetails />} />
      </Routes>
    </>
  );
}

export default Movies;

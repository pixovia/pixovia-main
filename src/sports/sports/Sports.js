import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SportsHome from './pages/SportsHome';
import SportDetails from './pages/SportDetails';
import SportsType from './pages/SportsType';
import SEO from '../components/SEO';

function Sports() {
  return (
    <>
      <SEO 
        title="Pixovia Sports Live - Free Live Sports Streaming"
        description="Watch live sports for free. Football, basketball, cricket, and more sports streaming on Pixovia Sports."
        keywords="live sports, sports streaming, football, basketball, cricket"
        canonicalUrl="https://pixovia.pages.dev/sports"
      />
      <Routes>
        <Route path="/" element={<SportsHome />} />
        <Route path="/type/:typeName" element={<SportsType />} />
        <Route path="/:id" element={<SportDetails />} />
      </Routes>
    </>
  );
}

export default Sports;
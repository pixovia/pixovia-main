import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SEO from '../components/SEO';
import Header from './components/Header';
import Home from './pages/Home';
import AppDetails from './pages/AppDetails';
import Upload from './pages/Upload';
import Developer from './pages/Developer';
import Category from './pages/Category';
import SearchResults from './pages/SearchResults';
import Apps from './pages/Apps';
import Games from './pages/Games';
import Themes from './pages/Themes';
import Extensions from './pages/Extensions';
import Admin from './pages/Admin';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Download from './pages/Download';
import './styles/App.css';

const Store = () => {
  return (
    <>
      <SEO 
        title="Pixovia Store - Free Apps, Games & Extensions"
        description="Download free apps, games, browser themes, and extensions. Premium software completely free of cost on Pixovia Store."
        keywords="free apps, games, browser themes, extensions, premium software, download"
        url="https://pixovia.pages.dev/store/"
      />
      <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app/:id" element={<AppDetails />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/developer/:id" element={<Developer />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/search/:query" element={<SearchResults />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/games" element={<Games />} />
          <Route path="/themes" element={<Themes />} />
          <Route path="/extensions" element={<Extensions />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/download" element={<Download />} />
        </Routes>
      </main>
      <Toaster position="top-right" />
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Pixovia Store</h3>
            <p>App Store Platform</p>
          </div>
          <div className="footer-credits">
            <p>Developed and Presented by</p>
            <div className="credits">
              <span className="pixovia">Pixovia</span>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
};

export default Store;
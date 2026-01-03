import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
import Contact from './pages/Contact';
import Download from './pages/Download';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/store/" element={<Home />} />
            <Route path="/store/app/:id" element={<AppDetails />} />
            <Route path="/store/upload" element={<Upload />} />
            <Route path="/store/developer/:id" element={<Developer />} />
            <Route path="/store/category/:category" element={<Category />} />
            <Route path="/store/search/:query" element={<SearchResults />} />
            <Route path="/store/apps" element={<Apps />} />
            <Route path="/store/games" element={<Games />} />
            <Route path="/store/themes" element={<Themes />} />
            <Route path="/store/extensions" element={<Extensions />} />
            <Route path="/store/admin" element={<Admin />} />
            <Route path="/store/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/store/terms-of-service" element={<TermsOfService />} />
            <Route path="/store/contact" element={<Contact />} />
            <Route path="/store/download" element={<Download />} />
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
    </Router>
  );
}

export default App;
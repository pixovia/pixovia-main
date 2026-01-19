import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import Library from './library/Library';
import Contact from './pages/Contact';
import Store from './store/Store';
import Movies from './movies/Movies';
import Sports from './sports/Sports';
import Music from './music/Music';
import Learn from './learn/Learn';
import Mods from './mods/Mods';
import Malayalidino from './malayalidino/Malayalidino';
import Tv from './tv/Tv';
import Tinyurl from './tinyurl/Tinyurl';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library/*" element={<Library />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/store/*" element={<Store />} />
            <Route path="/movies/*" element={<Movies />} />
            <Route path="/sports/*" element={<Sports />} />
            <Route path="/music/*" element={<Music />} />
            <Route path="/learn/*" element={<Learn />} />
            <Route path="/mods" element={<Mods />} />
            <Route path="/malayalidino" element={<Malayalidino />} />
            <Route path="/tv" element={<Tv />} />
            <Route path="/tinyurl" element={<Tinyurl />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;

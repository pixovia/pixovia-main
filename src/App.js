import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import ShutdownModal from './ShutdownModal';

import Home from './pages/Home';
import Library from './library/Library';
import Contact from './pages/Contact';
import About from './pages/About';
import Store from './store/Store';
import Movies from './movies/Movies';
import Sports from './sports/Sports';
import Music from './music/Music';
import Learn from './learn/Learn';
import Mods from './mods/Mods';
import Malayalidino from './malayalidino/Malayalidino';
import Tv from './tv/Tv';
import Tiny from './tiny/Tiny';
import WebHost from './webhost/WebHost';
import Chatroom from './chatroom/Chatroom';


function AppRoutes() {

const location = useLocation();
const [showModal, setShowModal] = useState(true);

// Show again when URL changes
useEffect(() => {
  setShowModal(true);
}, [location]);

return (
  <div className="App">

    {showModal && (
      <ShutdownModal onClose={() => setShowModal(false)} />
    )}

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/library/*" element={<Library />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/store/*" element={<Store />} />
      <Route path="/movies/*" element={<Movies />} />
      <Route path="/sports/*" element={<Sports />} />
      <Route path="/music/*" element={<Music />} />
      <Route path="/learn/*" element={<Learn />} />
      <Route path="/mods" element={<Mods />} />
      <Route path="/malayalidino" element={<Malayalidino />} />
      <Route path="/tv" element={<Tv />} />
      <Route path="/webhost" element={<WebHost />} />
      <Route path="/tiny" element={<Tiny />} />
      <Route path="/chatroom" element={<Chatroom />} />
    </Routes>

  </div>
);

}


function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppRoutes />
      </Router>
    </HelmetProvider>
  );
}

export default App;

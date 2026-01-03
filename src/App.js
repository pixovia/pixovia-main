import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import Library from './library/Library';
import Contact from './pages/Contact';
import Store from './store/Store';

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
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
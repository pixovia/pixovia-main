import React from 'react';
import { Mail } from 'lucide-react';

const Contact = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        color: '#667eea', 
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        Contact Us
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
        <div>
          <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>Get in Touch</h2>
          <div style={{ color: '#b3b3b3', lineHeight: '1.6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <Mail size={20} color="#667eea" />
              <a href="mailto:pixoviallc@gmail.com" style={{ color: '#b3b3b3', textDecoration: 'none' }}>
                pixoviallc@gmail.com
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <span style={{ color: '#00d4ff' }}>📧 24/7 Available</span>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>About Pixovia</h3>
            <div style={{ color: '#b3b3b3' }}>
              <p>Pixovia is a modern gaming and tech platform dedicated to providing premium applications, games, browser themes, and extensions for all platforms.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
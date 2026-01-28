import React from 'react';
import { Mail, ArrowLeft, FileText } from 'lucide-react';

const Contact = () => {
  return (
    <div
      style={{
        background: 'radial-gradient(circle at top, #0f172a 0%, #020617 100%)',
        minHeight: '100vh',
        padding: '4rem 1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#e2e8f0',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '700px',
          width: '100%',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(12px)',
          borderRadius: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.4)',
          padding: '2.5rem',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            background: 'linear-gradient(90deg, #667eea, #00d4ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '2rem',
            fontWeight: '700',
          }}
        >
          Contact Pixovia LLC
        </h1>

        <p style={{ color: '#a0aec0', marginBottom: '2rem', lineHeight: '1.6' }}>
          Have questions, suggestions, or business inquiries?  
          We’re here to listen. Reach out to us anytime via email.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            transition: 'all 0.3s ease',
          }}
        >
          <Mail size={22} color="#00d4ff" />
          <a
            href="mailto:pixoviallc@gmail.com"
            style={{
              color: '#e2e8f0',
              textDecoration: 'none',
              fontSize: '1.1rem',
            }}
          >
            pixoviallc@gmail.com
          </a>
        </div>

        <p
          style={{
            color: '#00d4ff',
            fontSize: '0.9rem',
            marginTop: '1rem',
            letterSpacing: '0.5px',
          }}
        >
          📧 Available 24/7 — We respond within 24 hours
        </p>

        <hr
          style={{
            border: 'none',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            margin: '2rem 0',
          }}
        />

        <div>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#fff',
              marginBottom: '1rem',
            }}
          >
            About Pixovia
          </h2>
          <p style={{ color: '#a0aec0', lineHeight: '1.6' }}>
            Pixovia LLC is a free digital ecosystem that offers Movies, Games,
            Apps, Music, Sports, TV, and Learning — all in one place.  
            Entertainment, creativity, and knowledge — completely free.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            marginTop: '3rem',
          }}
        >
          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(90deg, #667eea, #00d4ff)',
              color: '#fff',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontWeight: '600',
              transition: '0.3s',
            }}
          >
            <ArrowLeft size={18} />
            Main Page
          </a>

          <a
            href="/legal"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.08)',
              color: '#e2e8f0',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontWeight: '600',
              transition: '0.3s',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background =
                'linear-gradient(90deg, #667eea, #00d4ff)')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background =
                'rgba(255,255,255,0.08)')
            }
          >
            <FileText size={18} />
            Legal Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;

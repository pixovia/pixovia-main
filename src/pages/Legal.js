import React from 'react';

const Legal = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0b0f19 0%, #0d1224 100%)',
        color: '#d6d6e8',
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '4rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '850px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            textAlign: 'center',
            background: 'linear-gradient(90deg, #667eea, #00d4ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '2.5rem',
          }}
        >
          Legal & Policies — Pixovia LLC
        </h1>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>
            1. Terms of Use
          </h2>
          <p style={{ color: '#b0b0c3', lineHeight: 1.7 }}>
            By accessing or using any Pixovia service (including Movies, Music, Games, Apps, Learn,
            and TV), you agree to comply with our terms. Pixovia LLC provides completely free
            digital content access for personal and non-commercial purposes. Redistribution,
            re-uploading, or modification of content without authorization is strictly prohibited except Library.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>
            2. Privacy Policy
          </h2>
          <p style={{ color: '#b0b0c3', lineHeight: 1.7 }}>
            Pixovia LLC respects your privacy. We do not collect personal information unless you
            contact us directly through our email. No tracking cookies, analytics, or data sales are
            involved. Your interaction with Pixovia remains completely anonymous and private.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>
            3. Copyright Policy
          </h2>
          <p style={{ color: '#b0b0c3', lineHeight: 1.7 }}>
            All assets, artworks, and materials available through Pixovia are provided for
            educational or entertainment purposes only. If you believe any content violates your
            copyright, please contact us immediately at{' '}
            <a
              href="mailto:pixoviallc@gmail.com"
              style={{ color: '#00d4ff', textDecoration: 'none' }}
            >
              pixoviallc@gmail.com
            </a>{' '}
            for prompt removal.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>
            4. Disclaimer
          </h2>
          <p style={{ color: '#b0b0c3', lineHeight: 1.7 }}>
            Pixovia LLC provides all services “as is” without warranties of any kind. We are not
            responsible for any external content, linked sites, or usage consequences. You use
            Pixovia services at your own discretion and responsibility.
          </p>
        </section>

        <section>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>
            5. Contact Us
          </h2>
          <p style={{ color: '#b0b0c3', lineHeight: 1.7 }}>
            For legal queries, partnership opportunities, or content takedown requests, please
            reach us directly at{' '}
            <a
              href="mailto:pixoviallc@gmail.com"
              style={{ color: '#00d4ff', textDecoration: 'none' }}
            >
              pixoviallc@gmail.com
            </a>
            .
          </p>
        </section>

        <div
          style={{
            marginTop: '3rem',
            textAlign: 'center',
          }}
        >
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '0.8rem 1.8rem',
              background: 'linear-gradient(90deg, #667eea, #00d4ff)',
              borderRadius: '0.75rem',
              color: '#fff',
              fontWeight: '600',
              textDecoration: 'none',
              transition: '0.3s',
            }}
          >
            ⬅ Back to Home
          </a>
        </div>
      </div>

      <footer
        style={{
          marginTop: '3rem',
          fontSize: '0.9rem',
          color: '#6b7280',
        }}
      >
        © {new Date().getFullYear()} Pixovia LLC. All rights reserved.
      </footer>
    </div>
  );
};

export default Legal;

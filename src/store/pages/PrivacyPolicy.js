import React from 'react';
import { useSEO } from '../lib/useSEO';

const PrivacyPolicy = () => {
  useSEO({
    title: 'Privacy Policy - Pixovia Store',
    description: 'Read the privacy policy of Pixovia Store. Learn how we protect your data and privacy.',
    keywords: 'privacy policy, data protection, privacy',
    url: 'https://pixovia.pages.dev/store/privacy-policy',
    type: 'website'
  });

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#00d4ff', marginBottom: '2rem' }}>
        Privacy Policy
      </h1>

      <div style={{ color: '#ccc', lineHeight: '1.8' }}>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>1. Introduction</h2>
          <p>
            Pixovia Store ("we", "us", "our") operates the pixovia.pages.dev/store website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>2. Information Collection and Use</h2>
          <p>
            We collect several different types of information for various purposes to provide and improve our Service to you.
          </p>
          <ul style={{ marginLeft: '2rem' }}>
            <li>Personal Data: Email address, name, usage data</li>
            <li>Usage Data: Browser type, IP address, pages visited, time spent</li>
            <li>Cookies: We use cookies to enhance your experience</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>3. Security of Data</h2>
          <p>
            The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>4. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the top of this Privacy Policy.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at support@pixovia.com or visit our contact page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
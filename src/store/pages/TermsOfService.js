import React from 'react';
import { useSEO } from '../lib/useSEO';

const TermsOfService = () => {
  useSEO({
    title: 'Terms of Service - Pixovia Store',
    description: 'Read the terms of service for Pixovia Store. Understand the rules and conditions for using our platform.',
    keywords: 'terms of service, terms and conditions, legal',
    url: 'https://pixovia.pages.dev/store/terms-of-service',
    type: 'website'
  });

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#00d4ff', marginBottom: '2rem' }}>
        Terms of Service
      </h1>

      <div style={{ color: '#ccc', lineHeight: '1.8' }}>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Pixovia Store website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on Pixovia Store for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul style={{ marginLeft: '2rem' }}>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to decompile or reverse engineer any software contained on the site</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>3. Disclaimer</h2>
          <p>
            The materials on Pixovia Store are provided on an 'as is' basis. Pixovia makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>4. Limitations</h2>
          <p>
            In no event shall Pixovia or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Pixovia Store.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>5. Accuracy of Materials</h2>
          <p>
            The materials appearing on Pixovia Store could include technical, typographical, or photographic errors. Pixovia does not warrant that any of the materials on its website are accurate, complete, or current. Pixovia may make changes to the materials contained on its website at any time without notice.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>6. Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at support@pixovia.com or visit our contact page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
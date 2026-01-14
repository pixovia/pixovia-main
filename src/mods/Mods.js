import React, { useEffect } from 'react';

export default function Mods() {
  useEffect(() => {
    // Redirect to the static /mods/ page in `public`/build
    window.location.replace('/mods/');
  }, []);

  // Fallback UI while redirecting
  return (
    <div style={{minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: '#000'}}>
      <div style={{textAlign: 'center'}}>
        <h2 style={{fontSize: '20px', marginBottom: '8px'}}>Opening Mods…</h2>
        <p style={{opacity: 0.8}}>If you are not redirected automatically, <a href="/mods/">click here</a>.</p>
      </div>
    </div>
  );
}

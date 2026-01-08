import React from 'react';

function Adult() {
  React.useEffect(() => {
    window.location.href = '/library/adult/';
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff'
    }}>
      <p>Redirecting to adult section...</p>
    </div>
  );
}

export default Adult;
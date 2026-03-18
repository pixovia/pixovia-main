import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/music', label: 'Home', icon: HomeIcon, end: true },
  { to: '/music/songs', label: 'Songs', icon: NoteIcon },
  { to: '/music/albums', label: 'Albums', icon: AlbumIcon },
  { to: '/music/artists', label: 'Artists', icon: UserIcon },
];

export default function MobileBottomNav() {
  return (
    <nav
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: 'rgba(18, 18, 18, 0.92)',
        backdropFilter: 'blur(14px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          padding: '0.4rem 0.35rem',
          gap: '0.15rem',
          maxWidth: '520px',
          margin: '0 auto',
        }}
      >
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            style={({ isActive }) => ({
              textDecoration: 'none',
              color: isActive ? '#ffffff' : '#9ca3af',
              borderRadius: '0.75rem',
              padding: '0.55rem 0.25rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              fontWeight: 800,
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: isActive ? 'rgba(99,102,241,0.18)' : 'transparent',
            })}
          >
            <l.icon active />
            <span>{l.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function iconBaseStyle(color) {
  return { width: 22, height: 22, color };
}

function HomeIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={iconBaseStyle(active ? '#a5b4fc' : '#9ca3af')}>
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NoteIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={iconBaseStyle(active ? '#a5b4fc' : '#9ca3af')}>
      <path
        d="M12 3v10.4c-.6-.3-1.3-.5-2-.5-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4V7h6V3h-8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlbumIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={iconBaseStyle(active ? '#a5b4fc' : '#9ca3af')}>
      <path
        d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M12 13.2a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z" fill="currentColor" />
    </svg>
  );
}

function UserIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={iconBaseStyle(active ? '#a5b4fc' : '#9ca3af')}>
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4 20v-1c0-3.3 3.6-6 8-6s8 2.7 8 6v1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}


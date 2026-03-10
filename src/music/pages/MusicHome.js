import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = "https://jiosaavn-api5.vercel.app/api";

const getImage = (images) => {
  if (!images) return null;

  if (Array.isArray(images)) {
    return images[images.length - 1]?.link;
  }

  if (images?.quality) {
    return images.quality === "500x500"
      ? images.link
      : images.link;
  }

  return null;
};

async function getSongs(query) {
  const res = await fetch(`${API}/search/songs?query=${encodeURIComponent(query)}&limit=12`);
  const data = await res.json();
  return data?.data?.results || [];
}

async function getAlbums(query) {
  const res = await fetch(`${API}/search/albums?query=${encodeURIComponent(query)}&limit=12`);
  const data = await res.json();
  return data?.data?.results || [];
}

async function getArtists(query) {
  const res = await fetch(`${API}/search/artists?query=${encodeURIComponent(query)}&limit=12`);
  const data = await res.json();
  return data?.data?.results || [];
}

function MusicHome() {
  const navigate = useNavigate();

  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // Responsive resize
  useEffect(() => {
    const resize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // SEO
  useEffect(() => {
    document.title = "Pixovia Music - Free Music Streaming";

    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content =
      "Stream unlimited music for free on Pixovia Music by Pixovia LLC.";
    document.head.appendChild(meta);
  }, []);

  // Load music
  useEffect(() => {
    loadMusic();
  }, []);

  async function loadMusic() {
    try {
      setLoading(true);

      const [songs, albumsData, artistsData] = await Promise.all([
        getSongs("trending"),
        getAlbums("latest"),
        getArtists("popular"),
      ]);

      setTracks(songs);
      setAlbums(albumsData);
      setArtists(artistsData);
    } catch (err) {
      setError("Failed to load music.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    if (!searchQuery.trim()) return;
    navigate(`/music/search/${encodeURIComponent(searchQuery)}`);
  }

  if (loading) {
    return (
      <div
        style={{
          background: "#000",
          color: "#fff",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Figtree",
        }}
      >
        Loading music...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: "#000",
          color: "red",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isDesktop ? "row" : "column",
        background: "#000",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "Figtree",
      }}
    >
      {/* Sidebar */}
      {isDesktop && (
        <aside
          style={{
            width: "260px",
            padding: "20px",
            background: "#121212",
          }}
        >
          <h2>Pixovia Music</h2>

          <nav
            style={{
              marginTop: "30px",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <span>Home</span>
            <span>Search</span>
            <span>Your Library</span>
          </nav>
        </aside>
      )}

      {/* Main */}
      <main
        style={{
          flex: 1,
          padding: "25px",
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "30px",
          }}
        >
          <input
            type="text"
            placeholder="Search songs, artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{
              padding: "10px",
              borderRadius: "20px",
              border: "none",
              width: "250px",
            }}
          />

          <Link to="/" style={{ color: "#aaa" }}>
            Back
          </Link>
        </header>

        {/* Tracks */}
        <Section title="Made For You">
          {tracks.slice(0, isDesktop ? 8 : 4).map((track) => (
            <Card
              key={track.id}
              title={track.name}
              subtitle={track.primaryArtists}
              image={getImage(track.image)}
              link={`/music/player/${track.id}`}
            />
          ))}
        </Section>

        {/* Albums */}
        <Section title="Popular Albums">
          {albums.slice(0, isDesktop ? 8 : 4).map((album) => (
            <Card
              key={album.id}
              title={album.name}
              subtitle={album.primaryArtists}
              image={getImage(album.image)}
              link={`/music/album/${album.id}`}
            />
          ))}
        </Section>

        {/* Artists */}
        <Section title="Popular Artists">
          {artists.slice(0, isDesktop ? 8 : 4).map((artist) => (
            <Card
              key={artist.id}
              title={artist.name}
              subtitle="Artist"
              image={getImage(artist.image)}
              link={`/music/artist/${artist.id}`}
              circle
            />
          ))}
        </Section>
      </main>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <h2 style={{ marginBottom: "20px" }}>{title}</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px,1fr))",
          gap: "20px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Card({ title, subtitle, image, link, circle }) {
  return (
    <Link to={link} style={{ textDecoration: "none", color: "#fff" }}>
      <div
        style={{
          background: "#121212",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            width: "100%",
            aspectRatio: "1",
            overflow: "hidden",
            borderRadius: circle ? "50%" : "6px",
            marginBottom: "10px",
          }}
        >
          {image ? (
            <img
              src={image}
              alt={title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                background: "#333",
                width: "100%",
                height: "100%",
              }}
            />
          )}
        </div>

        <div style={{ fontWeight: "bold", fontSize: "14px" }}>{title}</div>
        <div style={{ fontSize: "12px", color: "#aaa" }}>{subtitle}</div>
      </div>
    </Link>
  );
}

export default MusicHome;

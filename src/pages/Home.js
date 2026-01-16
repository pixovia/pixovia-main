import React from 'react';
import SEO from '../components/SEO';

const Home = () => {
  return (
    <>
      <SEO 
        title="Pixovia LLC - Free Digital Ecosystem | Apps, Games, Movies, Music & More"
        description="Pixovia LLC offers the world's largest free digital ecosystem. Download premium apps, games, themes & extensions. Stream unlimited movies, music, sports live. Access digital library, downloader tools & learning platform - all completely free."
        keywords="free apps, free games, free movies, free music streaming, digital library, video downloader, online learning, sports streaming, browser themes, extensions, premium software free, Pixovia LLC"
        url="https://pixovia.pages.dev/"
      />
      <div className="antialiased" style={{
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        backgroundColor: '#000000',
        color: '#ffffff',
        margin: 0,
        overflowX: 'hidden',
        minHeight: '100vh'
      }}>
        <div className="animated-bg" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 50%, #111 0%, #000 100%)',
          zIndex: -1
        }}>
          <div className="orb" style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            animation: 'float 20s infinite alternate'
          }}></div>
        </div>

        {/* Header */}
        <nav className="p-8 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <img 
              src="https://pixovia.pages.dev/icon-coloured-closeup.jpg" 
              alt="Pixovia" 
              className="w-10 h-10 rounded-xl shadow-2xl"
            />
            <span className="font-extrabold text-2xl tracking-tighter uppercase italic">
              PIXOVIA <span className="text-gray-500">LLC</span>
            </span>
          </div>
          <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
            <span>Global Ecosystem</span>
            <span>Always Free</span>
            <span>2026 Vision</span>
          </div>
        </nav>

        {/* Hero */}
        <header className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center relative z-10">
          <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter mb-8 leading-none uppercase">
            EVERYTHING.<br/>
            <span className="text-gray-500 italic">WITHOUT LIMITS.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
            Pixovia LLC is building the world's first truly open digital network. Every service, every file, and every stream—accessible to all, completely free of cost.
          </p>
        </header>

        {/* Navigation Grid */}
        <main className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Store */}
            <a href="/store/" className="service-card p-8 rounded-3xl block" style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(15px)',
              transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <span className="badge-free" style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', background: '#ffffff', color: '#000000', padding: '2px 8px', borderRadius: '4px', marginBottom: '12px', display: 'inline-block' }}>All Platforms</span>
              <div className="icon-box" style={{ width: '56px', height: '56px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', padding: '12px', transition: 'transform 0.3s ease' }}>
                <img src="/icons/store.png" alt="Store" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <h3 className="text-2xl font-bold mb-3 uppercase tracking-tight">Store</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light">Free apps, games, browser themes, and extensions for all platforms. Download premium software at no cost.</p>
            </a>

            {/* 2. Library */}
            <a href="/library/" className="service-card p-8 rounded-3xl block" style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(15px)',
              transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <span className="badge-free" style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', background: '#ffffff', color: '#000000', padding: '2px 8px', borderRadius: '4px', marginBottom: '12px', display: 'inline-block' }}>Open Source</span>
              <div className="icon-box" style={{ width: '56px', height: '56px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', padding: '12px', transition: 'transform 0.3s ease' }}>
                <img src="/icons/library.png" alt="Library" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <h3 className="text-2xl font-bold mb-3 uppercase tracking-tight">Library</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light">Resource center for developers and tech enthusiasts. Upload, share, and discover exclusive digital files.</p>
            </a>

            {/* 3. Movies */}
            <a href="/movies/" className="service-card p-8 rounded-3xl block" style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(15px)',
              transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <span className="badge-free" style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', background: '#ffffff', color: '#000000', padding: '2px 8px', borderRadius: '4px', marginBottom: '12px', display: 'inline-block' }}>No Ads</span>
              <div className="icon-box" style={{ width: '56px', height: '56px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', padding: '12px', transition: 'transform 0.3s ease' }}>
                <img src="/icons/movies.png" alt="Movies" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <h3 className="text-2xl font-bold mb-3 uppercase tracking-tight">Movies</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light">Watch unlimited movies in high definition. All genres, latest releases, and classics for free.</p>
            </a>

            {/* 4. TV */}
            <a href="/tv/" className="service-card p-8 rounded-3xl block" style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(15px)',
              transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <span className="badge-free" style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', background: '#ffffff', color: '#000000', padding: '2px 8px', borderRadius: '4px', marginBottom: '12px', display: 'inline-block' }}>Live Channels</span>
              <div className="icon-box" style={{ width: '56px', height: '56px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', padding: '12px', transition: 'transform 0.3s ease' }}>
                <img src="/icons/tv.png" alt="TV" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <h3 className="text-2xl font-bold mb-3 uppercase tracking-tight">TV</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light">Access 1000+ live television channels globally. News, entertainment, and documentaries in real-time.</p>
            </a>

            {/* 5. MalayaliDino */}
            <a href="/malayalidino" className="service-card p-8 rounded-3xl block" style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(15px)',
              transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <span className="badge-free" style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', background: '#ffffff', color: '#000000', padding: '2px 8px', borderRadius: '4px', marginBottom: '12px', display: 'inline-block' }}>Instant Play</span>
              <div className="icon-box" style={{ width: '56px', height: '56px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', padding: '12px', transition: 'transform 0.3s ease' }}>
                <img src="/icons/malayalidino.png" alt="MalayaliDino" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <h3 className="text-2xl font-bold mb-3 uppercase tracking-tight">MalayaliDino</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light">Experience the classic runner with a local twist. Play and compete for the global high score.</p>
            </a>

            {/* 6. Sports */}
            <a href="/sports/" className="service-card p-8 rounded-3xl block" style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(15px)',
              transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <span className="badge-free bg-green-500 text-white" style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', padding: '2px 8px', borderRadius: '4px', marginBottom: '12px', display: 'inline-block' }}>Live</span>
              <div className="icon-box" style={{ width: '56px', height: '56px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', padding: '12px', transition: 'transform 0.3s ease', fontSize: '24px' }}>⚽</div>
              <h3 className="text-2xl font-bold mb-3 uppercase tracking-tight">Sports</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light">Watch live sports worldwide. Football, cricket, and major events streamed in 4K.</p>
            </a>

            {/* 7. Music */}
            <a href="/music/" className="service-card p-8 rounded-3xl block" style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(15px)',
              transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <span className="badge-free" style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', background: '#ffffff', color: '#000000', padding: '2px 8px', borderRadius: '4px', marginBottom: '12px', display: 'inline-block' }}>Unlimited</span>
              <div className="icon-box" style={{ width: '56px', height: '56px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', padding: '12px', transition: 'transform 0.3s ease', fontSize: '24px' }}>🎵</div>
              <h3 className="text-2xl font-bold mb-3 uppercase tracking-tight">Music</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light">Stream unlimited tracks from your favorite artists. High-fidelity audio with zero fees.</p>
            </a>

            {/* 8. Learn */}
            <a href="/learn/" className="service-card p-8 rounded-3xl block" style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(15px)',
              transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <span className="badge-free" style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', background: '#ffffff', color: '#000000', padding: '2px 8px', borderRadius: '4px', marginBottom: '12px', display: 'inline-block' }}>Knowledge</span>
              <div className="icon-box" style={{ width: '56px', height: '56px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', padding: '12px', transition: 'transform 0.3s ease' }}>
                <img src="/icons/learn.png" alt="Learn" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <h3 className="text-2xl font-bold mb-3 uppercase tracking-tight">Learn</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light">Free educational platform. Courses, tutorials, and materials for every subject.</p>
            </a>

            {/* 9. Downloader */}
            <a href="/downloader/" className="service-card p-8 rounded-3xl block lg:col-span-1" style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(15px)',
              transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="badge-free" style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', background: '#ffffff', color: '#000000', padding: '2px 8px', borderRadius: '4px', marginBottom: '12px', display: 'inline-block' }}>Universal</span>
                  <div className="icon-box" style={{ width: '56px', height: '56px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', padding: '12px', transition: 'transform 0.3s ease' }}>
                    <img src="/icons/downloader.png" alt="Downloader" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 uppercase tracking-tight">Downloader</h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-light">Extract and save media from YT, FB, and IG instantly.</p>
                </div>
              </div>
            </a>

          </div>
        </main>

        {/* Footer */}
        <footer className="p-12 border-t border-white/5 bg-black/50 relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <p className="font-black text-xl tracking-tighter mb-2 uppercase italic">Pixovia LLC</p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em]">The Digital Liberation Front • 2026</p>
            </div>
            <div className="flex gap-12 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">
              <a href="#" className="hover:text-white transition">Network Status</a>
              <a href="#" className="hover:text-white transition">Open Source</a>
              <a href="#" className="hover:text-white transition">Privacy</a>
            </div>
          </div>
        </footer>

        <style jsx>{`
          @keyframes float {
            0% { transform: translate(-10%, -10%); }
            100% { transform: translate(10%, 10%); }
          }
          .service-card:hover {
            background: rgba(255, 255, 255, 0.05) !important;
            border-color: rgba(255, 255, 255, 0.2) !important;
            transform: translateY(-10px) !important;
          }
          .service-card:hover .icon-box {
            transform: scale(1.1) !important;
          }
        `}</style>
      </div>
    </>
  );
};

export default Home;

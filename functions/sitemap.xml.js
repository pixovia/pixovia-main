export async function onRequest(context) {
  const { createClient } = await import('@supabase/supabase-js');
  
  const storeSupabase = createClient(
    'https://pjbqfzpvqhqjxqxkqxqx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqYnFmenB2cWhxanhxeGtxeHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MzI4NzEsImV4cCI6MjA1MDEwODg3MX0.example'
  );

  const librarySupabase = createClient(
    'https://abcdefghijklmnopqrst.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3BxcnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MzI4NzEsImV4cCI6MjA1MDEwODg3MX0.example'
  );

  const baseUrl = 'https://pixovia.pages.dev';
  const currentDate = new Date().toISOString().split('T')[0];
  
  let urls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${baseUrl}/store`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/store/apps`, priority: '0.8', changefreq: 'daily' },
    { loc: `${baseUrl}/store/themes`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/library`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/movies`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/music`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/sports`, priority: '0.9', changefreq: 'hourly' },
    { loc: `${baseUrl}/learn`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/downloader`, priority: '0.7', changefreq: 'weekly' },
    { loc: `${baseUrl}/contact`, priority: '0.5', changefreq: 'monthly' },
    // Icons and images for Google indexing
    { loc: `${baseUrl}/icon-coloured-closeup.png`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${baseUrl}/icon-coloured-closeup.jpg`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${baseUrl}/icon-coloured-closeup.webp`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${baseUrl}/logo-coloured.png`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${baseUrl}/og-image.png`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${baseUrl}/android-chrome-512x512.png`, priority: '0.2', changefreq: 'yearly' },
    { loc: `${baseUrl}/apple-touch-icon.png`, priority: '0.2', changefreq: 'yearly' }
  ];

  try {
    const [apps, files, albums, movies, music, sports, courses] = await Promise.all([
      storeSupabase.from('apps').select('id').then(r => r.data || []),
      librarySupabase.from('files').select('id').then(r => r.data || []),
      librarySupabase.from('albums').select('id').then(r => r.data || []),
      librarySupabase.from('movie_audio_learn').select('id').eq('type', 'movie').then(r => r.data || []),
      librarySupabase.from('movie_audio_learn').select('id').eq('type', 'audio').then(r => r.data || []),
      librarySupabase.from('sports').select('id, type').then(r => r.data || []),
      librarySupabase.from('movie_audio_learn').select('id').eq('type', 'learn').then(r => r.data || [])
    ]);

    // Add sports type pages
    const sportsTypes = [...new Set(sports.map(s => s.type).filter(Boolean))];
    sportsTypes.forEach(type => {
      urls.push({ 
        loc: `${baseUrl}/sports/type/${encodeURIComponent(type)}`, 
        priority: '0.8', 
        changefreq: 'hourly' 
      });
    });

    apps.forEach(app => urls.push({ loc: `${baseUrl}/store/app/${app.id}`, priority: '0.7', changefreq: 'weekly' }));
    files.forEach(file => urls.push({ loc: `${baseUrl}/library/file/${file.id}`, priority: '0.6', changefreq: 'monthly' }));
    albums.forEach(album => urls.push({ loc: `${baseUrl}/library/album/${album.id}`, priority: '0.6', changefreq: 'monthly' }));
    movies.forEach(movie => urls.push({ loc: `${baseUrl}/movies/${movie.id}`, priority: '0.7', changefreq: 'weekly' }));
    music.forEach(track => urls.push({ loc: `${baseUrl}/music/player/${track.id}`, priority: '0.6', changefreq: 'monthly' }));
    sports.forEach(sport => urls.push({ loc: `${baseUrl}/sports/${sport.id}`, priority: '0.7', changefreq: 'hourly' }));
    courses.forEach(course => urls.push({ loc: `${baseUrl}/learn/${course.id}`, priority: '0.6', changefreq: 'monthly' }));
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>${url.loc === baseUrl + '/' ? `
    <image:image>
      <image:loc>${baseUrl}/icon-coloured-closeup.png</image:loc>
      <image:title>Pixovia LLC - Multi-Service Platform</image:title>
    </image:image>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
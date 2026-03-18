const DEFAULT_BASE_URLS = [
  'https://jiosaavn-api5.vercel.app',
  'https://saavn.sumit.co',
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function withTimeout(ms) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  return { controller, done: () => clearTimeout(t) };
}

class HttpError extends Error {
  constructor(status, statusText, message) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.statusText = statusText;
  }
}

function extractData(payload) {
  if (!payload) return null;
  if (payload.data !== undefined) return payload.data;
  if (payload.result !== undefined) return payload.result;
  if (payload.results !== undefined) return payload.results;
  return payload;
}

function normalizeImage(image) {
  if (!image) return null;
  if (typeof image === 'string') return image;
  if (Array.isArray(image)) {
    const best =
      image.find((i) => i.quality === '500x500') ||
      image.find((i) => i.quality === '300x300') ||
      image[image.length - 1];
    return best?.url || best?.link || best?.image || null;
  }
  return image.url || image.link || image.image || null;
}

function normalizeArtists(artists) {
  if (!artists) return [];
  if (typeof artists === 'string') return [{ id: null, name: artists }];

  const list = Array.isArray(artists)
    ? artists
    : artists.primary || artists.featured || artists.all || artists.artists || [];

  if (!Array.isArray(list)) return [];
  return list
    .map((a) => ({
      id: a.id || a.artistId || null,
      name: a.name || a.title || a.artist || '',
      image: normalizeImage(a.image || a.avatar),
      role: a.role,
    }))
    .filter((a) => a.name);
}

function normalizeSong(raw) {
  if (!raw) return null;
  const id = raw.id || raw.songid || raw.songId || raw.perma_url?.split('/').pop();
  const image = normalizeImage(raw.image || raw.thumbnail || raw.thumbnail_file?.file_url);
  const artists = normalizeArtists(raw.artists || raw.artist);

  const downloadUrl = raw.downloadUrl || raw.download_url || raw.downloadUrls;
  const downloadList = Array.isArray(downloadUrl) ? downloadUrl : [];
  const bestDl =
    downloadList.find((d) => d.quality === '320kbps') ||
    downloadList.find((d) => d.quality === '160kbps') ||
    downloadList[downloadList.length - 1];

  const audioUrl =
    raw.mediaUrl ||
    raw.media_url ||
    raw.url ||
    bestDl?.url ||
    bestDl?.link ||
    null;

  const album = raw.album
    ? { id: raw.album.id || raw.albumId || null, name: raw.album.name || raw.album.title || '' }
    : { id: raw.albumId || raw.album_id || null, name: raw.albumName || raw.album_name || '' };

  return {
    id: String(id || raw.id || ''),
    title: raw.name || raw.title || raw.song || '',
    image,
    artists,
    duration: raw.duration ? Number(raw.duration) : null,
    album,
    audioUrl,
    downloadUrls: downloadList
      .map((d) => ({
        quality: d.quality || d.label || null,
        url: d.url || d.link || null,
      }))
      .filter((d) => d.url),
    language: raw.language,
    year: raw.year ? String(raw.year) : null,
    raw,
  };
}

function normalizeAlbum(raw) {
  if (!raw) return null;
  return {
    id: String(raw.id || raw.albumid || raw.albumId || ''),
    name: raw.name || raw.title || raw.album || '',
    description: raw.description || raw.subtitle || '',
    image: normalizeImage(raw.image),
    artists: normalizeArtists(raw.artists || raw.artist),
    year: raw.year ? String(raw.year) : null,
    songCount: raw.songCount ?? raw.song_count ?? raw.totalSongs ?? null,
    songs: Array.isArray(raw.songs) ? raw.songs.map(normalizeSong).filter(Boolean) : [],
    raw,
  };
}

function normalizeArtist(raw) {
  if (!raw) return null;
  return {
    id: String(raw.id || raw.artistId || ''),
    name: raw.name || raw.title || '',
    image: normalizeImage(raw.image || raw.avatar),
    followerCount: raw.followerCount ?? raw.follower_count ?? null,
    dominantLanguage: raw.dominantLanguage || raw.main_lang || raw.language || null,
    raw,
  };
}

async function fetchJsonFromBase(baseUrl, path, params, { timeoutMs }) {
  const url = new URL(path, baseUrl);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') return;
      url.searchParams.set(k, String(v));
    });
  }

  const { controller, done } = withTimeout(timeoutMs);
  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      signal: controller.signal,
      headers: { accept: 'application/json' },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new HttpError(
        res.status,
        res.statusText,
        `HTTP ${res.status} ${res.statusText}${text ? `: ${text.slice(0, 200)}` : ''}`
      );
    }
    return await res.json();
  } finally {
    done();
  }
}

async function fetchWithFallback(path, params, opts) {
  const baseUrls = opts?.baseUrls?.length ? opts.baseUrls : DEFAULT_BASE_URLS;
  const timeoutMs = opts?.timeoutMs ?? 20000;

  let lastErr;
  for (let i = 0; i < baseUrls.length; i++) {
    try {
      return await fetchJsonFromBase(baseUrls[i], path, params, { timeoutMs });
    } catch (e) {
      lastErr = e;
      // small backoff to avoid hammering immediately
      if (!(e instanceof HttpError) || e.status !== 404) {
        await sleep(150);
      }
    }
  }
  throw lastErr || new Error('Request failed');
}

async function fetchAny(variants, opts) {
  let lastErr;
  for (const v of variants) {
    try {
      return await fetchWithFallback(v.path, v.params ?? null, opts);
    } catch (e) {
      lastErr = e;
      // Keep trying on 404/400; bail early on abort only after all variants.
    }
  }
  throw lastErr || new Error('Request failed');
}

export const saavnApi = {
  async searchAll(query, { page = 1, limit = 20 } = {}) {
    const payload = await fetchWithFallback('/api/search', { query, page, limit }, {});
    const data = extractData(payload) || {};
    return {
      songs: (extractData(data.songs) || data.songs || []).map(normalizeSong).filter(Boolean),
      albums: (extractData(data.albums) || data.albums || []).map(normalizeAlbum).filter(Boolean),
      artists: (extractData(data.artists) || data.artists || []).map(normalizeArtist).filter(Boolean),
      playlists: extractData(data.playlists) || data.playlists || [],
      raw: payload,
    };
  },

  async searchSongs(query, { page = 1, limit = 20 } = {}) {
    const payload = await fetchWithFallback('/api/search/songs', { query, page, limit }, {});
    const data = extractData(payload);
    const results = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : data?.songs || [];
    return results.map(normalizeSong).filter(Boolean);
  },

  async searchAlbums(query, { page = 1, limit = 20 } = {}) {
    const payload = await fetchWithFallback('/api/search/albums', { query, page, limit }, {});
    const data = extractData(payload);
    const results = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : data?.albums || [];
    return results.map(normalizeAlbum).filter(Boolean);
  },

  async searchArtists(query, { page = 1, limit = 20 } = {}) {
    const payload = await fetchWithFallback('/api/search/artists', { query, page, limit }, {});
    const data = extractData(payload);
    const results = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : data?.artists || [];
    return results.map(normalizeArtist).filter(Boolean);
  },

  async getSong(id) {
    // try both /api/songs/{id} and /api/songs?id={id}
    let payload;
    try {
      payload = await fetchWithFallback(`/api/songs/${encodeURIComponent(id)}`, null, {});
    } catch {
      payload = await fetchWithFallback('/api/songs', { id }, {});
    }
    const data = extractData(payload);
    const item = Array.isArray(data) ? data[0] : data;
    return normalizeSong(item);
  },

  async getSongSuggestions(id, { limit = 10 } = {}) {
    const payload = await fetchWithFallback(`/api/songs/${encodeURIComponent(id)}/suggestions`, { limit }, {});
    const data = extractData(payload);
    const results = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
    return results.map(normalizeSong).filter(Boolean);
  },

  async getAlbum(id) {
    const payload = await fetchAny(
      [
        { path: `/api/albums/${encodeURIComponent(id)}` },
        { path: '/api/albums', params: { id } },
        { path: '/api/albums', params: { albumId: id } },
        { path: '/api/albums', params: { ids: id } },
        { path: `/api/album/${encodeURIComponent(id)}` },
        { path: '/api/album', params: { id } },
      ],
      {}
    );
    const data = extractData(payload);
    return normalizeAlbum(data);
  },

  async getArtist(id) {
    let payload;
    try {
      payload = await fetchWithFallback(`/api/artists/${encodeURIComponent(id)}`, null, {});
    } catch {
      payload = await fetchWithFallback('/api/artists', { id }, {});
    }
    const data = extractData(payload);
    return normalizeArtist(data);
  },

  async getArtistSongs(id, { page = 1, limit = 20 } = {}) {
    const payload = await fetchWithFallback(`/api/artists/${encodeURIComponent(id)}/songs`, { page, limit }, {});
    const data = extractData(payload);
    const results = Array.isArray(data?.songs) ? data.songs : Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
    return results.map(normalizeSong).filter(Boolean);
  },

  async getArtistAlbums(id, { page = 1, limit = 20 } = {}) {
    const payload = await fetchWithFallback(`/api/artists/${encodeURIComponent(id)}/albums`, { page, limit }, {});
    const data = extractData(payload);
    const results = Array.isArray(data?.albums) ? data.albums : Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
    return results.map(normalizeAlbum).filter(Boolean);
  },
};


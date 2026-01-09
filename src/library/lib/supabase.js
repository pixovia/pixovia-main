import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fxcfusffpncorldogyku.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4Y2Z1c2ZmcG5jb3JsZG9neWt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NDEwMzQsImV4cCI6MjA4MzAxNzAzNH0.7lF1aYo4eP2by4wAnSCTpqhElgN6_TdPsItvQtxNGPI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const moviesService = {
  // Get movies from movie_audio_learn table
  async getMovies() {
    const { data, error } = await supabase
      .from('movie_audio_learn')
      .select(`
        *,
        thumbnail_file:files!movie_audio_learn_thumbnail_fkey(*)
      `)
      .eq('type', 'movie')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get movie by ID with content files
  async getMovie(id) {
    const { data, error } = await supabase
      .from('movie_audio_learn')
      .select(`
        *,
        thumbnail_file:files!movie_audio_learn_thumbnail_fkey(*)
      `)
      .eq('id', id)
      .eq('type', 'movie')
      .single();
    
    if (error) throw error;
    return data;
  },

  async searchMovies(query) {
    const { data, error } = await supabase
      .from('movie_audio_learn')
      .select(`
        *,
        thumbnail_file:files!movie_audio_learn_thumbnail_fkey(*)
      `)
      .eq('type', 'movie')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

export const sportsService = {
  async getSports() {
    const { data, error } = await supabase
      .from('sports')
      .select(`
        *,
        thumbnail_file:files!sports_thumbnail_id_fkey(*),
        team1_logo_file:files!sports_team1_logo_id_fkey(*),
        team2_logo_file:files!sports_team2_logo_id_fkey(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getSport(id) {
    const { data, error } = await supabase
      .from('sports')
      .select(`
        *,
        thumbnail_file:files!sports_thumbnail_id_fkey(*),
        team1_logo_file:files!sports_team1_logo_id_fkey(*),
        team2_logo_file:files!sports_team2_logo_id_fkey(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async searchSports(query) {
    const { data, error } = await supabase
      .from('sports')
      .select(`
        *,
        thumbnail_file:files!sports_thumbnail_id_fkey(*),
        team1_logo_file:files!sports_team1_logo_id_fkey(*),
        team2_logo_file:files!sports_team2_logo_id_fkey(*)
      `)
      .or(`title.ilike.%${query}%,team1.ilike.%${query}%,team2.ilike.%${query}%,type.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

export const musicService = {
  async getMusic() {
    const { data, error } = await supabase
      .from('movie_audio_learn')
      .select(`
        *,
        thumbnail_file:files!movie_audio_learn_thumbnail_fkey(*)
      `)
      .eq('type', 'audio')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getMusicItem(id) {
    const { data, error } = await supabase
      .from('movie_audio_learn')
      .select(`
        *,
        thumbnail_file:files!movie_audio_learn_thumbnail_fkey(*)
      `)
      .eq('id', id)
      .eq('type', 'audio')
      .single();
    
    if (error) throw error;
    
    if (data && data.content_url && data.content_url.id) {
      const { data: audioFile, error: fileError } = await supabase
        .from('files')
        .select('*')
        .eq('id', data.content_url.id)
        .single();
      
      if (fileError) throw fileError;
      data.audio_file = audioFile;
    }
    
    return data;
  },

  async searchMusic(query) {
    const { data, error } = await supabase
      .from('movie_audio_learn')
      .select(`
        *,
        thumbnail_file:files!movie_audio_learn_thumbnail_fkey(*)
      `)
      .eq('type', 'audio')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

export const learnService = {
  async getLearn() {
    const { data, error } = await supabase
      .from('movie_audio_learn')
      .select(`
        *,
        thumbnail_file:files!movie_audio_learn_thumbnail_fkey(*)
      `)
      .eq('type', 'learn')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getLearnItem(id) {
    const { data, error } = await supabase
      .from('movie_audio_learn')
      .select(`
        *,
        thumbnail_file:files!movie_audio_learn_thumbnail_fkey(*)
      `)
      .eq('id', id)
      .eq('type', 'learn')
      .single();
    
    if (error) throw error;
    
    if (data && data.content_url) {
      const fileIds = data.content_url.split(',').map(id => id.trim());
      const { data: contentFiles, error: filesError } = await supabase
        .from('files')
        .select('*')
        .in('id', fileIds);
      
      if (filesError) throw filesError;
      data.content_files = contentFiles;
    }
    
    return data;
  }
};

export const libraryService = {
  // Get all albums
  async getAlbums() {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get album by ID
  async getAlbum(id) {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get all files
  async getFiles() {
    const { data, error } = await supabase
      .from('files')
      .select(`
        *,
        albums (
          id,
          title
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get files by album
  async getFilesByAlbum(albumId) {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('album_id', albumId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get file by ID
  async getFile(id) {
    const { data, error } = await supabase
      .from('files')
      .select(`
        *,
        albums (
          id,
          title
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get files by user
  async getFilesByUser(uploader) {
    const { data, error } = await supabase
      .from('files')
      .select(`
        *,
        albums(id, title)
      `)
      .eq('uploader', uploader)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Check if ID exists
  async checkIdExists(id, table) {
    const { data, error } = await supabase
      .from(table)
      .select('id')
      .eq('id', id);
    
    if (error) throw error;
    return { data };
  },

  // Create new file
  async createFile(fileData) {
    const { data, error } = await supabase
      .from('files')
      .insert([fileData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new album
  async createAlbum(albumData) {
    const { data, error } = await supabase
      .from('albums')
      .insert([albumData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Search files
  async searchFiles(query) {
    const { data, error } = await supabase
      .from('files')
      .select(`
        *,
        albums (
          id,
          title
        )
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get movies from movie_audio_learn table
  async getMovies() {
    const { data, error } = await supabase
      .from('movie_audio_learn')
      .select(`
        *,
        thumbnail_file:files!movie_audio_learn_thumbnail_fkey(*)
      `)
      .eq('type', 'movie')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get movie by ID with content files
  async getMovie(id) {
    const { data, error } = await supabase
      .from('movie_audio_learn')
      .select(`
        *,
        thumbnail_file:files!movie_audio_learn_thumbnail_fkey(*)
      `)
      .eq('id', id)
      .eq('type', 'movie')
      .single();
    
    if (error) throw error;
    return data;
  }
};
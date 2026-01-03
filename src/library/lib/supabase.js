import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fxcfusffpncorldogyku.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4Y2Z1c2ZmcG5jb3JsZG9neWt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NDEwMzQsImV4cCI6MjA4MzAxNzAzNH0.7lF1aYo4eP2by4wAnSCTpqhElgN6_TdPsItvQtxNGPI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  }
};
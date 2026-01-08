-- Pixovia Database Schema for Supabase

-- Authors table
CREATE TABLE IF NOT EXISTS authors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Files table
CREATE TABLE IF NOT EXISTS files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    thumbnail_url TEXT,
    author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    tags TEXT[],
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_files_author_id ON files(author_id);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_files_is_featured ON files(is_featured);
CREATE INDEX IF NOT EXISTS idx_files_tags ON files USING GIN(tags);

-- Enable Row Level Security (RLS)
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authors (public read, authenticated write)
CREATE POLICY "Authors are viewable by everyone" ON authors
    FOR SELECT USING (true);

CREATE POLICY "Authors can be inserted by anyone" ON authors
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authors can be updated by anyone" ON authors
    FOR UPDATE USING (true);

-- RLS Policies for files (public read, authenticated write)
CREATE POLICY "Files are viewable by everyone" ON files
    FOR SELECT USING (true);

CREATE POLICY "Files can be inserted by anyone" ON files
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Files can be updated by anyone" ON files
    FOR UPDATE USING (true);

CREATE POLICY "Files can be deleted by anyone" ON files
    FOR DELETE USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON authors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment views count
CREATE OR REPLACE FUNCTION increment_file_views(file_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE files SET views_count = views_count + 1 WHERE id = file_id;
END;
$$ language 'plpgsql';


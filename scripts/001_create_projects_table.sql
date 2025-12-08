-- Create projects table for career timeline
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  month TEXT,
  description TEXT NOT NULL,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  image TEXT,
  achievements TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read projects (public portfolio)
CREATE POLICY "Allow public read access" ON projects
  FOR SELECT USING (true);

-- Only authenticated users can insert/update/delete
CREATE POLICY "Allow authenticated insert" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON projects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON projects
  FOR DELETE USING (auth.role() = 'authenticated');

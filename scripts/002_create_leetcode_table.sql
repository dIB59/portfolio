-- Create leetcode_problems table
CREATE TABLE IF NOT EXISTS leetcode_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  problem_number INTEGER,
  problem_type TEXT NOT NULL,
  confidence TEXT NOT NULL CHECK (confidence IN ('green', 'yellow', 'red')),
  stuck_on TEXT,
  notes TEXT,
  image TEXT,
  solved_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leetcode_problems ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read leetcode problems (public portfolio)
CREATE POLICY "Allow public read access" ON leetcode_problems
  FOR SELECT USING (true);

-- Only authenticated users can insert/update/delete
CREATE POLICY "Allow authenticated insert" ON leetcode_problems
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON leetcode_problems
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON leetcode_problems
  FOR DELETE USING (auth.role() = 'authenticated');

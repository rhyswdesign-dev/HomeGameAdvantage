-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  chapter_index INTEGER NOT NULL,
  description TEXT,
  prerequisite_ids TEXT[] DEFAULT '{}',
  estimated_minutes INTEGER,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  item_ids TEXT[] NOT NULL DEFAULT '{}',
  estimated_minutes INTEGER,
  prerequisite_ids TEXT[] DEFAULT '{}',
  types TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create items table (for quiz questions)
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  options TEXT[] DEFAULT '{}',
  answer_index INTEGER,
  order_target TEXT[] DEFAULT '{}',
  answer_text TEXT,
  acceptable_answers TEXT[] DEFAULT '{}',
  correct TEXT[] DEFAULT '{}',
  pairs JSONB,
  roleplay JSONB,
  tags TEXT[] DEFAULT '{}',
  concept_id TEXT,
  difficulty NUMERIC(3, 2),
  xp_award INTEGER DEFAULT 10,
  review_weight NUMERIC(3, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_modules_chapter_index ON modules(chapter_index);
CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);
CREATE INDEX IF NOT EXISTS idx_items_concept_id ON items(concept_id);

-- Enable Row Level Security (RLS)
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create policies to allow read access to all users (including anonymous)
CREATE POLICY "Allow public read access to modules" ON modules
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to lessons" ON lessons
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to items" ON items
  FOR SELECT USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

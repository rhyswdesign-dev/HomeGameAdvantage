-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  prep_time INTEGER NOT NULL,
  spirits TEXT[] DEFAULT '{}',
  glass_type TEXT,
  garnish TEXT,
  ingredients JSONB NOT NULL,
  instructions TEXT[] NOT NULL,
  tips TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_recipes_spirits ON recipes USING GIN(spirits);

-- Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to recipes"
  ON recipes
  FOR SELECT
  TO public
  USING (true);

-- Create policy to allow authenticated users to insert/update
CREATE POLICY "Allow authenticated users to manage recipes"
  ON recipes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add comments
COMMENT ON TABLE recipes IS 'Cocktail recipes with ingredients and instructions';
COMMENT ON COLUMN recipes.id IS 'Unique recipe identifier (kebab-case)';
COMMENT ON COLUMN recipes.name IS 'Display name of the cocktail';
COMMENT ON COLUMN recipes.category IS 'Recipe category (classics, modern, tiki, seasonal)';
COMMENT ON COLUMN recipes.difficulty IS 'Recipe difficulty (easy, medium, hard)';
COMMENT ON COLUMN recipes.prep_time IS 'Preparation time in minutes';
COMMENT ON COLUMN recipes.spirits IS 'Array of base spirits used';
COMMENT ON COLUMN recipes.glass_type IS 'Type of glassware to use';
COMMENT ON COLUMN recipes.garnish IS 'Garnish description';
COMMENT ON COLUMN recipes.ingredients IS 'JSON array of ingredients with amounts and types';
COMMENT ON COLUMN recipes.instructions IS 'Step-by-step preparation instructions';
COMMENT ON COLUMN recipes.tips IS 'Pro tips and suggestions';
COMMENT ON COLUMN recipes.tags IS 'Searchable tags for filtering';
COMMENT ON COLUMN recipes.image_url IS 'Reference to recipe image';
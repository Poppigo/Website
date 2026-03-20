-- Add size_images column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS size_images JSONB DEFAULT '[]'::jsonb;

-- Add description column if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;

-- Add pack configuration columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS enable_packs BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS pack_links JSONB DEFAULT '{}'::jsonb;
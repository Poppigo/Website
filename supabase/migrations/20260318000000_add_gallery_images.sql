-- Add gallery_images column to products table for multi-image gallery support
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;

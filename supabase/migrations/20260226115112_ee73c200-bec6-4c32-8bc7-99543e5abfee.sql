
-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Allow public read access
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow admin to upload product images
CREATE POLICY "Admin can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

-- Allow admin to update product images
CREATE POLICY "Admin can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND public.is_admin());

-- Allow admin to delete product images
CREATE POLICY "Admin can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND public.is_admin());

-- Add shipping_address column to orders for checkout address data
ALTER TABLE public.orders ADD COLUMN shipping_address jsonb DEFAULT '{}'::jsonb;

-- Add user_id to orders so users can track their orders
ALTER TABLE public.orders ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Create RLS policy for users to view their own orders
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

-- Drop the old restrictive SELECT policy that only allowed admin
DROP POLICY IF EXISTS "Admin can view all orders" ON public.orders;

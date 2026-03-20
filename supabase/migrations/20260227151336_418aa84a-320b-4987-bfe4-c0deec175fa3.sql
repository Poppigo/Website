
-- Add size column to reviews
ALTER TABLE public.reviews ADD COLUMN size TEXT;

-- Drop old unique constraint and create new one including size
ALTER TABLE public.reviews DROP CONSTRAINT reviews_product_id_user_id_order_id_key;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_product_order_user_size_key UNIQUE (product_id, user_id, order_id, size);


-- Add payment_method column to orders table
ALTER TABLE public.orders ADD COLUMN payment_method text NOT NULL DEFAULT 'online';

-- Add a comment for clarity
COMMENT ON COLUMN public.orders.payment_method IS 'Payment method: online or cod';

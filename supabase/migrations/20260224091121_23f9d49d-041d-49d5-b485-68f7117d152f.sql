
-- Create a function to check if user is admin by email
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
      AND email = 'mastershauryatyagi@gmail.com'
  )
$$;

-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  discount INTEGER DEFAULT 0,
  image_url TEXT,
  category TEXT DEFAULT 'Poppigo Product',
  sizes TEXT[] DEFAULT '{"S-M"}',
  stock INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can view active products
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = true OR public.is_admin());

-- Admin can insert products
CREATE POLICY "Admin can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

-- Admin can update products
CREATE POLICY "Admin can update products"
  ON public.products FOR UPDATE
  USING (public.is_admin());

-- Admin can delete products
CREATE POLICY "Admin can delete products"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Processing',
  items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Admin can view all orders
CREATE POLICY "Admin can view all orders"
  ON public.orders FOR SELECT
  USING (public.is_admin());

-- Admin can update orders
CREATE POLICY "Admin can update orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- Anyone authenticated can create orders (for checkout)
CREATE POLICY "Authenticated users can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  total_orders INTEGER DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view all customers"
  ON public.customers FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin can manage customers"
  ON public.customers FOR ALL
  USING (public.is_admin());

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed some initial products
INSERT INTO public.products (name, price, original_price, discount, category, sizes) VALUES
  ('PoppiGo Ultra-Slim Disposable Period Panty (1 Pack – 6 Pieces)', 339, 399, 15, 'Poppigo Product', '{"S-M"}'),
  ('Poppigo Ultra-Slim Period Panty For Girls & Women', 339, 459, 26, 'Poppigo Product', '{"S-M","L-XL","2XL-3XL"}'),
  ('Poppigo Ultra-Slim Period Panty For Girls & Women | Pack of 2', 598, 799, 25, 'Poppigo Product', '{"S-M","L-XL","2XL-3XL"}'),
  ('Poppigo Ultra-Slim Period Panty For Girls & Women | Pack of 3', 887, 1199, 26, 'Poppigo Product', '{"S-M","L-XL","2XL-3XL"}');

-- Seed some sample orders
INSERT INTO public.orders (order_number, customer_name, customer_email, amount, status) VALUES
  ('#1042', 'Priya Sharma', 'priya@example.com', 678, 'Delivered'),
  ('#1041', 'Neha Gupta', 'neha@example.com', 339, 'Shipped'),
  ('#1040', 'Riya Patel', 'riya@example.com', 887, 'Processing'),
  ('#1039', 'Ananya Singh', 'ananya@example.com', 598, 'Delivered'),
  ('#1038', 'Kavya Reddy', 'kavya@example.com', 339, 'Delivered');

-- Seed some sample customers
INSERT INTO public.customers (name, email, total_orders, total_spent) VALUES
  ('Priya Sharma', 'priya@example.com', 3, 1355),
  ('Neha Gupta', 'neha@example.com', 2, 678),
  ('Riya Patel', 'riya@example.com', 1, 887),
  ('Ananya Singh', 'ananya@example.com', 4, 2390),
  ('Kavya Reddy', 'kavya@example.com', 2, 678);

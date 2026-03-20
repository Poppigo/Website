
-- Create admin_emails table
CREATE TABLE public.admin_emails (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

-- Only existing admins can manage admin emails (bootstrap with first entry)
CREATE POLICY "Admins can view admin_emails" ON public.admin_emails FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_emails ae WHERE ae.email = (SELECT auth.email()))
);
CREATE POLICY "Admins can manage admin_emails" ON public.admin_emails FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_emails ae WHERE ae.email = (SELECT auth.email()))
);

-- Seed current admin
INSERT INTO public.admin_emails (email) VALUES ('mastershauryatyagi@gmail.com');

-- Update is_admin() to use the table
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_emails ae
    INNER JOIN auth.users u ON u.id = auth.uid()
    WHERE ae.email = u.email
  )
$$;

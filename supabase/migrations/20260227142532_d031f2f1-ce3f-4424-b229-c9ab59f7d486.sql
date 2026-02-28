
CREATE POLICY "Anyone can submit lead form"
ON public.customers
FOR INSERT
WITH CHECK (user_id IS NULL);

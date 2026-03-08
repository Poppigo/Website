-- Add marketing opt-in flag to customers
-- Default TRUE so all existing customers remain opted in
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS marketing_opt_in BOOLEAN NOT NULL DEFAULT TRUE;

COMMENT ON COLUMN public.customers.marketing_opt_in IS
  'Whether the customer has opted in to marketing messages (WhatsApp, email, SMS). Defaults to true; can be set to false via unsubscribe link.';

-- Allow customers to update their own opt-in status (used by the opt-out edge function via service role,
-- but this policy also lets a logged-in user toggle it from the front-end if needed)
CREATE POLICY "Customers can update own opt-in"
  ON public.customers FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

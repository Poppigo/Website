-- Add whatsapp_opt_in column to customers (separate from marketing_opt_in)
ALTER TABLE customers ADD COLUMN IF NOT EXISTS whatsapp_opt_in boolean NOT NULL DEFAULT true;

-- Create followups table for scheduled WhatsApp follow-up messages
CREATE TABLE IF NOT EXISTS followups (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      uuid        REFERENCES orders(id) ON DELETE CASCADE,
  order_number  text,
  customer_name text        NOT NULL,
  customer_phone text       NOT NULL,
  message       text        NOT NULL,
  scheduled_at  timestamptz NOT NULL,
  sent          boolean     NOT NULL DEFAULT false,
  sent_at       timestamptz,
  error_message text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE followups ENABLE ROW LEVEL SECURITY;

-- Admins can do everything; regular users cannot access this table
CREATE POLICY "Admin full access on followups"
  ON followups FOR ALL
  USING (is_admin());

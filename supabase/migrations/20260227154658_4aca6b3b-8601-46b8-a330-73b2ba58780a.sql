
-- Campaign table for promotional emails and WhatsApp messages
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'email', -- 'email', 'whatsapp', 'sms'
  message_subject TEXT, -- email subject
  message_body TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT 'all', -- 'all', 'with_orders', 'no_orders'
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'sending', 'sent', 'failed'
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage campaigns"
  ON public.campaigns FOR ALL
  USING (is_admin());

CREATE POLICY "Admin can view campaigns"
  ON public.campaigns FOR SELECT
  USING (is_admin());

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Campaign logs to track individual message delivery
CREATE TABLE public.campaign_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  follow_up_rule_id UUID, -- populated for automated follow-ups
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  channel TEXT NOT NULL, -- 'email', 'whatsapp', 'sms'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed'
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.campaign_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage campaign_logs"
  ON public.campaign_logs FOR ALL
  USING (is_admin());

CREATE POLICY "Admin can view campaign_logs"
  ON public.campaign_logs FOR SELECT
  USING (is_admin());

-- Follow-up rules for automated post-purchase messages
CREATE TABLE public.follow_up_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'whatsapp', -- 'email', 'whatsapp', 'sms'
  trigger_type TEXT NOT NULL DEFAULT 'post_purchase', -- 'post_purchase', 'no_orders'
  delay_days INTEGER NOT NULL DEFAULT 7, -- days after trigger event
  message_subject TEXT, -- for email
  message_body TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.follow_up_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage follow_up_rules"
  ON public.follow_up_rules FOR ALL
  USING (is_admin());

CREATE POLICY "Admin can view follow_up_rules"
  ON public.follow_up_rules FOR SELECT
  USING (is_admin());

CREATE TRIGGER update_follow_up_rules_updated_at
  BEFORE UPDATE ON public.follow_up_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key for campaign_logs -> follow_up_rules
ALTER TABLE public.campaign_logs 
  ADD CONSTRAINT campaign_logs_follow_up_rule_fkey 
  FOREIGN KEY (follow_up_rule_id) REFERENCES public.follow_up_rules(id) ON DELETE SET NULL;

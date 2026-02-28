-- Add mobile_no to customers
ALTER TABLE public.customers ADD COLUMN mobile_no text;

-- Create trigger to auto-create customer on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
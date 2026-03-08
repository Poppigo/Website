import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { normalizePhone } from "@/lib/utils";

const leadSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  mobile_no: z.string().trim().min(10, "Enter a valid phone number").max(15),
});

const LeadGenPopup = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", mobile_no: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) return;
    const dismissed = sessionStorage.getItem("lead_popup_dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setOpen(true), 3000);
    return () => clearTimeout(timer);
  }, [user]);

  if (!open || user) return null;

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("lead_popup_dismissed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = leadSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("customers").insert({
      name: result.data.name,
      email: result.data.email,
      mobile_no: normalizePhone(result.data.mobile_no),
    });
    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        toast({ title: "You're already registered!", description: "Thanks for your interest." });
        setSubmitted(true);
      } else {
        toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
      }
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-[90%] max-w-md rounded-2xl bg-background border border-border p-6 shadow-2xl animate-in zoom-in-95">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <h2 className="text-2xl font-bold text-foreground">Thank You! 🎉</h2>
            <p className="text-muted-foreground">We'll keep you updated with the latest drops and offers.</p>
            <Button onClick={handleClose} className="mt-4">Close</Button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-foreground mb-1">Stay in the loop!</h2>
            <p className="text-sm text-muted-foreground mb-5">Get exclusive offers & early access. No spam, we promise.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="lead-name">Name</Label>
                <Input
                  id="lead-name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="lead-email">Email</Label>
                <Input
                  id="lead-email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="lead-phone">Phone Number</Label>
                <Input
                  id="lead-phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={form.mobile_no}
                  onChange={(e) => setForm({ ...form, mobile_no: e.target.value })}
                />
                {errors.mobile_no && <p className="text-xs text-destructive mt-1">{errors.mobile_no}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LeadGenPopup;

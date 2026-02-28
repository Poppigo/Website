import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Send, Plus, Clock, Mail, MessageSquare, Phone, Trash2, Pencil,
  Loader2, AlertCircle, CheckCircle2, RefreshCw, Eye,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Campaign {
  id: string; title: string; channel: string; message_subject: string | null;
  message_body: string; audience: string; status: string;
  sent_count: number; failed_count: number;
  scheduled_at: string | null; sent_at: string | null; created_at: string;
}

interface FollowUpRule {
  id: string; name: string; channel: string; trigger_type: string;
  delay_days: number; message_subject: string | null; message_body: string;
  is_active: boolean; created_at: string;
}

interface CampaignLog {
  id: string; campaign_id: string | null; follow_up_rule_id: string | null;
  customer_email: string; customer_name: string | null;
  channel: string; status: string; error_message: string | null;
  sent_at: string | null; created_at: string;
}

const channelIcon = (channel: string) => {
  switch (channel) {
    case "whatsapp": return <MessageSquare size={14} className="text-green-600" />;
    case "sms": return <Phone size={14} className="text-blue-600" />;
    default: return <Mail size={14} className="text-primary" />;
  }
};

const channelBadge = (channel: string) => {
  const colors: Record<string, string> = {
    email: "bg-primary/10 text-primary",
    whatsapp: "bg-green-100 text-green-700",
    sms: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors[channel] || "bg-muted text-muted-foreground"}`}>
      {channelIcon(channel)} {channel.charAt(0).toUpperCase() + channel.slice(1)}
    </span>
  );
};

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    sending: "bg-amber-100 text-amber-700",
    sent: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    pending: "bg-amber-100 text-amber-700",
    delivered: "bg-green-100 text-green-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[status] || "bg-muted text-muted-foreground"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const emptyCampaign = {
  title: "", channel: "email" as string, message_subject: "", message_body: "", audience: "all" as string,
};

const emptyRule = {
  name: "", channel: "whatsapp" as string, trigger_type: "post_purchase" as string,
  delay_days: 7, message_subject: "", message_body: "", is_active: true,
};

const TEMPLATE_VARS_HELP = "Available variables: {{customer_name}}, {{order_number}}, {{product_names}}, {{order_date}}";

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [rules, setRules] = useState<FollowUpRule[]>([]);
  const [logs, setLogs] = useState<CampaignLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [campaignDialog, setCampaignDialog] = useState(false);
  const [campaignForm, setCampaignForm] = useState(emptyCampaign);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const [ruleDialog, setRuleDialog] = useState(false);
  const [ruleForm, setRuleForm] = useState(emptyRule);
  const [editingRule, setEditingRule] = useState<FollowUpRule | null>(null);

  const [logsDialog, setLogsDialog] = useState(false);
  const [viewingCampaignId, setViewingCampaignId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [processingFollowUps, setProcessingFollowUps] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const [campRes, rulesRes, logsRes] = await Promise.all([
      supabase.from("campaigns").select("*").order("created_at", { ascending: false }),
      supabase.from("follow_up_rules").select("*").order("created_at", { ascending: false }),
      supabase.from("campaign_logs").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    if (campRes.data) setCampaigns(campRes.data as Campaign[]);
    if (rulesRes.data) setRules(rulesRes.data as FollowUpRule[]);
    if (logsRes.data) setLogs(logsRes.data as CampaignLog[]);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // ---- Campaign CRUD ----
  const openAddCampaign = () => { setEditingCampaign(null); setCampaignForm(emptyCampaign); setCampaignDialog(true); };
  const openEditCampaign = (c: Campaign) => {
    setEditingCampaign(c);
    setCampaignForm({ title: c.title, channel: c.channel, message_subject: c.message_subject || "", message_body: c.message_body, audience: c.audience });
    setCampaignDialog(true);
  };

  const handleSaveCampaign = async () => {
    if (!campaignForm.title.trim() || !campaignForm.message_body.trim()) {
      toast.error("Title and message body are required"); return;
    }
    const payload = {
      title: campaignForm.title.trim(),
      channel: campaignForm.channel,
      message_subject: campaignForm.channel === "email" ? campaignForm.message_subject.trim() || null : null,
      message_body: campaignForm.message_body.trim(),
      audience: campaignForm.audience,
    };
    if (editingCampaign) {
      const { error } = await supabase.from("campaigns").update(payload).eq("id", editingCampaign.id);
      if (error) { toast.error("Failed to update"); return; }
      toast.success("Campaign updated");
    } else {
      const { error } = await supabase.from("campaigns").insert(payload);
      if (error) { toast.error("Failed to create"); return; }
      toast.success("Campaign created");
    }
    setCampaignDialog(false);
    fetchAll();
  };

  const handleDeleteCampaign = async (id: string) => {
    const { error } = await supabase.from("campaigns").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Campaign deleted");
    fetchAll();
  };

  const handleSendCampaign = async (campaign: Campaign) => {
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-msg91", {
        body: { type: "campaign", campaign_id: campaign.id },
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      toast.success(data?.message || "Campaign is being sent!");
      fetchAll();
    } catch (err: any) {
      toast.error(err.message || "Failed to send campaign");
    } finally {
      setSending(false);
    }
  };

  // ---- Follow-up Rules CRUD ----
  const openAddRule = () => { setEditingRule(null); setRuleForm(emptyRule); setRuleDialog(true); };
  const openEditRule = (r: FollowUpRule) => {
    setEditingRule(r);
    setRuleForm({
      name: r.name, channel: r.channel, trigger_type: r.trigger_type,
      delay_days: r.delay_days, message_subject: r.message_subject || "",
      message_body: r.message_body, is_active: r.is_active,
    });
    setRuleDialog(true);
  };

  const handleSaveRule = async () => {
    if (!ruleForm.name.trim() || !ruleForm.message_body.trim()) {
      toast.error("Name and message body are required"); return;
    }
    const payload = {
      name: ruleForm.name.trim(),
      channel: ruleForm.channel,
      trigger_type: ruleForm.trigger_type,
      delay_days: ruleForm.delay_days,
      message_subject: ruleForm.channel === "email" ? ruleForm.message_subject.trim() || null : null,
      message_body: ruleForm.message_body.trim(),
      is_active: ruleForm.is_active,
    };
    if (editingRule) {
      const { error } = await supabase.from("follow_up_rules").update(payload).eq("id", editingRule.id);
      if (error) { toast.error("Failed to update"); return; }
      toast.success("Rule updated");
    } else {
      const { error } = await supabase.from("follow_up_rules").insert(payload);
      if (error) { toast.error("Failed to create"); return; }
      toast.success("Rule created");
    }
    setRuleDialog(false);
    fetchAll();
  };

  const handleDeleteRule = async (id: string) => {
    const { error } = await supabase.from("follow_up_rules").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Rule deleted");
    fetchAll();
  };

  const handleToggleRule = async (rule: FollowUpRule) => {
    const { error } = await supabase.from("follow_up_rules").update({ is_active: !rule.is_active }).eq("id", rule.id);
    if (error) { toast.error("Failed to toggle"); return; }
    fetchAll();
  };

  const handleProcessFollowUps = async () => {
    setProcessingFollowUps(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-msg91", {
        body: { type: "process_follow_ups" },
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      toast.success(data?.message || "Follow-ups processed!");
      fetchAll();
    } catch (err: any) {
      toast.error(err.message || "Failed to process follow-ups");
    } finally {
      setProcessingFollowUps(false);
    }
  };

  const viewLogs = (campaignId: string) => {
    setViewingCampaignId(campaignId);
    setLogsDialog(true);
  };

  const filteredLogs = viewingCampaignId ? logs.filter((l) => l.campaign_id === viewingCampaignId) : logs;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* MSG91 Status Banner */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4 flex items-center gap-3">
          <AlertCircle size={20} className="text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">MSG91 Not Configured</p>
            <p className="text-xs text-amber-600">Add your MSG91 API keys to start sending campaigns. Campaigns can be drafted and saved now.</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="campaigns" className="text-xs sm:text-sm">Campaigns</TabsTrigger>
          <TabsTrigger value="follow-ups" className="text-xs sm:text-sm">Follow-ups</TabsTrigger>
          <TabsTrigger value="history" className="text-xs sm:text-sm">History</TabsTrigger>
        </TabsList>

        {/* ===== CAMPAIGNS TAB ===== */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-foreground">Promotional Campaigns</h3>
            <Button size="sm" onClick={openAddCampaign}><Plus size={14} className="mr-1" />New Campaign</Button>
          </div>

          {campaigns.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Send size={40} className="mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-muted-foreground text-sm">No campaigns yet. Create your first promotional campaign.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {campaigns.map((c) => (
                <Card key={c.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground truncate">{c.title}</h4>
                          {statusBadge(c.status)}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                          {channelBadge(c.channel)}
                          <span>Audience: {c.audience === "all" ? "All Customers" : c.audience === "with_orders" ? "With Orders" : "No Orders"}</span>
                          <span>{new Date(c.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{c.message_body}</p>
                        {c.status === "sent" && (
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            <span className="flex items-center gap-1 text-green-600"><CheckCircle2 size={12} />{c.sent_count} sent</span>
                            {c.failed_count > 0 && <span className="flex items-center gap-1 text-red-600"><AlertCircle size={12} />{c.failed_count} failed</span>}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {c.status === "sent" && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => viewLogs(c.id)} title="View Logs">
                            <Eye size={14} />
                          </Button>
                        )}
                        {c.status === "draft" && (
                          <>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditCampaign(c)} title="Edit">
                              <Pencil size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSendCampaign(c)} disabled={sending} title="Send Now">
                              {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteCampaign(c.id)} title="Delete">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ===== FOLLOW-UPS TAB ===== */}
        <TabsContent value="follow-ups" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-display text-base font-bold text-foreground">Follow-up Rules</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Define rules, then click "Run Follow-ups" to send messages to eligible customers.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleProcessFollowUps} disabled={processingFollowUps}>
                {processingFollowUps ? <Loader2 size={14} className="mr-1 animate-spin" /> : <Send size={14} className="mr-1" />}
                Run Follow-ups
              </Button>
              <Button size="sm" onClick={openAddRule}><Plus size={14} className="mr-1" />Add Rule</Button>
            </div>
          </div>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-3">
              <p className="text-xs text-blue-700">
                <strong>How it works:</strong> Follow-ups are not sent automatically. Click "Run Follow-ups" to check all active rules and send messages to customers who are due. Review requests are skipped for customers who already left a review.
              </p>
            </CardContent>
          </Card>

          {rules.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock size={40} className="mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-muted-foreground text-sm">No follow-up rules yet. Create automated messages for post-purchase engagement.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {rules.map((r) => (
                <Card key={r.id} className={!r.is_active ? "opacity-60" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground truncate">{r.name}</h4>
                          {channelBadge(r.channel)}
                          <Badge variant={r.is_active ? "default" : "secondary"} className="text-[10px]">
                            {r.is_active ? "Active" : "Paused"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock size={12} />{r.delay_days} days after {r.trigger_type === "post_purchase" ? "purchase" : "registration"}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{r.message_body}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleRule(r)} title={r.is_active ? "Pause" : "Activate"}>
                          {r.is_active ? <RefreshCw size={14} /> : <CheckCircle2 size={14} />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditRule(r)} title="Edit">
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteRule(r.id)} title="Delete">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ===== HISTORY TAB ===== */}
        <TabsContent value="history" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-foreground">Delivery History</h3>
            <Button variant="outline" size="sm" onClick={fetchAll}><RefreshCw size={14} className="mr-1" />Refresh</Button>
          </div>

          {logs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Mail size={40} className="mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-muted-foreground text-sm">No messages sent yet. Send a campaign to see delivery history.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="px-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.slice(0, 50).map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div>
                            <span className="font-medium text-foreground">{log.customer_name || "—"}</span>
                            <p className="text-xs text-muted-foreground">{log.customer_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{channelBadge(log.channel)}</TableCell>
                        <TableCell>{statusBadge(log.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {log.sent_at ? new Date(log.sent_at).toLocaleString() : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* ===== CAMPAIGN DIALOG ===== */}
      <Dialog open={campaignDialog} onOpenChange={setCampaignDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCampaign ? "Edit Campaign" : "New Campaign"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Campaign Title</Label>
              <Input value={campaignForm.title} onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })} placeholder="e.g. Festive Season Sale" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Channel</Label>
                <select value={campaignForm.channel} onChange={(e) => setCampaignForm({ ...campaignForm, channel: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="email">📧 Email</option>
                  <option value="whatsapp">💬 WhatsApp</option>
                  <option value="sms">📱 SMS</option>
                </select>
              </div>
              <div>
                <Label>Audience</Label>
                <select value={campaignForm.audience} onChange={(e) => setCampaignForm({ ...campaignForm, audience: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="all">All Customers</option>
                  <option value="with_orders">Customers with Orders</option>
                  <option value="no_orders">Registered, No Orders</option>
                </select>
              </div>
            </div>
            {campaignForm.channel === "email" && (
              <div>
                <Label>Email Subject</Label>
                <Input value={campaignForm.message_subject} onChange={(e) => setCampaignForm({ ...campaignForm, message_subject: e.target.value })} placeholder="e.g. 🎉 Flat 30% Off on PoppiGo!" />
              </div>
            )}
            <div>
              <Label>Message Body</Label>
              <Textarea value={campaignForm.message_body} onChange={(e) => setCampaignForm({ ...campaignForm, message_body: e.target.value })}
                placeholder={campaignForm.channel === "whatsapp" ? "Hi {{customer_name}}, we have an exciting offer for you!" : "Write your promotional message here..."}
                rows={5} />
              <p className="text-xs text-muted-foreground mt-1">{TEMPLATE_VARS_HELP}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCampaignDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveCampaign}>{editingCampaign ? "Update" : "Save Draft"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== FOLLOW-UP RULE DIALOG ===== */}
      <Dialog open={ruleDialog} onOpenChange={setRuleDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingRule ? "Edit Follow-up Rule" : "New Follow-up Rule"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Rule Name</Label>
              <Input value={ruleForm.name} onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })} placeholder="e.g. 7-Day Review Reminder" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Channel</Label>
                <select value={ruleForm.channel} onChange={(e) => setRuleForm({ ...ruleForm, channel: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="whatsapp">💬 WhatsApp</option>
                  <option value="email">📧 Email</option>
                  <option value="sms">📱 SMS</option>
                </select>
              </div>
              <div>
                <Label>Trigger</Label>
                <select value={ruleForm.trigger_type} onChange={(e) => setRuleForm({ ...ruleForm, trigger_type: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="post_purchase">After Purchase</option>
                  <option value="no_orders">Registered, No Orders</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Delay (days after trigger)</Label>
              <Input type="number" min={1} value={ruleForm.delay_days} onChange={(e) => setRuleForm({ ...ruleForm, delay_days: Number(e.target.value) })} />
              <p className="text-xs text-muted-foreground mt-1">
                {ruleForm.trigger_type === "post_purchase"
                  ? `Message will be sent ${ruleForm.delay_days} day(s) after order is delivered`
                  : `Message will be sent ${ruleForm.delay_days} day(s) after registration with no purchase`}
              </p>
            </div>
            {ruleForm.channel === "email" && (
              <div>
                <Label>Email Subject</Label>
                <Input value={ruleForm.message_subject} onChange={(e) => setRuleForm({ ...ruleForm, message_subject: e.target.value })} placeholder="e.g. How's your PoppiGo experience?" />
              </div>
            )}
            <div>
              <Label>Message Body</Label>
              <Textarea value={ruleForm.message_body} onChange={(e) => setRuleForm({ ...ruleForm, message_body: e.target.value })}
                placeholder="Hi {{customer_name}}, it's been {{delay_days}} days since your order {{order_number}}. We'd love to hear your feedback!"
                rows={5} />
              <p className="text-xs text-muted-foreground mt-1">{TEMPLATE_VARS_HELP}</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={ruleForm.is_active} onChange={(e) => setRuleForm({ ...ruleForm, is_active: e.target.checked })} className="rounded" id="rule_active" />
              <Label htmlFor="rule_active">Enabled (included when you click "Run Follow-ups")</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRuleDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveRule}>{editingRule ? "Update" : "Create Rule"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== LOGS DIALOG ===== */}
      <Dialog open={logsDialog} onOpenChange={setLogsDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Delivery Logs</DialogTitle></DialogHeader>
          {filteredLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No logs found for this campaign.</p>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Error</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">{log.customer_email}</TableCell>
                      <TableCell>{statusBadge(log.status)}</TableCell>
                      <TableCell className="text-xs text-red-600 max-w-[150px] truncate">{log.error_message || "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{log.sent_at ? new Date(log.sent_at).toLocaleString() : "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminCampaigns;

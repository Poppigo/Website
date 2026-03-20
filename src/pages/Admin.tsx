import React, { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  TrendingUp, DollarSign, LogOut, Menu, X, ChevronRight, Plus, Pencil, Trash2, Upload, Loader2, Tag, Banknote, Star, MessageSquare, Send, RefreshCw, Mail,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Admin check is done via the is_admin() database function

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
  { icon: ShoppingCart, label: "Orders", key: "orders" },
  { icon: Package, label: "Products", key: "products" },
  { icon: Users, label: "Customers", key: "customers" },
  { icon: Settings, label: "Coupons", key: "coupons" },
  { icon: Star, label: "Testimonials", key: "testimonials" },
  { icon: Mail, label: "Email", key: "email" },
  { icon: MessageSquare, label: "WhatsApp", key: "whatsapp" },
];

const statusColor: Record<string, string> = {
  Pending: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-700",
};

interface Product {
  id: string; name: string; price: number; original_price: number | null;
  description: string | null; image_url: string | null; category: string | null;
  sizes: string[] | null; size_images: Record<string, string> | null; stock: number | null; is_active: boolean | null; created_at: string;
  enable_packs: boolean | null; pack_links: Record<string, string> | null;
  gallery_images: string[] | null;
}
const calcDiscount = (price: number, original: number | null) =>
  original && original > price ? Math.round(((original - price) / original) * 100) : 0;
interface Order {
  id: string; order_number: string; customer_name: string; customer_email: string;
  amount: number; status: string; created_at: string; items: any;
  shipping_address: any; mobile_no: string | null; payment_method: string;
}
interface Customer {
  id: string; name: string; email: string; total_orders: number | null;
  total_spent: number | null; created_at: string; marketing_opt_in: boolean | null;
}
interface Coupon {
  id: string; code: string; type: string; value: number;
  min_order_amount: number; max_uses: number | null; used_count: number;
  is_active: boolean; expires_at: string | null; created_at: string;
}
interface Testimonial {
  id: string; sort_order: number; name: string; size: string;
  rating: number; comment: string; is_active: boolean; created_at: string;
}
const emptyProduct = {
  name: "", price: 0, original_price: 0, description: "", image_url: "",
  category: "Poppigo Product", sizes: "S-M", size_images: {}, stock: 100, is_active: true,
  enable_packs: false, pack_links: {}, gallery_images: [] as string[],
};
const emptyTestimonial = { name: "", size: "", rating: 5, comment: "", is_active: true };

const emptyCoupon = {
  code: "", type: "percentage" as string, value: 0, min_order_amount: 0,
  max_uses: "" as string | number, is_active: true, expires_at: "",
};

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Cache refs — prevent refetches on every tab switch
  const isFirstLoad = useRef(true);
  const whatsappFetched = useRef(false);
  const emailFetched = useRef(false);

  // Testimonial dialog state
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonial);
  const [deleteTestimonialDialogOpen, setDeleteTestimonialDialogOpen] = useState(false);
  const [deletingTestimonial, setDeletingTestimonial] = useState<Testimonial | null>(null);

  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const sizeImageRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponForm, setCouponForm] = useState(emptyCoupon);
  const [deleteCouponDialogOpen, setDeleteCouponDialogOpen] = useState(false);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);

  // WhatsApp state
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [followupsRunning, setFollowupsRunning] = useState(false);
  const [followupsStats, setFollowupsStats] = useState<{ pending: number; sent: number } | null>(null);
  const [recentFollowups, setRecentFollowups] = useState<any[]>([]);
  const [optedInCount, setOptedInCount] = useState<number | null>(null);

  // Email state
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailPreviewText, setEmailPreviewText] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailOptedInCount, setEmailOptedInCount] = useState<number | null>(null);

  const fetchWhatsappStats = async () => {
    const [pendingRes, sentRes, optedRes] = await Promise.all([
      supabase.from("followups").select("id", { count: "exact", head: true }).eq("sent", false),
      supabase.from("followups").select("id", { count: "exact", head: true }).eq("sent", true),
      supabase.from("customers").select("id", { count: "exact", head: true }).eq("whatsapp_opt_in", true),
    ]);
    setFollowupsStats({ pending: pendingRes.count ?? 0, sent: sentRes.count ?? 0 });
    setOptedInCount(optedRes.count ?? 0);
    const { data } = await supabase
      .from("followups")
      .select("*")
      .order("scheduled_at", { ascending: true })
      .limit(20);
    setRecentFollowups(data ?? []);
    whatsappFetched.current = true;
  };

  const handleRunFollowups = async () => {
    setFollowupsRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke("whatsapp-notify", {
        body: { type: "run_followups" },
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      toast.success(data.message ?? "Follow-ups processed");
      fetchWhatsappStats();
    } catch (err: any) {
      toast.error(err.message || "Failed to run follow-ups");
    } finally {
      setFollowupsRunning(false);
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) { toast.error("Message cannot be empty"); return; }
    setBroadcastSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("whatsapp-notify", {
        body: { type: "broadcast", message: broadcastMessage },
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      toast.success(data.message ?? "Broadcast sent");
      setBroadcastMessage("");
    } catch (err: any) {
      toast.error(err.message || "Failed to send broadcast");
    } finally {
      setBroadcastSending(false);
    }
  };

  const fetchEmailStats = async () => {
    const { count } = await supabase
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("marketing_opt_in", true);
    setEmailOptedInCount(count ?? 0);
    emailFetched.current = true;
  };

  const handleSendEmail = async () => {
    if (!emailSubject.trim()) { toast.error("Subject is required"); return; }
    if (!emailBody.trim()) { toast.error("Body is required"); return; }
    setEmailSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: { subject: emailSubject, body: emailBody, previewText: emailPreviewText },
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      toast.success(data.message ?? "Emails sent!");
      setEmailSubject("");
      setEmailBody("");
      setEmailPreviewText("");
    } catch (err: any) {
      toast.error(err.message || "Failed to send emails");
    } finally {
      setEmailSending(false);
    }
  };

  // Load tab-specific stats when switching tabs — only once per session unless explicitly refreshed
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === "whatsapp" && !whatsappFetched.current) fetchWhatsappStats();
    if (key === "email" && !emailFetched.current) fetchEmailStats();
  };

  const fetchData = async () => {
    // Only show the full-page spinner on the very first load.
    // Subsequent calls (after mutations) silently update data in the background.
    if (isFirstLoad.current) setDataLoading(true);
    const [prodRes, ordRes, custRes, coupRes, testRes] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("customers").select("*").order("created_at", { ascending: false }),
      supabase.from("coupons").select("*").order("created_at", { ascending: false }),
      supabase.from("homepage_testimonials").select("*").order("sort_order", { ascending: true }),
    ]);
    if (prodRes.data) setProducts(prodRes.data as Product[]);
    if (ordRes.data) setOrders(ordRes.data as Order[]);
    if (custRes.data) setCustomers(custRes.data as unknown as Customer[]);
    if (coupRes.data) setCoupons(coupRes.data as Coupon[]);
    if (testRes.data) setTestimonials(testRes.data as Testimonial[]);
    setDataLoading(false);
    isFirstLoad.current = false;
  };

  const handleSaveTestimonial = async () => {
    if (!testimonialForm.name.trim()) { toast.error("Name is required"); return; }
    if (!testimonialForm.comment.trim()) { toast.error("Comment is required"); return; }
    const payload = { ...testimonialForm };
    if (editingTestimonial) {
      const { error } = await supabase.from("homepage_testimonials").update(payload).eq("id", editingTestimonial.id);
      if (error) { toast.error("Failed to update testimonial"); return; }
      toast.success("Testimonial updated!");
    } else {
      const maxOrder = testimonials.reduce((m, t) => Math.max(m, t.sort_order), 0);
      const { error } = await supabase.from("homepage_testimonials").insert({ ...payload, sort_order: maxOrder + 1 });
      if (error) { toast.error("Failed to add testimonial"); return; }
      toast.success("Testimonial added!");
    }
    setTestimonialDialogOpen(false);
    fetchData();
  };

  const handleDeleteTestimonial = async () => {
    if (!deletingTestimonial) return;
    const { error } = await supabase.from("homepage_testimonials").delete().eq("id", deletingTestimonial.id);
    if (error) { toast.error("Failed to delete testimonial"); return; }
    toast.success("Testimonial deleted!");
    setDeleteTestimonialDialogOpen(false);
    setDeletingTestimonial(null);
    fetchData();
  };

  const handleToggleOptIn = async (customerId: string, current: boolean | null) => {
    const newVal = !(current ?? true);
    const { error } = await supabase
      .from("customers")
      .update({ marketing_opt_in: newVal } as any)
      .eq("id", customerId);
    if (error) { toast.error("Failed to update opt-in status"); return; }
    setCustomers((prev) =>
      prev.map((c) => c.id === customerId ? { ...c, marketing_opt_in: newVal } : c)
    );
    toast.success(newVal ? "Customer opted in to marketing" : "Customer opted out of marketing");
  };

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;
      const { data } = await supabase.rpc("is_admin");
      setIsAdmin(!!data);
      if (data) fetchData();
    };
    checkAdmin();
  }, [user]);

  const openAddProduct = () => { setEditingProduct(null); setProductForm(emptyProduct); setProductDialogOpen(true); };
  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name, price: p.price, original_price: p.original_price ?? 0,
      description: p.description ?? "", image_url: p.image_url ?? "",
      category: p.category ?? "Poppigo Product", sizes: (p.sizes ?? ["S-M"]).join(", "),
      size_images: p.size_images ?? {}, stock: p.stock ?? 0, is_active: p.is_active ?? true,
      enable_packs: p.enable_packs ?? false, pack_links: p.pack_links ?? {},
      gallery_images: (p.gallery_images as string[] | null) ?? [],
    });
    setProductDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be less than 5MB"); return; }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(fileName);
      setProductForm((prev) => ({ ...prev, image_url: publicUrl.publicUrl }));
      toast.success("Image uploaded!");
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSizeImageUpload = async (size: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be less than 5MB"); return; }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(fileName);
      setProductForm((prev) => ({
        ...prev,
        size_images: { ...prev.size_images, [size]: publicUrl.publicUrl }
      }));
      toast.success(`Image uploaded for size ${size}!`);
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be less than 5MB"); return; }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(fileName);
      setProductForm((prev) => ({
        ...prev,
        gallery_images: [...(prev.gallery_images || []), publicUrl.publicUrl],
      }));
      toast.success("Gallery image uploaded!");
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = "";
    }
  };

  const handleSaveProduct = async () => {
    const payload = {
      name: productForm.name, price: productForm.price,
      original_price: productForm.original_price || null,
      description: productForm.description || null,
      image_url: productForm.image_url || null,
      category: productForm.category,
      sizes: productForm.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      size_images: productForm.size_images,
      stock: productForm.stock, is_active: productForm.is_active,
      enable_packs: productForm.enable_packs,
      pack_links: productForm.pack_links,
      gallery_images: productForm.gallery_images ?? [],
    };
    if (editingProduct) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingProduct.id);
      if (error) { toast.error("Failed to update product"); return; }
      toast.success("Product updated!");
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast.error("Failed to add product"); return; }
      toast.success("Product added!");
    }
    setProductDialogOpen(false);
    fetchData();
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    const { error } = await supabase.from("products").delete().eq("id", deletingProduct.id);
    if (error) { toast.error("Failed to delete product"); return; }
    toast.success("Product deleted!");
    setDeleteDialogOpen(false);
    setDeletingProduct(null);
    fetchData();
  };

  const openAddCoupon = () => { setEditingCoupon(null); setCouponForm(emptyCoupon); setCouponDialogOpen(true); };
  const openEditCoupon = (c: Coupon) => {
    setEditingCoupon(c);
    setCouponForm({
      code: c.code, type: c.type, value: c.value,
      min_order_amount: c.min_order_amount, max_uses: c.max_uses ?? "",
      is_active: c.is_active, expires_at: c.expires_at ? c.expires_at.slice(0, 16) : "",
    });
    setCouponDialogOpen(true);
  };

  const handleSaveCoupon = async () => {
    if (!couponForm.code.trim()) { toast.error("Coupon code is required"); return; }
    if (couponForm.value <= 0) { toast.error("Value must be greater than 0"); return; }
    const payload: any = {
      code: couponForm.code.toUpperCase().trim(),
      type: couponForm.type,
      value: couponForm.value,
      min_order_amount: couponForm.min_order_amount || 0,
      max_uses: couponForm.max_uses === "" ? null : Number(couponForm.max_uses),
      is_active: couponForm.is_active,
      expires_at: couponForm.expires_at ? new Date(couponForm.expires_at).toISOString() : null,
    };
    if (editingCoupon) {
      const { error } = await supabase.from("coupons").update(payload).eq("id", editingCoupon.id);
      if (error) { toast.error("Failed to update coupon"); return; }
      toast.success("Coupon updated!");
    } else {
      const { error } = await supabase.from("coupons").insert(payload);
      if (error) { toast.error(error.message.includes("duplicate") ? "Coupon code already exists" : "Failed to add coupon"); return; }
      toast.success("Coupon added!");
    }
    setCouponDialogOpen(false);
    fetchData();
  };

  const handleDeleteCoupon = async () => {
    if (!deletingCoupon) return;
    const { error } = await supabase.from("coupons").delete().eq("id", deletingCoupon.id);
    if (error) { toast.error("Failed to delete coupon"); return; }
    toast.success("Coupon deleted!");
    setDeleteCouponDialogOpen(false);
    setDeletingCoupon(null);
    fetchData();
  };

  // Exclude Pending (unpaid) orders from financial stats
  const confirmedOrders = orders.filter((o) => o.status !== "Pending");
  const totalSales = confirmedOrders.reduce((sum, o) => sum + Number(o.amount), 0);
  const totalOrders = confirmedOrders.length;
  const totalCustomers = customers.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  const stats = [
    { label: "Total Sales", value: `₹${totalSales.toLocaleString()}`, icon: DollarSign },
    { label: "Orders", value: String(totalOrders), icon: ShoppingCart },
    { label: "Customers", value: String(totalCustomers), icon: Users },
    { label: "Avg Order", value: `₹${avgOrderValue}`, icon: TrendingUp },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (isAdmin === null) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="max-w-md w-full text-center">
          <CardHeader><CardTitle className="text-destructive">Access Denied</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">You don't have admin privileges.</p>
            <a href="/" className="text-primary font-semibold hover:underline">← Back to Home</a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {sidebarOpen && <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-secondary text-secondary-foreground flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="font-body text-xl font-bold !text-white">PoppiGo Admin</h1>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {sidebarItems.map((item) => (
            <button key={item.key} onClick={() => { handleTabChange(item.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.key ? "bg-primary text-primary-foreground" : "text-secondary-foreground/70 hover:bg-secondary-foreground/10"}`}>
              <item.icon size={18} />{item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-secondary-foreground/10">
          <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-secondary-foreground/70 hover:bg-secondary-foreground/10 transition-colors">
            <LogOut size={18} />Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={22} className="text-foreground" /></button>
            <h2 className="font-body text-lg font-bold text-foreground capitalize">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">A</div>
          </div>
        </header>

        <div className="p-6">
          {dataLoading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* DASHBOARD */}
              {activeTab === "dashboard" && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                      <Card key={stat.label}>
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-muted-foreground">{stat.label}</span>
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><stat.icon size={18} className="text-primary-foreground" /></div>
                          </div>
                          <p className="font-body text-2xl font-bold text-foreground">{stat.value}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base">Recent Orders</CardTitle>
                        <button onClick={() => setActiveTab("orders")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">View all <ChevronRight size={14} /></button>
                      </CardHeader>
                      <CardContent className="px-0">
                        <Table>
                          <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead className="hidden sm:table-cell">Date</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                          <TableBody>
                            {orders.slice(0, 5).map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.order_number}</TableCell>
                                <TableCell>{order.customer_name}</TableCell>
                                <TableCell className="hidden sm:table-cell text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="font-medium">₹{Number(order.amount).toLocaleString()}</TableCell>
                                <TableCell><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[order.status] || "bg-muted text-muted-foreground"}`}>{order.status}</span></TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-base">Top Products</CardTitle></CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {products.slice(0, 4).map((p) => (
                            <div key={p.id} className="flex items-center justify-between">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                                <p className="text-xs text-muted-foreground">Stock: {p.stock ?? 0}</p>
                              </div>
                              <span className="text-sm font-semibold text-foreground ml-3">₹{Number(p.price).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {/* ORDERS */}
              {activeTab === "orders" && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
                      <CardTitle className="text-base">All Orders ({orders.length})</CardTitle>
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="bg-card border border-border rounded px-3 py-1.5 text-sm font-medium text-foreground"
                      >
                        <option value="all">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </CardHeader>
                    <CardContent className="px-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                             <TableHead></TableHead><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Email</TableHead>
                             <TableHead>Mobile</TableHead><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Payment</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(orderStatusFilter === "all" ? orders : orders.filter((o) => o.status === orderStatusFilter)).map((order) => {
                            const isExpanded = expandedOrderId === order.id;
                            const items = Array.isArray(order.items) ? order.items : [];
                            const address = order.shipping_address && typeof order.shipping_address === 'object' ? order.shipping_address as Record<string, any> : null;
                            return (
                              <React.Fragment key={order.id}>
                                <TableRow key={order.id} className="cursor-pointer" onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}>
                                  <TableCell><ChevronRight size={14} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} /></TableCell>
                                  <TableCell className="font-medium">{order.order_number}</TableCell>
                                  <TableCell>{order.customer_name}</TableCell>
                                  <TableCell className="text-muted-foreground">{order.customer_email}</TableCell>
                                  <TableCell className="text-muted-foreground">{order.mobile_no || '—'}</TableCell>
                                  <TableCell className="text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                  <TableCell className="font-medium">₹{Number(order.amount).toLocaleString()}</TableCell>
                                  <TableCell>
                                    {order.payment_method === "cod" ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                                        <Banknote size={12} /> COD
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Online</span>
                                    )}
                                  </TableCell>
                                  <TableCell><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[order.status] || "bg-muted text-muted-foreground"}`}>{order.status}</span></TableCell>
                                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                    <select value={order.status} onChange={async (e) => {
                                      const newStatus = e.target.value;
                                      if (newStatus === order.status) return;
                                      const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", order.id);
                                      if (error) { toast.error("Failed to update status"); return; }
                                      // For COD orders marked as Delivered, update customer metrics
                                      if (newStatus === "Delivered" && order.payment_method === "cod") {
                                        try {
                                          const { data: codResult, error: codError } = await supabase.functions.invoke("complete-cod-order", {
                                            body: { orderId: order.id },
                                          });
                                          if (codError || codResult?.error) {
                                            console.error("COD completion error:", codError || codResult?.error);
                                            toast.error("Order status updated but failed to update customer metrics");
                                          }
                                        } catch (err) {
                                          console.error("COD completion error:", err);
                                        }
                                      }
                                      toast.success(`Order ${order.order_number} → ${newStatus}`);
                                      fetchData();
                                    }} className="bg-card border border-border rounded px-2 py-1 text-xs font-medium text-foreground">
                                      <option value="Pending" disabled>Pending</option>
                                      <option value="Processing">Processing</option>
                                      <option value="Shipped">Shipped</option>
                                      <option value="Delivered">Delivered</option>
                                      <option value="Cancelled">Cancelled</option>
                                    </select>
                                  </TableCell>
                                </TableRow>
                                {isExpanded && (
                                  <TableRow key={`${order.id}-detail`}>
                                    <TableCell colSpan={10} className="bg-muted/30 p-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="font-semibold text-sm mb-2">Items Ordered</h4>
                                          {items.length > 0 ? (
                                            <ul className="space-y-1 text-sm">
                                              {items.map((item: any, i: number) => (
                                                <li key={i} className="flex justify-between">
                                                  <span>{item.name || 'Unknown'} {item.size ? `(${item.size})` : ''} × {item.quantity || 1}</span>
                                                  <span className="font-medium">₹{Number(item.price || 0).toLocaleString()}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          ) : <p className="text-sm text-muted-foreground">No items data</p>}
                                        </div>
                                        <div>
                                          <h4 className="font-semibold text-sm mb-2">Shipping Address</h4>
                                          {address ? (
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                              {[address.street || address.address || address.line1, address.city, address.state, address.postcode || address.pincode || address.zip].filter(Boolean).join(', ') || 'No address provided'}
                                            </p>
                                          ) : <p className="text-sm text-muted-foreground">No address data</p>}
                                        </div>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* PRODUCTS */}
              {activeTab === "products" && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base">All Products ({products.length})</CardTitle>
                      <Button size="sm" onClick={openAddProduct} className="gap-1"><Plus size={16} /> Add Product</Button>
                    </CardHeader>
                    <CardContent className="px-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Image</TableHead><TableHead>Name</TableHead><TableHead>Price</TableHead>
                            <TableHead className="hidden md:table-cell">Original</TableHead><TableHead className="hidden md:table-cell">Discount</TableHead>
                            <TableHead>Stock</TableHead><TableHead className="hidden sm:table-cell">Sizes</TableHead>
                            <TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.map((p) => (
                            <TableRow key={p.id}>
                              <TableCell>
                                <div className="w-10 h-10 rounded-lg bg-accent overflow-hidden">
                                  {p.image_url ? (
                                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Package size={16} /></div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium max-w-[200px] truncate">{p.name}</TableCell>
                              <TableCell>₹{Number(p.price).toLocaleString()}</TableCell>
                              <TableCell className="hidden md:table-cell text-muted-foreground">{p.original_price ? `₹${Number(p.original_price).toLocaleString()}` : "–"}</TableCell>
                              <TableCell className="hidden md:table-cell">{calcDiscount(p.price, p.original_price)}%</TableCell>
                              <TableCell>{p.stock ?? 0}</TableCell>
                              <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">{(p.sizes ?? []).join(", ")}</TableCell>
                              <TableCell><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>{p.is_active ? "Active" : "Inactive"}</span></TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button onClick={() => openEditProduct(p)} className="p-1.5 rounded hover:bg-muted transition-colors"><Pencil size={15} className="text-muted-foreground" /></button>
                                  <button onClick={() => { setDeletingProduct(p); setDeleteDialogOpen(true); }} className="p-1.5 rounded hover:bg-destructive/10 transition-colors"><Trash2 size={15} className="text-destructive" /></button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* CUSTOMERS */}
              {activeTab === "customers" && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardHeader><CardTitle className="text-base">All Customers ({customers.length})</CardTitle></CardHeader>
                    <CardContent className="px-0">
                      <Table>
                        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Mobile</TableHead><TableHead>Orders</TableHead><TableHead>Total Spent</TableHead><TableHead>Joined</TableHead><TableHead>Marketing OPT</TableHead></TableRow></TableHeader>
                        <TableBody>
                          {customers.map((c) => (
                            <TableRow key={c.id}>
                              <TableCell className="font-medium">{c.name}</TableCell>
                              <TableCell className="text-muted-foreground">{c.email}</TableCell>
                              <TableCell className="text-muted-foreground">{(c as any).mobile_no || '—'}</TableCell>
                              <TableCell>{c.total_orders ?? 0}</TableCell>
                              <TableCell className="font-medium">₹{Number(c.total_spent ?? 0).toLocaleString()}</TableCell>
                              <TableCell className="text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <button
                                  onClick={() => handleToggleOptIn(c.id, c.marketing_opt_in)}
                                  title={c.marketing_opt_in !== false ? "Click to opt out" : "Click to opt in"}
                                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                                    c.marketing_opt_in !== false
                                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                                      : "bg-red-100 text-red-700 hover:bg-red-200"
                                  }`}
                                >
                                  {c.marketing_opt_in !== false ? "Opted In" : "Opted Out"}
                                </button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* TESTIMONIALS */}
              {activeTab === "testimonials" && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base">Homepage Testimonials ({testimonials.length})</CardTitle>
                      <Button size="sm" onClick={() => { setEditingTestimonial(null); setTestimonialForm(emptyTestimonial); setTestimonialDialogOpen(true); }} className="gap-1"><Plus size={16} /> Add Review</Button>
                    </CardHeader>
                    <CardContent className="px-0">
                      <Table>
                        <TableHeader><TableRow><TableHead>#</TableHead><TableHead>Name</TableHead><TableHead>Size</TableHead><TableHead>Rating</TableHead><TableHead>Comment</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                          {testimonials.map((t) => (
                            <TableRow key={t.id}>
                              <TableCell className="text-muted-foreground">{t.sort_order}</TableCell>
                              <TableCell className="font-medium">{t.name}</TableCell>
                              <TableCell className="text-muted-foreground">{t.size}</TableCell>
                              <TableCell>
                                <div className="flex gap-0.5">
                                  {[1,2,3,4,5].map((s) => <Star key={s} size={12} className={s <= t.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"} />)}
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground text-xs max-w-[300px] truncate">{t.comment}</TableCell>
                              <TableCell><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${t.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>{t.is_active ? "Active" : "Hidden"}</span></TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button onClick={() => { setEditingTestimonial(t); setTestimonialForm({ name: t.name, size: t.size, rating: t.rating, comment: t.comment, is_active: t.is_active }); setTestimonialDialogOpen(true); }} className="p-1.5 rounded hover:bg-muted transition-colors"><Pencil size={15} className="text-muted-foreground" /></button>
                                  <button onClick={() => { setDeletingTestimonial(t); setDeleteTestimonialDialogOpen(true); }} className="p-1.5 rounded hover:bg-destructive/10 transition-colors"><Trash2 size={15} className="text-destructive" /></button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* COUPONS */}
              {activeTab === "coupons" && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base">All Coupons ({coupons.length})</CardTitle>
                      <Button size="sm" onClick={openAddCoupon} className="gap-1"><Plus size={16} /> Add Coupon</Button>
                    </CardHeader>
                    <CardContent className="px-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Code</TableHead><TableHead>Type</TableHead><TableHead>Value</TableHead>
                            <TableHead className="hidden md:table-cell">Min Order</TableHead><TableHead className="hidden md:table-cell">Uses</TableHead>
                            <TableHead>Status</TableHead><TableHead className="hidden sm:table-cell">Expires</TableHead><TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {coupons.map((c) => (
                            <TableRow key={c.id}>
                              <TableCell className="font-mono font-bold">{c.code}</TableCell>
                              <TableCell className="capitalize">{c.type}</TableCell>
                              <TableCell className="font-medium">{c.type === "percentage" ? `${c.value}%` : `₹${c.value}`}</TableCell>
                              <TableCell className="hidden md:table-cell text-muted-foreground">₹{c.min_order_amount}</TableCell>
                              <TableCell className="hidden md:table-cell text-muted-foreground">{c.used_count}{c.max_uses ? `/${c.max_uses}` : "/∞"}</TableCell>
                              <TableCell><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>{c.is_active ? "Active" : "Inactive"}</span></TableCell>
                              <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : "Never"}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button onClick={() => openEditCoupon(c)} className="p-1.5 rounded hover:bg-muted transition-colors"><Pencil size={15} className="text-muted-foreground" /></button>
                                  <button onClick={() => { setDeletingCoupon(c); setDeleteCouponDialogOpen(true); }} className="p-1.5 rounded hover:bg-destructive/10 transition-colors"><Trash2 size={15} className="text-destructive" /></button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* EMAIL */}
              {activeTab === "email" && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-5 pb-4">
                        <p className="text-xs text-muted-foreground mb-1">Marketing Opted-in Customers</p>
                        <p className="font-body text-2xl font-bold text-foreground">{emailOptedInCount ?? "—"}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-5 pb-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Mail size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Provider</p>
                          <p className="font-body font-semibold text-sm text-foreground">Resend</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Compose */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Mail size={16} /> Compose Promotional Email
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        This email will be sent to all customers who opted in to marketing emails.
                        Use <code className="bg-muted px-1 rounded text-xs">{"{name}"}</code> to personalise with the customer's name.
                      </p>

                      <div>
                        <Label className="mb-1.5 block">Subject Line</Label>
                        <Input
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          placeholder="e.g. 🎉 Your next period, sorted!"
                        />
                      </div>

                      <div>
                        <Label className="mb-1.5 block">Preview Text <span className="text-muted-foreground font-normal">(shown in inbox before opening)</span></Label>
                        <Input
                          value={emailPreviewText}
                          onChange={(e) => setEmailPreviewText(e.target.value)}
                          placeholder="e.g. Exclusive offer just for you inside..."
                        />
                      </div>

                      <div>
                        <Label className="mb-1.5 block">
                          Email Body
                          <span className="text-muted-foreground font-normal ml-1">(plain text or HTML)</span>
                        </Label>
                        <textarea
                          value={emailBody}
                          onChange={(e) => setEmailBody(e.target.value)}
                          placeholder={`Hi {name}!\n\nWe have an exclusive deal just for you — use code SAVE15 for 15% off your next order.\n\nShop now at poppigo.com.\n\nWith love,\nTeam PoppiGo`}
                          rows={12}
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y font-mono"
                        />
                        <p className="text-xs text-muted-foreground mt-1.5">
                          Plain text is auto-wrapped in a branded template. Paste raw HTML to take full control of the layout.
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <Button
                          onClick={handleSendEmail}
                          disabled={emailSending || !emailSubject.trim() || !emailBody.trim()}
                          className="gap-2"
                        >
                          {emailSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                          {emailSending
                            ? "Sending..."
                            : `Send to ${emailOptedInCount ?? "?"} customer${emailOptedInCount !== 1 ? "s" : ""}`}
                        </Button>
                        <Button variant="outline" size="sm" onClick={fetchEmailStats} className="gap-1.5">
                          <RefreshCw size={13} /> Refresh Count
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* WHATSAPP */}
              {activeTab === "whatsapp" && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                  {/* Stats row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card><CardContent className="pt-5 pb-4">
                      <p className="text-xs text-muted-foreground mb-1">Opted-in Customers</p>
                      <p className="text-2xl font-bold">{optedInCount ?? "—"}</p>
                    </CardContent></Card>
                    <Card><CardContent className="pt-5 pb-4">
                      <p className="text-xs text-muted-foreground mb-1">Pending Follow-ups</p>
                      <p className="text-2xl font-bold text-amber-600">{followupsStats?.pending ?? "—"}</p>
                    </CardContent></Card>
                    <Card><CardContent className="pt-5 pb-4">
                      <p className="text-xs text-muted-foreground mb-1">Follow-ups Sent</p>
                      <p className="text-2xl font-bold text-green-600">{followupsStats?.sent ?? "—"}</p>
                    </CardContent></Card>
                  </div>

                  {/* Run Follow-ups */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2"><RefreshCw size={16} /> Scheduled Follow-ups</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        When an order is confirmed, follow-up reminders are automatically scheduled at <strong>7 days</strong>, <strong>15 days</strong>, and <strong>30 days</strong>. Click below to send all overdue messages now.
                      </p>
                      <div className="flex items-center gap-3">
                        <Button onClick={handleRunFollowups} disabled={followupsRunning} className="gap-2">
                          {followupsRunning ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                          Run Follow-ups
                        </Button>
                        <Button variant="outline" size="sm" onClick={fetchWhatsappStats} className="gap-1.5">
                          <RefreshCw size={13} /> Refresh Stats
                        </Button>
                      </div>

                      {/* Follow-ups table */}
                      {recentFollowups.length > 0 && (
                        <div className="mt-2 overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead>Scheduled</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {recentFollowups.map((f) => (
                                <TableRow key={f.id}>
                                  <TableCell className="font-medium">{f.customer_name}</TableCell>
                                  <TableCell className="font-mono text-xs text-muted-foreground">{f.order_number}</TableCell>
                                  <TableCell className="text-xs text-muted-foreground">{new Date(f.scheduled_at).toLocaleDateString()}</TableCell>
                                  <TableCell>
                                    {f.sent
                                      ? <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Sent</span>
                                      : new Date(f.scheduled_at) <= new Date()
                                        ? <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Overdue</span>
                                        : <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">Scheduled</span>
                                    }
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Broadcast */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2"><Send size={16} /> Broadcast WhatsApp Message</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Send a message to all customers with WhatsApp opt-in enabled. Use <code className="bg-muted px-1 rounded text-xs">{"{name}"}</code> to personalise with the customer's name.
                      </p>
                      <textarea
                        value={broadcastMessage}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        placeholder={"Hi {name}! 🎉 Check out our latest collection at poppigo.com — use code SAVE15 for 15% off!"}
                        rows={5}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                      />
                      <div className="flex items-center gap-3">
                        <Button onClick={handleBroadcast} disabled={broadcastSending || !broadcastMessage.trim()} className="gap-2">
                          {broadcastSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                          {broadcastSending ? "Sending..." : `Send to ${optedInCount ?? "?"} customers`}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                </motion.div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Product Add/Edit Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Name</Label><Input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} placeholder="Product name" /></div>
            <div><Label>Description</Label><textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} placeholder="Product description shown on detail page" className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px] resize-y" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Price (₹)</Label><Input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })} /></div>
              <div><Label>Original Price (₹)</Label><Input type="number" value={productForm.original_price} onChange={(e) => setProductForm({ ...productForm, original_price: Number(e.target.value) })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Discount</Label><Input disabled value={`${calcDiscount(productForm.price, productForm.original_price)}%`} /></div>
              <div><Label>Stock</Label><Input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })} /></div>
            </div>

            {/* Image Upload */}
            <div>
              <Label>Product Image</Label>
              <div className="mt-2">
                {productForm.image_url && (
                  <div className="mb-3 w-24 h-24 rounded-lg border border-border overflow-hidden bg-accent">
                    <img src={productForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="gap-1.5">
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {uploading ? "Uploading..." : "Upload Image"}
                  </Button>
                  <span className="text-xs text-muted-foreground">or paste URL below</span>
                </div>
                <Input className="mt-2" value={productForm.image_url} onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })} placeholder="https://..." />
              </div>
            </div>

            {/* Gallery Images */}
            <div>
              <Label>Additional Images (Gallery)</Label>
              <div className="mt-2 space-y-3">
                {productForm.gallery_images && productForm.gallery_images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {productForm.gallery_images.map((url, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg border border-border overflow-hidden bg-accent group">
                        <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setProductForm((prev) => ({
                            ...prev,
                            gallery_images: prev.gallery_images?.filter((_, i) => i !== idx) || [],
                          }))}
                          className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity leading-none"
                        >×</button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <input ref={galleryFileInputRef} type="file" accept="image/*" onChange={handleGalleryImageUpload} className="hidden" />
                  <Button type="button" variant="outline" size="sm" onClick={() => galleryFileInputRef.current?.click()} disabled={uploading} className="gap-1.5">
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    Add Gallery Image
                  </Button>
                  <span className="text-xs text-muted-foreground">Hover over thumbnail to remove</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><Label>Category</Label><Input value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} /></div>
              <div><Label>Sizes (comma-separated)</Label><Input value={productForm.sizes} onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })} placeholder="S-M, L-XL" /></div>
            </div>

            {/* Size Images */}
            {productForm.sizes && (
              <div>
                <Label>Size Images (optional)</Label>
                <div className="mt-2 space-y-3">
                  {productForm.sizes.split(",").map((size) => {
                    const trimmedSize = size.trim();
                    if (!trimmedSize) return null;
                    return (
                      <div key={trimmedSize} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                        <div className="font-medium text-sm w-16">{trimmedSize}</div>
                        {productForm.size_images?.[trimmedSize] && (
                          <div className="w-12 h-12 rounded border border-border overflow-hidden bg-accent">
                            <img src={productForm.size_images[trimmedSize]} alt={`${trimmedSize} preview`} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <input
                            ref={(el) => sizeImageRefs.current[trimmedSize] = el}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSizeImageUpload(trimmedSize, e)}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => sizeImageRefs.current[trimmedSize]?.click()}
                            disabled={uploading}
                            className="gap-1.5"
                          >
                            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                            {productForm.size_images?.[trimmedSize] ? "Change" : "Upload"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pack Configuration */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={productForm.enable_packs}
                  onChange={(e) => setProductForm({ ...productForm, enable_packs: e.target.checked })}
                  className="rounded"
                  id="enable_packs"
                />
                <Label htmlFor="enable_packs">Enable Pack Options</Label>
              </div>

              {productForm.enable_packs && (
                <div className="space-y-3 pl-6 border-l-2 border-border">
                  <Label>Pack Links</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {["Pack of 1", "Pack of 2", "Pack of 3"].map((pack) => (
                      <div key={pack} className="flex items-center gap-3">
                        <Label className="w-20 text-sm">{pack}</Label>
                        <Input
                          value={productForm.pack_links?.[pack] || ""}
                          onChange={(e) => setProductForm({
                            ...productForm,
                            pack_links: { ...productForm.pack_links, [pack]: e.target.value }
                          })}
                          placeholder="https://..."
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" checked={productForm.is_active} onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })} className="rounded" id="is_active" />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProduct}>{editingProduct ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Delete Product</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete <strong>{deletingProduct?.name}</strong>? This can't be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Coupon Add/Edit Dialog */}
      <Dialog open={couponDialogOpen} onOpenChange={setCouponDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editingCoupon ? "Edit Coupon" : "Add Coupon"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Coupon Code</Label><Input value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} placeholder="e.g. SAVE20" className="font-mono" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <select value={couponForm.type} onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div><Label>Value</Label><Input type="number" value={couponForm.value} onChange={(e) => setCouponForm({ ...couponForm, value: Number(e.target.value) })} placeholder={couponForm.type === "percentage" ? "e.g. 20" : "e.g. 100"} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Min Order Amount (₹)</Label><Input type="number" value={couponForm.min_order_amount} onChange={(e) => setCouponForm({ ...couponForm, min_order_amount: Number(e.target.value) })} /></div>
              <div><Label>Max Uses (blank = unlimited)</Label><Input type="number" value={couponForm.max_uses} onChange={(e) => setCouponForm({ ...couponForm, max_uses: e.target.value === "" ? "" : Number(e.target.value) })} placeholder="Unlimited" /></div>
            </div>
            <div><Label>Expires At (optional)</Label><Input type="datetime-local" value={couponForm.expires_at} onChange={(e) => setCouponForm({ ...couponForm, expires_at: e.target.value })} /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={couponForm.is_active} onChange={(e) => setCouponForm({ ...couponForm, is_active: e.target.checked })} className="rounded" id="coupon_active" />
              <Label htmlFor="coupon_active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCouponDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCoupon}>{editingCoupon ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Coupon Confirmation */}
      <Dialog open={deleteCouponDialogOpen} onOpenChange={setDeleteCouponDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Delete Coupon</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete coupon <strong>{deletingCoupon?.code}</strong>?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCouponDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCoupon}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Testimonial Add/Edit Dialog */}
      <Dialog open={testimonialDialogOpen} onOpenChange={setTestimonialDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editingTestimonial ? "Edit Review" : "Add Review"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Name</Label><Input value={testimonialForm.name} onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })} placeholder="e.g. Priya S." /></div>
              <div><Label>Size</Label><Input value={testimonialForm.size} onChange={(e) => setTestimonialForm({ ...testimonialForm, size: e.target.value })} placeholder="e.g. S-M" /></div>
            </div>
            <div>
              <Label>Star Rating</Label>
              <div className="flex gap-2 mt-2">
                {[1,2,3,4,5].map((s) => (
                  <button key={s} type="button" onClick={() => setTestimonialForm({ ...testimonialForm, rating: s })} className="p-1">
                    <Star size={22} className={s <= testimonialForm.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Review Comment</Label>
              <textarea value={testimonialForm.comment} onChange={(e) => setTestimonialForm({ ...testimonialForm, comment: e.target.value })} placeholder="Customer review text..." className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px] resize-y mt-1" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={testimonialForm.is_active} onChange={(e) => setTestimonialForm({ ...testimonialForm, is_active: e.target.checked })} className="rounded" id="test_active" />
              <Label htmlFor="test_active">Show on homepage</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestimonialDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTestimonial}>{editingTestimonial ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Testimonial Confirmation */}
      <Dialog open={deleteTestimonialDialogOpen} onOpenChange={setDeleteTestimonialDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Delete Review</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete the review by <strong>{deletingTestimonial?.name}</strong>?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTestimonialDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteTestimonial}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Admin;

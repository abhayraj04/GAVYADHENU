import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  BarChart3,
  Bell,
  Box,
  Check,
  ChevronRight,
  CircleAlert,
  Download,
  Edit3,
  Heart,
  LayoutDashboard,
  Leaf,
  LogOut,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Store,
  Trash2,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { CropDoctorScanner } from "@/components/CropDoctorScanner";
import { PashuCareModule } from "@/components/PashuCareModule";
import { AdminBIPanel, SellerBIPanel } from "@/components/BusinessIntelligencePanels";
import { LanguageToggle } from "@/components/LanguageToggle";

type PortalRole = "customer" | "seller" | "admin";

const portalMeta: Record<PortalRole, { title: string; eyebrow: string; icon: typeof Store; accent: string }> = {
  customer: { title: "Customer space", eyebrow: "Your Gavyadhenu account", icon: LayoutDashboard, accent: "#285943" },
  seller: { title: "Seller studio", eyebrow: "Run your living catalogue", icon: Store, accent: "#9b553b" },
  admin: { title: "Admin control", eyebrow: "Platform operations", icon: ShieldCheck, accent: "#263b56" },
};

export default function Portal({ role }: { role: PortalRole }) {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  if (loading) return <div className="portal-loading"><div className="portal-spinner" />Loading your workspace…</div>;
  if (!user) return <div className="portal-auth"><div className="portal-auth-card"><div className="portal-symbol">G</div><span className="portal-kicker">GAVYADHENU</span><h1>Sign in to continue</h1><p>Your secure workspace is one step away. Sign in with your Gavyadhenu account to access this portal.</p><button className="portal-primary" onClick={() => startLogin()}>Sign in securely <ChevronRight size={17} /></button><Link className="portal-back" href="/">Back to storefront</Link></div></div>;
  const actualRole: PortalRole = user.role === "admin" ? "admin" : user.role === "seller" ? "seller" : "customer";
  const canOpen = actualRole === "admin" || actualRole === role;
  if (!canOpen) return <div className="portal-auth"><div className="portal-auth-card"><CircleAlert size={34} /><span className="portal-kicker">ACCESS CONTROL</span><h1>Private workspace</h1><p>This account does not have permission to open the {role} portal. Your access is protected by server-side role checks.</p><button className="portal-primary" onClick={() => setLocation(`/${actualRole}`)}>Open my portal <ChevronRight size={17} /></button><Link className="portal-back" href="/">Back to storefront</Link></div></div>;
  return <PortalFrame role={role} userName={user.name ?? user.email ?? "Member"} onLogout={async () => { await logout(); toast.success("You have been logged out successfully."); setLocation("/"); }}>{role === "customer" ? <CustomerPortal /> : role === "seller" ? <SellerPortal /> : <AdminPortal />}</PortalFrame>;
}

function PortalFrame({ role, userName, onLogout, children }: { role: PortalRole; userName: string; onLogout: () => void; children: React.ReactNode }) {
  const meta = portalMeta[role]; const Icon = meta.icon;
  const links =
    role === "customer"
      ? [
          { label: "Overview", href: "/customer" },
          { label: "Crop Doctor", href: "/customer?view=crop_doctor" },
          { label: "Pashu Care", href: "/customer?view=pashu_care" },
          { label: "Addresses", href: "/customer?view=addresses" },
          { label: "Orders", href: "/customer?view=orders" },
          { label: "Notifications", href: "/customer?view=notifications" },
        ]
      : role === "seller"
      ? [
          { label: "Overview", href: "/seller" },
          { label: "Products", href: "/seller?view=products" },
          { label: "Orders", href: "/seller?view=orders" },
          { label: "AI Sales & Forecasts", href: "/seller?view=analytics" },
        ]
      : [
          { label: "Overview", href: "/admin" },
          { label: "Executive BI", href: "/admin?view=bi" },
          { label: "Seller approvals", href: "/admin?view=sellers" },
          { label: "Product approvals", href: "/admin?view=products" },
        ];
  return <div className="portal-shell"><aside className="portal-sidebar"><Link href="/" className="portal-logo">gavyadhenu<span>˙</span></Link><div className="portal-identity"><div className="portal-avatar">{userName.slice(0, 1).toUpperCase()}</div><div><b>{userName}</b><small>{role}</small></div></div><nav className="portal-nav">{links.map(link => <Link key={link.href} href={link.href}><Icon size={16} />{link.label}</Link>)}</nav><div className="portal-sidebar-bottom"><Link href="/"><ArrowLeft size={15} /> Storefront</Link><button onClick={onLogout}><LogOut size={15} /> Sign out</button></div></aside><main className="portal-main"><header className="portal-topbar"><div><span className="portal-kicker">{meta.eyebrow}</span><h1>{meta.title}</h1></div><div className="portal-top-actions"><LanguageToggle /><span className="portal-role-chip" style={{ background: `${meta.accent}14`, color: meta.accent }}><Icon size={14} /> {role}</span><Bell size={18} /></div></header><div className="portal-content">{children}</div></main></div>;
}

function CustomerPortal() {
  const [view, setView] = useState(() => new URLSearchParams(window.location.search).get("view") ?? "overview");
  const dashboard = trpc.customer.dashboard.useQuery();
  const addresses = trpc.customer.addresses.useQuery();
  const orders = trpc.customer.orders.useQuery();
  const wishlist = trpc.customer.wishlist.useQuery();
  const addAddress = trpc.customer.addAddress.useMutation({ onSuccess: result => { toast.success(result.message); addresses.refetch(); setView("addresses"); }, onError: error => toast.error(error.message) });
  const deleteAddress = trpc.customer.deleteAddress.useMutation({ onSuccess: result => { toast.success(result.message); addresses.refetch(); }, onError: error => toast.error(error.message) });
  const removeWishlist = trpc.customer.removeWishlist.useMutation({ onSuccess: result => { toast.success(result.message); wishlist.refetch(); }, onError: error => toast.error(error.message) });
  const [address, setAddress] = useState({ fullName: "", phone: "", address: "", area: "", city: "", state: "", pincode: "", landmark: "", isDefault: false });
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");

  const updateProfile = trpc.customer.updateProfile.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      dashboard.refetch();
      setEditingProfile(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const submitAddress = (event: FormEvent) => { event.preventDefault(); addAddress.mutate(address); };
  if (dashboard.isLoading) return <PortalSkeleton />;
  const user = dashboard.data?.user;

  const handleStartEditProfile = () => {
    setProfileName(user?.name || "");
    setProfilePhone(user?.phone || "");
    setEditingProfile(true);
  };

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ name: profileName, phone: profilePhone });
  };

  return <>
    <div className="portal-welcome"><div><span className="portal-kicker">GOOD TO SEE YOU</span><h2>Welcome back, {user?.name?.split(" ")[0] ?? "friend"}.</h2><p>Your everyday essentials, thoughtful rituals, and order updates — all in one place.</p></div><Link className="portal-primary compact" href="/#harvests">Shop the harvest <ChevronRight size={16} /></Link></div>
    <div className="portal-stat-grid"><PortalStat icon={Package} label="Total orders" value={String(dashboard.data?.orderStats.total ?? 0)} /><PortalStat icon={Box} label="Pending orders" value={String(dashboard.data?.orderStats.pending ?? 0)} /><PortalStat icon={Check} label="Delivered" value={String(dashboard.data?.orderStats.delivered ?? 0)} /><PortalStat icon={Wallet} label="Cart items" value={String(dashboard.data?.cartCount ?? 0)} /></div>
    <div className="portal-grid-two">
      <section className="portal-panel">
        <div className="portal-panel-head">
          <div><span className="portal-kicker">ACCOUNT</span><h3>Profile summary</h3></div>
          <button className="portal-icon-button" onClick={handleStartEditProfile} title="Edit Profile Details"><Edit3 size={16} /></button>
        </div>
        <div className="profile-summary">
          <div className="portal-avatar large">{(user?.name ?? "G").slice(0, 1).toUpperCase()}</div>
          <div>
            <b>{user?.name ?? "Gavyadhenu customer"}</b>
            <span>{user?.email ?? "Email not provided"}</span>
            <span>{user?.phone ?? "Add a phone number for delivery updates"}</span>
          </div>
        </div>
        {editingProfile && (
          <form onSubmit={handleSaveProfile} className="portal-form" style={{ marginTop: 16 }}>
            <div className="form-two">
              <label>Full name<input required value={profileName} onChange={e => setProfileName(e.target.value)} /></label>
              <label>Phone number<input required value={profilePhone} onChange={e => setProfilePhone(e.target.value)} /></label>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button type="submit" className="portal-primary compact" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving…" : "Save Changes"}
              </button>
              <button type="button" className="portal-outline compact" onClick={() => setEditingProfile(false)}>Cancel</button>
            </div>
          </form>
        )}
      </section>
      <section className="portal-panel"><div className="portal-panel-head"><div><span className="portal-kicker">SAVED ADDRESSES</span><h3>{addresses.data?.length ?? 0} delivery addresses</h3></div><button className="portal-outline compact" onClick={() => setView("addresses")}><Plus size={15} /> Add</button></div>{addresses.data?.length ? <div className="mini-list">{addresses.data.slice(0, 2).map(item => <div className="mini-list-row" key={item.id}><div><b>{item.fullName}</b><span>{item.address}, {item.city}</span></div><span className="status-chip">{item.isDefault ? "Default" : "Saved"}</span></div>)}</div> : <div className="portal-empty">Save an address to make checkout faster.</div>}</section>
    </div>
    <section className="portal-panel portal-section"><div className="portal-panel-head"><div><span className="portal-kicker">ACCOUNT TOOLS</span><h3>Manage your account</h3></div></div><div className="portal-tool-grid"><button onClick={() => setView("crop_doctor")}><span className="tool-icon"><Leaf size={17} /></span><b>AI Crop Doctor</b><small>Scan and diagnose leaf diseases</small></button><button onClick={() => setView("pashu_care")}><span className="tool-icon"><Heart size={17} /></span><b>AI Pashu Care</b><small>Livestock feed, triage & records</small></button><button onClick={() => setView("addresses")}><span className="tool-icon"><Plus size={17} /></span><b>Addresses</b><small>Add or update delivery details</small></button><button onClick={() => setView("wishlist")}><span className="tool-icon"><Heart size={17} /></span><b>Wishlist</b><small>{wishlist.data?.length ?? 0} saved harvests</small></button><button onClick={() => setView("notifications")}><span className="tool-icon"><Bell size={17} /></span><b>Notifications</b><small>Order and platform updates</small></button><Link href="/#harvests"><span className="tool-icon"><Package size={17} /></span><b>Recommended harvests</b><small>Return to the storefront</small></Link></div></section>
    {view === "crop_doctor" && <section className="portal-panel portal-section"><CropDoctorScanner /></section>}
    {view === "pashu_care" && <section className="portal-panel portal-section"><PashuCareModule /></section>}
    {view === "addresses" && <section className="portal-panel portal-section"><div className="portal-panel-head"><div><span className="portal-kicker">DELIVERY BOOK</span><h3>Manage addresses</h3></div><button className="portal-icon-button" onClick={() => setView("overview")}><X size={17} /></button></div><div className="address-list">{addresses.data?.map(item => <div className="address-card" key={item.id}><div><b>{item.fullName} {item.isDefault && <span className="status-chip">Default</span>}</b><span>{item.phone}</span><p>{item.address}{item.area ? `, ${item.area}` : ""}, {item.city}, {item.state} — {item.pincode}{item.landmark ? ` · ${item.landmark}` : ""}</p></div><button className="portal-danger" onClick={() => window.confirm("Are you sure you want to delete this address?") && deleteAddress.mutate({ id: item.id })}><Trash2 size={15} /></button></div>)}</div><form className="portal-form" onSubmit={submitAddress}><h4>Add a new address</h4><div className="form-two"><label>Full name<input required value={address.fullName} onChange={e => setAddress({ ...address, fullName: e.target.value })} /></label><label>Phone<input required value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} /></label></div><label>House / address<input required value={address.address} onChange={e => setAddress({ ...address, address: e.target.value })} /></label><div className="form-three"><label>Area<input value={address.area} onChange={e => setAddress({ ...address, area: e.target.value })} /></label><label>City<input required value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} /></label><label>State<input required value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} /></label></div><div className="form-two"><label>Pincode<input required value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} /></label><label>Landmark<input value={address.landmark} onChange={e => setAddress({ ...address, landmark: e.target.value })} /></label></div><label className="checkbox-label"><input type="checkbox" checked={address.isDefault} onChange={e => setAddress({ ...address, isDefault: e.target.checked })} /> Make this my default address</label><button className="portal-primary" disabled={addAddress.isPending}>{addAddress.isPending ? "Saving…" : "Save address"} <Check size={16} /></button></form></section>}
    {view === "orders" && <OrdersPanel items={orders.data ?? []} />}
    {view === "wishlist" && <WishlistPanel items={wishlist.data ?? []} onRemove={productId => removeWishlist.mutate({ productId })} />}
    {view === "notifications" && <NotificationPanel items={dashboard.data?.notifications ?? []} />}
  </>;
}

function SellerPortal() {
  const dashboard = trpc.seller.dashboard.useQuery();
  const applySeller = trpc.seller.applySeller.useMutation({ onSuccess: result => { toast.success(result.message); dashboard.refetch(); }, onError: error => toast.error(error.message) });
  const [view, setView] = useState(() => new URLSearchParams(window.location.search).get("view") ?? "overview");
  const [application, setApplication] = useState({ storeName: "", description: "", phone: "", businessAddress: "", gstNumber: "" });
  const [form, setForm] = useState({ name: "", slug: "", category: "Kitchen", sku: "", price: "", mrp: "", stock: "", description: "", imageUrl: "" });
  const addProduct = trpc.seller.addProduct.useMutation({ onSuccess: result => { toast.success(result.message); dashboard.refetch(); setForm({ name: "", slug: "", category: "Kitchen", sku: "", price: "", mrp: "", stock: "", description: "", imageUrl: "" }); }, onError: error => toast.error(error.message) });
  if (dashboard.isLoading) return <PortalSkeleton />;
  const data = dashboard.data;
  const submitProduct = (event: FormEvent) => { event.preventDefault(); addProduct.mutate({ ...form, price: Number(form.price), mrp: form.mrp ? Number(form.mrp) : undefined, stock: Number(form.stock || 0), imageUrl: form.imageUrl || undefined }); };
  const submitApplication = (event: FormEvent) => { event.preventDefault(); applySeller.mutate({ ...application }); };
  return <>{!data?.profile && <section className="portal-panel portal-section"><div className="portal-panel-head"><div><span className="portal-kicker">SELLER APPLICATION</span><h3>Tell us about your store</h3></div></div><form className="portal-form" onSubmit={submitApplication}><div className="form-two"><label>Store name<input required value={application.storeName} onChange={e => setApplication({ ...application, storeName: e.target.value })} /></label><label>Phone<input value={application.phone} onChange={e => setApplication({ ...application, phone: e.target.value })} /></label></div><label>Business address<textarea rows={2} value={application.businessAddress} onChange={e => setApplication({ ...application, businessAddress: e.target.value })} /></label><div className="form-two"><label>GST number<input value={application.gstNumber} onChange={e => setApplication({ ...application, gstNumber: e.target.value })} /></label><label>Store description<input value={application.description} onChange={e => setApplication({ ...application, description: e.target.value })} /></label></div><button className="portal-primary" disabled={applySeller.isPending}>{applySeller.isPending ? "Submitting…" : "Submit seller application"} <Check size={16} /></button></form></section>}<div className="portal-welcome seller-welcome"><div><span className="portal-kicker">{data?.profile?.verificationStatus?.replace("_", " ") ?? "seller onboarding"}</span><h2>Build a catalogue people can trust.</h2><p>Products are submitted to admin review before they become visible in the public harvest.</p></div><button className="portal-primary compact" onClick={() => setView("products")}><Plus size={16} /> Add product</button></div><div className="portal-stat-grid"><PortalStat icon={Wallet} label="Total sales" value={`₹${data?.metrics.totalSales ?? 0}`} /><PortalStat icon={Package} label="Total orders" value={String(data?.metrics.totalOrders ?? 0)} /><PortalStat icon={CircleAlert} label="Low stock" value={String(data?.metrics.lowStockProducts ?? 0)} /><PortalStat icon={Box} label="Your products" value={String(data?.products.length ?? 0)} /></div><div className="portal-grid-two"><section className="portal-panel"><div className="portal-panel-head"><div><span className="portal-kicker">STORE PROFILE</span><h3>{data?.profile?.storeName ?? "Seller profile pending"}</h3></div><span className={`status-chip ${data?.profile?.verificationStatus}`}>{data?.profile?.verificationStatus?.replace("_", " ") ?? "not started"}</span></div><p className="panel-copy">{data?.profile?.description ?? "Complete your seller profile and submit your business information for verification."}</p><div className="seller-meta"><span><Store size={15} /> {data?.profile?.businessAddress ?? "Business address not added"}</span><span><ShieldCheck size={15} /> Admin approval required before selling</span></div></section><section className="portal-panel"><div className="portal-panel-head"><div><span className="portal-kicker">ORDER PULSE</span><h3>Recent seller orders</h3></div><button className="portal-icon-button" onClick={() => setView("orders")}><ChevronRight size={16} /></button></div>{data?.orders.length ? <div className="mini-list">{data.orders.slice(0, 4).map(item => <div className="mini-list-row" key={item.item.id}><div><b>#{item.order.orderNumber}</b><span>{item.item.productName} × {item.item.quantity}</span></div><span className="status-chip">{item.order.status}</span></div>)}</div> : <div className="portal-empty">No seller orders yet.</div>}</section></div><section className="portal-panel portal-section"><div className="portal-panel-head"><div><span className="portal-kicker">OPERATIONS</span><h3>Seller workspace</h3></div></div><div className="portal-tool-grid"><button onClick={() => setView("products")}><span className="tool-icon"><Box size={17} /></span><b>Product catalogue</b><small>Add products and track approval</small></button><button onClick={() => setView("orders")}><span className="tool-icon"><Package size={17} /></span><b>Seller orders</b><small>See orders containing your products</small></button><button onClick={() => setView("analytics")}><span className="tool-icon"><BarChart3 size={17} /></span><b>AI Sales & Forecasts</b><small>Revenue run-rate & stockout risks</small></button></div></section>{view === "analytics" && <section className="portal-panel portal-section"><div className="portal-panel-head"><div><span className="portal-kicker">BUSINESS INTELLIGENCE</span><h3>AI Sales & Demand Forecasting</h3></div><button className="portal-icon-button" onClick={() => setView("overview")}><X size={17} /></button></div><SellerBIPanel /></section>}{view === "products" && <section className="portal-panel portal-section"><div className="portal-panel-head"><div><span className="portal-kicker">CATALOGUE</span><h3>Add a product</h3></div><button className="portal-icon-button" onClick={() => setView("overview")}><X size={17} /></button></div><form className="portal-form" onSubmit={submitProduct}><div className="form-two"><label>Product name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label><label>SKU<input required value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} /></label></div><div className="form-three"><label>Slug<input required pattern="[a-z0-9-]+" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="product-slug" /></label><label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option>Kitchen</option><option>Wellness</option><option>Home & Living</option><option>Farm & Soil</option><option>Gifting</option></select></label><label>Stock<input required type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} /></label></div><div className="form-two"><label>Price (₹)<input required type="number" min="1" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></label><label>MRP (₹)<input type="number" min="1" value={form.mrp} onChange={e => setForm({ ...form, mrp: e.target.value })} /></label></div><label>Image URL<input type="url" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://…" /></label><label>Description<textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label><button className="portal-primary" disabled={addProduct.isPending}>{addProduct.isPending ? "Submitting…" : "Submit for approval"} <Check size={16} /></button></form><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Product</th><th>SKU</th><th>Stock</th><th>Status</th></tr></thead><tbody>{data?.products.map(product => <tr key={product.id}><td>{product.name}</td><td>{product.sku}</td><td>{product.stock}</td><td><span className="status-chip">{product.status.replace("_", " ")}</span></td></tr>)}</tbody></table></div></section>}{view === "orders" && <section className="portal-panel portal-section"><div className="portal-panel-head"><div><span className="portal-kicker">SELLER ORDERS</span><h3>Orders containing your products</h3></div></div><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Order</th><th>Product</th><th>Qty</th><th>Amount</th><th>Status</th></tr></thead><tbody>{data?.orders.map(item => <tr key={item.item.id}><td>#{item.order.orderNumber}</td><td>{item.item.productName}</td><td>{item.item.quantity}</td><td>₹{item.item.unitPrice}</td><td><span className="status-chip">{item.order.status}</span></td></tr>)}</tbody></table></div></section>}</>;
}

function AdminPortal() {
  const [view, setView] = useState(() => new URLSearchParams(window.location.search).get("view") ?? "overview");
  const dashboard = trpc.admin.dashboard.useQuery();
  const approveSeller = trpc.admin.approveSeller.useMutation({ onSuccess: result => { toast.success(result.message); dashboard.refetch(); }, onError: error => toast.error(error.message) });
  const approveProduct = trpc.admin.approveProduct.useMutation({ onSuccess: result => { toast.success(result.message); dashboard.refetch(); }, onError: error => toast.error(error.message) });
  const exportCsv = trpc.admin.exportOrdersCsv.useQuery(undefined, { enabled: false });

  if (dashboard.isLoading) return <PortalSkeleton />;
  const metrics = dashboard.data?.metrics; const queues = dashboard.data?.queues;

  const handleExportCsv = async () => {
    const result = await exportCsv.refetch();
    if (result.data) {
      const blob = new Blob([result.data], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `gavyadhenu-orders-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Orders report exported to CSV successfully.");
    }
  };

  return <><div className="portal-welcome admin-welcome"><div><span className="portal-kicker">PLATFORM CONTROL CENTER</span><h2>Keep the marketplace healthy.</h2><p>Review seller and product submissions, then keep every decision traceable in the audit log.</p></div><span className="admin-live"><span /> Live operations</span></div><div className="portal-stat-grid admin-stats"><PortalStat icon={Users} label="Customers" value={String(metrics?.customers ?? 0)} /><PortalStat icon={Store} label="Sellers" value={String(metrics?.sellers ?? 0)} /><PortalStat icon={Package} label="Products" value={String(metrics?.products ?? 0)} /><PortalStat icon={Wallet} label="Verified revenue" value={`₹${metrics?.revenue ?? 0}`} /></div><div className="portal-grid-two"><section className="portal-panel"><div className="portal-panel-head"><div><span className="portal-kicker">SELLER QUEUE</span><h3>Approvals needing review</h3></div><span className="queue-count">{metrics?.pendingSellers ?? 0}</span></div>{queues?.sellers.length ? <div className="approval-list">{queues.sellers.map(item => <div className="approval-row" key={item.profile.id}><div><b>{item.profile.storeName}</b><span>{item.user.name ?? item.user.email ?? "Seller applicant"}</span><small>{item.profile.businessAddress ?? "Business details pending"}</small></div><div className="approval-actions"><button className="portal-outline compact" onClick={() => approveSeller.mutate({ profileId: item.profile.id, status: "rejected" })}>Reject</button><button className="portal-primary compact" onClick={() => approveSeller.mutate({ profileId: item.profile.id, status: "verified" })}><Check size={14} /> Approve</button></div></div>)}</div> : <div className="portal-empty"><Check size={18} /> No seller approvals waiting.</div>}</section><section className="portal-panel"><div className="portal-panel-head"><div><span className="portal-kicker">PRODUCT QUEUE</span><h3>Products awaiting approval</h3></div><span className="queue-count">{metrics?.pendingProducts ?? 0}</span></div>{queues?.products.length ? <div className="approval-list">{queues.products.map((product: any) => <div className="approval-row" key={product.id}><div><b>{product.name}</b><span>{product.category} · ₹{product.price}</span><small>SKU {product.sku} · stock {product.stock}</small></div><div className="approval-actions"><button className="portal-outline compact" onClick={() => approveProduct.mutate({ productId: product.id, status: "rejected" })}>Reject</button><button className="portal-primary compact" onClick={() => approveProduct.mutate({ productId: product.id, status: "approved" })}><Check size={14} /> Approve</button></div></div>)}</div> : <div className="portal-empty"><Check size={18} /> No product approvals waiting.</div>}</section></div><section className="portal-panel portal-section"><div className="portal-panel-head"><div><span className="portal-kicker">CONTROL SURFACE</span><h3>Admin operations</h3></div></div><div className="portal-tool-grid"><button onClick={() => setView("bi")}><span className="tool-icon"><BarChart3 size={17} /></span><b>Executive BI & RFM</b><small>Platform revenue and customer cohorts</small></button><button onClick={() => setView("customers")}><span className="tool-icon"><Users size={17} /></span><b>Customer management</b><small>Search, activate, and review accounts</small></button><button onClick={handleExportCsv}><span className="tool-icon"><Download size={17} /></span><b>Export Orders CSV</b><small>Download orders and revenue reports</small></button><button onClick={() => toast.info("Payment records use verification-first statuses.")}><span className="tool-icon"><Wallet size={17} /></span><b>Payments & payouts</b><small>Review verified and pending money flows</small></button></div></section>{view === "bi" && <section className="portal-panel portal-section"><div className="portal-panel-head"><div><span className="portal-kicker">EXECUTIVE INTELLIGENCE</span><h3>Platform Business Intelligence & Telemetry</h3></div><button className="portal-icon-button" onClick={() => setView("overview")}><X size={17} /></button></div><AdminBIPanel /></section>}{view === "customers" && <AdminCustomersPanel onBack={() => setView("overview")} />}</>;
}

function AdminCustomersPanel({ onBack }: { onBack: () => void }) {
  const customers = trpc.admin.customers.useQuery();
  return (
    <section className="portal-panel portal-section">
      <div className="portal-panel-head">
        <div>
          <span className="portal-kicker">CUSTOMER INTELLIGENCE</span>
          <h3>Verified Customer Accounts</h3>
        </div>
        <button className="portal-icon-button" onClick={onBack}>
          <X size={17} />
        </button>
      </div>
      {customers.isLoading ? (
        <div className="portal-empty">Loading customers...</div>
      ) : (
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.data?.map((c) => (
                <tr key={c.id}>
                  <td><b>{c.name || "Member"}</b></td>
                  <td>
                    <span>{c.email}</span>
                    <small>{c.phone}</small>
                  </td>
                  <td><span className="status-chip">{c.role}</span></td>
                  <td>{c.orderCount}</td>
                  <td>₹{c.totalSpent}</td>
                  <td>
                    <span className={`status-chip ${c.isActive ? "verified" : "rejected"}`}>
                      {c.isActive ? "Active" : "Suspended"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function NotificationPanel({ items }: { items: Array<{ id: number; title: string; message: string; isRead: boolean; createdAt: Date }> }) { return <section className="portal-panel portal-section"><div className="portal-panel-head"><div><span className="portal-kicker">INBOX</span><h3>Notifications</h3></div></div>{items.length ? <div className="notification-list">{items.map(item => <div className={`notification-row ${item.isRead ? "" : "unread"}`} key={item.id}><Bell size={16} /><div><b>{item.title}</b><span>{item.message}</span><small>{new Date(item.createdAt).toLocaleString()}</small></div></div>)}</div> : <div className="portal-empty">You’re all caught up.</div>}</section>; }
function WishlistPanel({ items, onRemove }: { items: Array<{ item: { id: number; productId: number }; product: { id: number; slug: string; name: string; description: string | null; price: string; imageUrl: string | null }; seller: { storeName: string } | null }>; onRemove: (productId: number) => void }) { return <section className="portal-panel portal-section"><div className="portal-panel-head"><div><span className="portal-kicker">SAVED HARVESTS</span><h3>Your wishlist</h3></div></div>{items.length ? <div className="wishlist-list">{items.map(item => <div className="wishlist-row" key={item.item.id}><div className="wishlist-art">{item.product.imageUrl ? <img src={item.product.imageUrl} alt="" /> : <Heart size={19} />}</div><div><b>{item.product.name}</b><small>{item.seller?.storeName ?? "Partner farm"}</small><span>₹{Number(item.product.price).toLocaleString("en-IN")}</span></div><Link className="portal-outline compact" href={`/product/${item.product.slug}`}>View</Link><button className="portal-danger" onClick={() => onRemove(item.product.id)} aria-label={`Remove ${item.product.name} from wishlist`}><Trash2 size={15} /></button></div>)}</div> : <div className="portal-empty">Save products you love here.</div>}</section>; }

function OrdersPanel({ items }: { items: Array<{ order: { orderNumber: string; createdAt: Date; total: string; paymentStatus: string; status: string }; items: Array<{ id: number; productName: string; quantity: number; unitPrice: string }> }> }) {
  const cancel = trpc.customer.cancelOrder.useMutation({
    onSuccess: () => toast.success("Order cancelled successfully."),
    onError: error => toast.error(error.message)
  });
  const requestReturn = trpc.customer.requestReturn.useMutation({
    onSuccess: (data) => toast.success(data.message),
    onError: error => toast.error(error.message)
  });

  return <section className="portal-panel portal-section">
    <div className="portal-panel-head"><div><span className="portal-kicker">ORDER HISTORY</span><h3>My orders</h3></div></div>
    {items.length ? (
      <div className="portal-table-wrap">
        <table className="portal-table">
          <thead>
            <tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.order.orderNumber}>
                <td><b>#{item.order.orderNumber}</b></td>
                <td>{new Date(item.order.createdAt).toLocaleDateString()}</td>
                <td>{item.items.map(line => `${line.productName} × ${line.quantity}`).join(", ")}</td>
                <td>₹{item.order.total}</td>
                <td><span className="status-chip">{item.order.paymentStatus}</span></td>
                <td><span className="status-chip">{item.order.status.replace("_", " ")}</span></td>
                <td style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <Link href={`/order-success?order=${encodeURIComponent(item.order.orderNumber)}`} className="portal-text-link">Track</Link>
                  {["placed", "confirmed"].includes(item.order.status) && (
                    <button className="portal-text-button" onClick={() => window.confirm("Are you sure you want to cancel this order?") && cancel.mutate({ orderNumber: item.order.orderNumber })}>Cancel</button>
                  )}
                  {item.order.status === "delivered" && (
                    <button className="portal-text-button" onClick={() => {
                      const reason = window.prompt("Reason for return request (e.g. damaged seal, broken jar, freshness issue):");
                      if (reason) requestReturn.mutate({ orderNumber: item.order.orderNumber, reason });
                    }}>Return</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : <div className="portal-empty">You haven’t placed any orders yet.</div>}
  </section>;
}
function PortalStat({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string }) { return <div className="portal-stat"><span className="stat-icon"><Icon size={18} /></span><div><small>{label}</small><strong>{value}</strong></div></div>; }
function PortalSkeleton() { return <div className="portal-skeleton"><div /><div /><div /><div /></div>; }

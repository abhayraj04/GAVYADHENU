import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { BarChart3, BellRing, CheckCircle2, ChevronRight, CircleUserRound, ClipboardList, CreditCard, Database, FileText, Leaf, LogOut, Mail, Package, ShieldCheck, Store, Truck, UserRound, Users, X } from "lucide-react";
import { useState } from "react";

type Workspace = "customer" | "seller" | "admin";

export function RoleWorkspace({ onClose }: { onClose: () => void }) {
  const [workspace, setWorkspace] = useState<Workspace>("customer");
  const [workspaceNotice, setWorkspaceNotice] = useState("");
  const { user, isAuthenticated, logout } = useAuth();
  const emailStatus = trpc.email.status.useQuery();

  return <div className="workspace-overlay" onClick={onClose}><aside className="workspace-drawer" onClick={event => event.stopPropagation()}>
    <header className="workspace-header"><div className="workspace-brand"><span className="workspace-brand-icon"><Leaf size={17} /></span><div><b>Gavyadhenu workspaces</b><small>One platform. Every role.</small></div></div><button className="icon-button" onClick={onClose} aria-label="Close workspaces"><X size={19} /></button></header>
    <div className="workspace-tabs" role="tablist">{([['customer', CircleUserRound, 'Customer'], ['seller', Store, 'Seller'], ['admin', ShieldCheck, 'Admin']] as const).map(([key, Icon, label]) => <button key={key} className={workspace === key ? "selected" : ""} onClick={() => setWorkspace(key)} role="tab" aria-selected={workspace === key}><Icon size={16} />{label}</button>)}</div>
    {!isAuthenticated && <div className="workspace-login"><div className="workspace-login-icon"><UserRound size={25} /></div><span className="soft-label">PREVIEW MODE</span><h2>Explore every workspace.</h2><p>Customer, Seller and Admin sections are available to explore now. Sign in to connect live orders, products, permissions and profile data.</p><button className="button button-primary" onClick={() => startLogin()}>Sign in securely <ChevronRight size={15} /></button></div>}
    {isAuthenticated && <div className="profile-banner"><div className="profile-avatar">{(user?.name || "G").slice(0, 1).toUpperCase()}</div><div><b>{user?.name || "Gavyadhenu member"}</b><span>{user?.email || "Verified account"}</span></div><span className="profile-role">{user?.role === "admin" ? "Admin" : workspace === "seller" ? "Seller" : "Customer"}</span></div>}
    {workspace === "customer" && <CustomerPanel onAction={setWorkspaceNotice} />}
    {workspace === "seller" && <SellerPanel onAction={setWorkspaceNotice} />}
    {workspace === "admin" && <AdminPanel emailStatus={emailStatus.data} onAction={setWorkspaceNotice} />}
    {workspaceNotice && <div className="workspace-action-note"><CheckCircle2 size={15} /><span>{workspaceNotice}</span><button onClick={() => setWorkspaceNotice("")} aria-label="Dismiss workspace notice"><X size={13} /></button></div>}
    {isAuthenticated && <button className="workspace-logout" onClick={logout}><LogOut size={14} /> Sign out of this account</button>}
  </aside></div>;
}

function CustomerPanel({ onAction }: { onAction: (title: string) => void }) {
  return <div className="workspace-panel"><div className="workspace-panel-heading"><div><span className="soft-label">CUSTOMER HOME</span><h2>Your care, all in one place.</h2></div><span className="workspace-live"><span /> Active</span></div><div className="workspace-stats"><div><Package size={17} /><b>0</b><span>Open orders</span></div><div><HeartIcon /><b>0</b><span>Saved harvests</span></div><div><Truck size={17} /><b>3–5</b><span>Delivery days</span></div></div><div className="workspace-list"><WorkspaceItem onAction={onAction} icon={ClipboardList} title="Orders & tracking" meta="View status, invoices and delivery updates" /><WorkspaceItem onAction={onAction} icon={CircleUserRound} title="Profile & addresses" meta="Keep your details ready for checkout" /><WorkspaceItem onAction={onAction} icon={BellRing} title="Care reminders" meta="Seasonal prompts from Dhenu" /></div></div>;
}

function SellerPanel({ onAction }: { onAction: (title: string) => void }) {
  return <div className="workspace-panel"><div className="workspace-panel-heading"><div><span className="soft-label">PARTNER FARM CONSOLE</span><h2>Grow the harvest.</h2></div><span className="seller-chip"><Store size={13} /> Partner</span></div><div className="workspace-stats seller-stats"><div><BarChart3 size={17} /><b>₹0</b><span>This month</span></div><div><Package size={17} /><b>0</b><span>Harvests listed</span></div><div><Users size={17} /><b>0</b><span>Customers served</span></div></div><div className="workspace-list"><WorkspaceItem onAction={onAction} icon={Package} title="Product catalogue" meta="Add, edit and manage your harvests" /><WorkspaceItem onAction={onAction} icon={ClipboardList} title="Incoming orders" meta="Prepare, pack and update status" /><WorkspaceItem onAction={onAction} icon={CreditCard} title="Payouts & statements" meta="Track earnings and payment history" /><WorkspaceItem onAction={onAction} icon={FileText} title="Farm profile" meta="Tell customers how you care" /></div></div>;
}

function AdminPanel({ emailStatus, onAction }: { emailStatus?: { customerEmailTransport: boolean; ownerNotifications: boolean; note: string }; onAction: (title: string) => void }) {
  const customerReady = emailStatus?.customerEmailTransport ?? false;
  const ownerReady = emailStatus?.ownerNotifications ?? false;
  return <div className="workspace-panel"><div className="workspace-panel-heading"><div><span className="soft-label">OPERATIONS CONTROL</span><h2>See the whole system.</h2></div><span className="admin-chip"><ShieldCheck size={13} /> Protected</span></div><div className="workspace-stats admin-stats"><div><Users size={17} /><b>0</b><span>Customers</span></div><div><Store size={17} /><b>0</b><span>Partner farms</span></div><div><ClipboardList size={17} /><b>0</b><span>Orders today</span></div></div><div className="email-status-card"><div className="email-status-top"><div className="email-status-icon"><Mail size={17} /></div><div><span className="soft-label">EMAIL DELIVERY</span><b>{customerReady ? "Customer email is active" : "Customer email is not configured"}</b></div><span className={`status-dot ${customerReady ? "ready" : "not-ready"}`} /></div><p>{customerReady ? "Order confirmations can be delivered from the configured transporter." : "Order confirmation emails are not being sent yet. Add a server-side SMTP or transactional email provider before launch."}</p><div className="email-checks"><span className={ownerReady ? "ready" : "not-ready"}><CheckCircle2 size={13} /> Owner notifications {ownerReady ? "ready" : "not configured"}</span><span className={customerReady ? "ready" : "not-ready"}><Mail size={13} /> Customer email {customerReady ? "ready" : "needs setup"}</span></div></div><div className="workspace-list"><WorkspaceItem onAction={onAction} icon={BarChart3} title="Business overview" meta="Revenue, conversion and customer health" /><WorkspaceItem onAction={onAction} icon={Users} title="Customers & roles" meta="Manage customer, seller and admin access" /><WorkspaceItem onAction={onAction} icon={Database} title="Data & integrations" meta="Database, email and notification health" /><WorkspaceItem onAction={onAction} icon={ShieldCheck} title="Security & permissions" meta="Protected actions and audit trail" /></div></div>;
}

function WorkspaceItem({ icon: Icon, title, meta, onAction }: { icon: typeof Package; title: string; meta: string; onAction: (title: string) => void }) { return <button className="workspace-item" onClick={() => onAction(`${title} is ready for account setup and live data integration.`)}><span className="workspace-item-icon"><Icon size={16} /></span><span><b>{title}</b><small>{meta}</small></span><ChevronRight size={15} /></button>; }
function HeartIcon() { return <span className="heart-glyph">♡</span>; }

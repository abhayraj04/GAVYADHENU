import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowRight, LayoutDashboard, Leaf, ShieldCheck, Sparkles, Store, UserRound } from "lucide-react";
import { Link, useLocation } from "wouter";

const roles = [
  { role: "customer", title: "Customer account", description: "Save your basket, track orders, manage addresses, and keep a wishlist.", icon: UserRound, href: "/customer", accent: "green" },
  { role: "seller", title: "Seller studio", description: "Apply to become a partner, submit products, and manage approved orders.", icon: Store, href: "/seller", accent: "clay" },
  { role: "admin", title: "Admin control", description: "Review sellers and products, monitor platform operations, and manage approvals.", icon: ShieldCheck, href: "/admin", accent: "blue" },
];

export default function AccountAccess() {
  const { user, loading, logout, refresh } = useAuth();
  const [, setLocation] = useLocation();
  const actualRole = user?.role === "admin" ? "admin" : user?.role === "seller" ? "seller" : "customer";
  const signOutForAnotherAccount = async () => { await logout(); setLocation("/account"); };

  const devLogin = trpc.auth.devLogin.useMutation({
    onSuccess: async (data) => {
      toast.success(`Welcome, ${data.user?.name}! Switched to ${data.role} persona.`);
      await refresh();
      if (data.role === "admin") setLocation("/admin");
      else if (data.role === "seller") setLocation("/seller");
      else setLocation("/customer");
    },
    onError: (err) => toast.error(err.message || "Failed to switch persona"),
  });

  return (
    <div className="account-page">
      <header className="account-header">
        <Link href="/" className="storefront-logo">
          <span className="logo-mark"><Leaf size={17} /></span>
          <span>gavyadhenu<small>care, made visible</small></span>
        </Link>
        <Link href="/" className="account-back">Back to storefront <ArrowRight size={15} /></Link>
      </header>

      <main className="account-main">
        <section className="account-intro">
          <span className="store-kicker">YOUR GAVYADHENU ACCOUNT</span>
          <h1>One account. The right space for you.</h1>
          <p>Sign in to continue, or choose a sandbox persona below to explore all modules including Dhenu AI, Crop Doctor, Pashu Care, and Executive BI.</p>
          <div className="account-actions">
            {user ? (
              <>
                <button className="store-primary" onClick={() => setLocation(`/${actualRole}`)}>
                  Open my {actualRole} space <ArrowRight size={16} />
                </button>
                <button className="store-secondary" onClick={signOutForAnotherAccount}>
                  Sign out / use another account
                </button>
              </>
            ) : (
              <>
                <button className="store-primary" onClick={() => devLogin.mutate({ role: "customer" })}>
                  <Sparkles size={16} /> Enter as Demo Customer
                </button>
                <button className="store-secondary" onClick={() => startLogin("signIn")}>
                  Sign in with OAuth
                </button>
              </>
            )}
          </div>
          {user && (
            <p className="account-signed-in">
              Signed in as <b>{user.name ?? user.email ?? "Gavyadhenu member"}</b> ({actualRole}).
            </p>
          )}
        </section>

        {/* Sandbox Quick Persona Access Card */}
        <section className="rounded-2xl border border-emerald-800/20 bg-emerald-950/20 p-6 my-6">
          <div className="flex items-center gap-2 mb-2 text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
            <Sparkles size={16} className="text-amber-500" />
            <span>INSTANT DEMO PERSONA ACCESS (DEVELOPER SANDBOX)</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Test each workspace instantly with pre-seeded data, real-time analytics, and role-based permissions:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              disabled={devLogin.isPending}
              onClick={() => devLogin.mutate({ role: "customer" })}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-emerald-700/30 bg-emerald-900/10 hover:bg-emerald-900/20 transition text-left"
            >
              <UserRound className="text-emerald-600 mt-0.5" size={20} />
              <div>
                <b className="text-xs block text-foreground">Rahul Sharma</b>
                <span className="text-[11px] text-muted-foreground block">Customer: Cart, Orders, AI Crop & Livestock</span>
              </div>
            </button>

            <button
              disabled={devLogin.isPending}
              onClick={() => devLogin.mutate({ role: "seller" })}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-amber-700/30 bg-amber-900/10 hover:bg-amber-900/20 transition text-left"
            >
              <Store className="text-amber-600 mt-0.5" size={20} />
              <div>
                <b className="text-xs block text-foreground">Gir Amrit Sanctuary</b>
                <span className="text-[11px] text-muted-foreground block">Verified Seller: Product Catalog & AI Forecasting</span>
              </div>
            </button>

            <button
              disabled={devLogin.isPending}
              onClick={() => devLogin.mutate({ role: "admin" })}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-blue-700/30 bg-blue-900/10 hover:bg-blue-900/20 transition text-left"
            >
              <ShieldCheck className="text-blue-600 mt-0.5" size={20} />
              <div>
                <b className="text-xs block text-foreground">Dr. Meenakshi Sundaram</b>
                <span className="text-[11px] text-muted-foreground block">Platform Admin: Executive BI & Approvals Queue</span>
              </div>
            </button>
          </div>
        </section>

        <section className="account-roles">
          <div className="account-roles-head">
            <span className="store-kicker">CHOOSE YOUR SPACE</span>
            <h2>Access by role</h2>
            <p>Seller and admin access is protected by server-side approval. Select a space below to open it.</p>
          </div>
          <div className="account-role-grid">
            {roles.map((item) => {
              const Icon = item.icon;
              const isCurrent = user && actualRole === item.role;
              return (
                <article className={`account-role-card ${item.accent}`} key={item.role}>
                  <div className="account-role-icon"><Icon size={20} /></div>
                  <span className="account-role-label">{item.role}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <button
                    className="account-role-link"
                    onClick={() => devLogin.mutate({ role: item.role as any })}
                  >
                    {isCurrent ? "Open this space" : `Switch & Enter as ${item.role}`} <ArrowRight size={14} />
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

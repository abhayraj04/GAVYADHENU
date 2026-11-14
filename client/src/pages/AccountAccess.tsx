import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { COOKIE_NAME } from "@shared/const";
import { toast } from "sonner";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Flame,
  Heart,
  KeyRound,
  Leaf,
  Lock,
  Mail,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  User,
  UserCheck,
  UserPlus,
  UserRound,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";

const roles = [
  {
    role: "customer",
    title: "Customer Account",
    description: "Browse certified harvests, track orders, manage addresses, and consult AI Crop & Livestock advisors.",
    icon: UserRound,
    accent: "emerald",
    email: "customer@gavyadhenu.org",
    pass: "Customer@123",
    badge: "Shopper",
  },
  {
    role: "seller",
    title: "Seller Partner Studio",
    description: "Submit indigenous harvest listings, manage batch test reports, and fulfill approved customer orders.",
    icon: Store,
    accent: "amber",
    email: "seller@gavyadhenu.org",
    pass: "Seller@123",
    badge: "Verified Producer",
  },
  {
    role: "admin",
    title: "Admin Executive Control",
    description: "Platform operations, executive revenue analytics, seller verification, and order lifecycle oversight.",
    icon: ShieldCheck,
    accent: "blue",
    email: "admin@gavyadhenu.org",
    pass: "Admin@123",
    badge: "Platform Admin",
  },
];

export default function AccountAccess() {
  const { user, loading, logout, refresh } = useAuth();
  const [, setLocation] = useLocation();
  const actualRole = user?.role === "admin" ? "admin" : user?.role === "seller" ? "seller" : "customer";

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regTerms, setRegTerms] = useState(true);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotDispatched, setForgotDispatched] = useState<string | null>(null);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!regPassword) return 0;
    let score = 0;
    if (regPassword.length >= 6) score += 1;
    if (regPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(regPassword)) score += 1;
    if (/[0-9]/.test(regPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(regPassword)) score += 1;
    return score; // 0 to 5
  }, [regPassword]);

  const passwordsMatch = regPassword.length > 0 && regPassword === regConfirmPassword;

  // Persist session tokens for bulletproof authentication across any browser
  const saveSessionTokens = (sessionToken?: string) => {
    if (!sessionToken) return;
    try {
      localStorage.setItem("gavyadhenu-session-token", sessionToken);
      sessionStorage.setItem("manus-cookie", `${COOKIE_NAME}=${sessionToken}`);
    } catch {
      // storage quota or restrictions
    }
  };

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async (data) => {
      saveSessionTokens(data.sessionToken);
      toast.success(data.message || `Welcome back, ${data.user.name}!`);
      await refresh();
      if (data.user.role === "admin") setLocation("/admin");
      else if (data.user.role === "seller") setLocation("/seller");
      else setLocation("/customer");
    },
    onError: (err) => toast.error(err.message || "Failed to sign in. Please verify your credentials."),
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: async (data) => {
      saveSessionTokens(data.sessionToken);
      toast.success(data.message || "Account registered successfully! Welcome to Gavyadhenu.");
      await refresh();
      setLocation("/customer");
    },
    onError: (err) => toast.error(err.message || "Registration failed"),
  });

  const forgotMutation = trpc.auth.forgotPassword.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setForgotDispatched(data.resetToken || "dispatched");
    },
    onError: (err) => toast.error(err.message || "Failed to send reset link"),
  });

  const devLogin = trpc.auth.devLogin.useMutation({
    onSuccess: async (data) => {
      saveSessionTokens(data.sessionToken);
      toast.success(`Welcome, ${data.user?.name}! Switched to ${data.role} persona.`);
      await refresh();
      if (data.role === "admin") setLocation("/admin");
      else if (data.role === "seller") setLocation("/seller");
      else setLocation("/customer");
    },
    onError: (err) => toast.error(err.message || "Failed to switch persona"),
  });

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please enter both email and password");
      return;
    }
    loginMutation.mutate({
      email: loginEmail.trim(),
      password: loginPassword,
      rememberMe,
    });
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!regTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    registerMutation.mutate({
      fullName: regFullName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      password: regPassword,
      confirmPassword: regConfirmPassword,
      termsAccepted: regTerms,
    });
  };

  const handleForgotSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your registered email");
      return;
    }
    forgotMutation.mutate({ email: forgotEmail.trim() });
  };

  const signOutForAnotherAccount = async () => {
    try {
      localStorage.removeItem("gavyadhenu-session-token");
      sessionStorage.removeItem("manus-cookie");
      localStorage.removeItem("manus-runtime-user-info");
    } catch {}
    await logout();
    setLocation("/account");
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 flex flex-col selection:bg-emerald-200 dark:selection:bg-emerald-900">
      {/* Top Navigation Bar */}
      <header className="border-b border-[#e9e4db] dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/gavyadhenu-logo.png"
              alt="Gavyadhenu Logo"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg leading-tight tracking-tight text-[#1b3d18] dark:text-emerald-400">
                GAVYADHENU
              </span>
              <span className="text-[10px] tracking-wider uppercase text-neutral-500 dark:text-neutral-400 font-medium">
                Pure Vedic Harvests & Dairy
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-emerald-800 dark:hover:text-emerald-400 px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              Back to Storefront <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12">
        {/* Active Signed-in Banner */}
        {user && (
          <div className="mb-8 p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-amber-50 dark:from-emerald-950/40 dark:via-neutral-900 dark:to-amber-950/40 border border-emerald-300/80 dark:border-emerald-800/60 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-md">
                {user.name ? user.name[0].toUpperCase() : "M"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-base">
                    {user.name || "Member"}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setLocation(`/${actualRole}`)}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs transition shadow flex items-center justify-center gap-1.5"
              >
                Open {actualRole.toUpperCase()} Portal <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={signOutForAnotherAccount}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* 2-Column Luxury Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Brand Story & Trust Pillar */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold tracking-wide">
                <Sparkles size={13} className="text-amber-500" />
                <span>BHARAT&apos;S SACRED VEDIC HARVESTS</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 dark:text-neutral-50 leading-tight">
                Authentic organic food, rooted in timeless purity.
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Connect with verified indigenous farms, certified Gaushalas, and artisanal cold-pressed producers. Manage your orders, lab purity reports, and specialized farm advisory tools in one secure portal.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5 pt-2">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900/90 border border-[#e8dfcf] dark:border-neutral-800 shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shrink-0">
                  <Leaf size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                    100% Native A2 Bilona Churning
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal mt-0.5">
                    Made from indigenous Gir & Kankrej cows following Vedic curd-churned traditions.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900/90 border border-[#e8dfcf] dark:border-neutral-800 shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                    NABL Lab Test Traceability
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal mt-0.5">
                    Each batch tested for zero pesticides, no synthetic adulterants, and complete chemical purity.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900/90 border border-[#e8dfcf] dark:border-neutral-800 shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shrink-0">
                  <Truck size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                    Direct Farmgate Dispatch
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal mt-0.5">
                    Free doorstep delivery on orders above ₹999 across India with secure tamper-evident packaging.
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="p-4 rounded-2xl bg-[#f2ede4] dark:bg-neutral-900/50 border border-[#e2d8c7] dark:border-neutral-800/60 text-xs italic text-neutral-700 dark:text-neutral-300">
              &ldquo;The A2 Gir Cow Bilona Ghee smells and tastes exactly like what my grandmother prepared in Saurashtra. Truly authentic and therapeutic.&rdquo;
              <div className="mt-2 not-italic font-semibold text-[11px] text-neutral-900 dark:text-neutral-200">
                — Meera Sengupta, Verified Customer (Bengaluru)
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-[#e3d7c3] dark:border-neutral-800 shadow-xl overflow-hidden transition-all">
              {/* Dual Tab Mode Switcher */}
              <div className="flex border-b border-[#e8dfcf] dark:border-neutral-800 bg-[#f9f6f0] dark:bg-neutral-950 p-1.5 gap-1.5">
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 ${
                    authMode === "login"
                      ? "bg-white dark:bg-neutral-900 text-emerald-800 dark:text-emerald-300 shadow-sm border border-[#e5dcce] dark:border-neutral-800"
                      : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                  }`}
                >
                  <Lock size={15} />
                  <span>Sign In to Account</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("register")}
                  className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 ${
                    authMode === "register"
                      ? "bg-white dark:bg-neutral-900 text-emerald-800 dark:text-emerald-300 shadow-sm border border-[#e5dcce] dark:border-neutral-800"
                      : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                  }`}
                >
                  <UserPlus size={15} />
                  <span>Create New Account</span>
                </button>
              </div>

              <div className="p-6 sm:p-8 md:p-10">
                {authMode === "login" ? (
                  /* ================= LOGIN FORM ================= */
                  <div className="space-y-6 max-w-lg mx-auto">
                    {/* Quick Demo Access Bar */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-[#faf7f2] to-amber-50 dark:from-emerald-950/40 dark:via-neutral-900 dark:to-amber-950/30 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wide">
                          <Sparkles size={14} className="text-amber-500" />
                          <span>Pre-Configured Demo Accounts</span>
                        </span>
                        <span className="text-[10px] text-neutral-500 font-medium">Click to test instant access</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {/* Admin Persona */}
                        <div className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-white/95 dark:bg-neutral-900/90 hover:border-blue-500 hover:shadow transition flex flex-col justify-between text-left">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-blue-800 dark:text-blue-300 flex items-center gap-1">
                                <ShieldCheck size={13} /> Admin
                              </span>
                              <span className="text-[9px] bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-mono">
                                Admin@123
                              </span>
                            </div>
                            <div className="text-[10px] text-neutral-500 truncate mt-1">admin@gavyadhenu.org</div>
                          </div>
                          <div className="flex gap-1.5 mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                            <button
                              type="button"
                              onClick={() => {
                                setLoginEmail("admin@gavyadhenu.org");
                                setLoginPassword("Admin@123");
                                toast.info("Admin credentials filled");
                              }}
                              className="flex-1 py-1 text-[10px] font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded hover:bg-neutral-200 transition text-center"
                            >
                              Fill
                            </button>
                            <button
                              type="button"
                              disabled={loginMutation.isPending}
                              onClick={() => {
                                setLoginEmail("admin@gavyadhenu.org");
                                setLoginPassword("Admin@123");
                                loginMutation.mutate({
                                  email: "admin@gavyadhenu.org",
                                  password: "Admin@123",
                                  rememberMe: true,
                                });
                              }}
                              className="flex-1 py-1 text-[10px] font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded transition text-center"
                            >
                              Login
                            </button>
                          </div>
                        </div>

                        {/* Seller Persona */}
                        <div className="p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-white/95 dark:bg-neutral-900/90 hover:border-amber-500 hover:shadow transition flex flex-col justify-between text-left">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-amber-800 dark:text-amber-300 flex items-center gap-1">
                                <Store size={13} /> Seller
                              </span>
                              <span className="text-[9px] bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded font-mono">
                                Seller@123
                              </span>
                            </div>
                            <div className="text-[10px] text-neutral-500 truncate mt-1">seller@gavyadhenu.org</div>
                          </div>
                          <div className="flex gap-1.5 mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                            <button
                              type="button"
                              onClick={() => {
                                setLoginEmail("seller@gavyadhenu.org");
                                setLoginPassword("Seller@123");
                                toast.info("Seller credentials filled");
                              }}
                              className="flex-1 py-1 text-[10px] font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded hover:bg-neutral-200 transition text-center"
                            >
                              Fill
                            </button>
                            <button
                              type="button"
                              disabled={loginMutation.isPending}
                              onClick={() => {
                                setLoginEmail("seller@gavyadhenu.org");
                                setLoginPassword("Seller@123");
                                loginMutation.mutate({
                                  email: "seller@gavyadhenu.org",
                                  password: "Seller@123",
                                  rememberMe: true,
                                });
                              }}
                              className="flex-1 py-1 text-[10px] font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded transition text-center"
                            >
                              Login
                            </button>
                          </div>
                        </div>

                        {/* Customer Persona */}
                        <div className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-white/95 dark:bg-neutral-900/90 hover:border-emerald-500 hover:shadow transition flex flex-col justify-between text-left">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                                <UserRound size={13} /> Customer
                              </span>
                              <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                                Customer@123
                              </span>
                            </div>
                            <div className="text-[10px] text-neutral-500 truncate mt-1">customer@gavyadhenu.org</div>
                          </div>
                          <div className="flex gap-1.5 mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                            <button
                              type="button"
                              onClick={() => {
                                setLoginEmail("customer@gavyadhenu.org");
                                setLoginPassword("Customer@123");
                                toast.info("Customer credentials filled");
                              }}
                              className="flex-1 py-1 text-[10px] font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded hover:bg-neutral-200 transition text-center"
                            >
                              Fill
                            </button>
                            <button
                              type="button"
                              disabled={loginMutation.isPending}
                              onClick={() => {
                                setLoginEmail("customer@gavyadhenu.org");
                                setLoginPassword("Customer@123");
                                loginMutation.mutate({
                                  email: "customer@gavyadhenu.org",
                                  password: "Customer@123",
                                  rememberMe: true,
                                });
                              }}
                              className="flex-1 py-1 text-[10px] font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition text-center"
                            >
                              Login
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Standard Email/Password Login Form */}
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wider">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <input
                            type="email"
                            required
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="admin@gavyadhenu.org or you@example.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white dark:focus:bg-neutral-800 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                            Password
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowForgotModal(true)}
                            className="text-xs text-emerald-800 dark:text-emerald-400 hover:underline font-medium"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white dark:focus:bg-neutral-800 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="rounded text-emerald-700 focus:ring-emerald-600"
                          />
                          <span>Keep me signed in for 30 days</span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full py-3.5 rounded-xl bg-[#234d1f] hover:bg-[#1a3a17] text-white font-semibold text-sm transition shadow-lg hover:shadow-xl disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
                      >
                        {loginMutation.isPending ? "Authenticating..." : "Sign In to Gavyadhenu"}
                        <ArrowRight size={16} />
                      </button>

                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => startLogin("signIn")}
                          className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 underline"
                        >
                          Or authenticate via Google / OAuth Single Sign-On
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* ================= REGISTRATION FORM ================= */
                  <form onSubmit={handleRegisterSubmit} className="space-y-4 max-w-lg mx-auto">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wider">
                        Full Legal Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                          type="text"
                          required
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="e.g. Ramesh Patel"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wider">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <input
                            type="email"
                            required
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="ramesh@example.com"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wider">
                          Mobile Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <input
                            type="tel"
                            required
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            placeholder="9876543210 or +91..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wider">
                          Password (6+ chars)
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            minLength={6}
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wider">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            minLength={6}
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Password Strength Meter & Matching Helper */}
                    {regPassword && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-500">
                            Strength:{" "}
                            <b>
                              {passwordStrength <= 2
                                ? "Fair"
                                : passwordStrength <= 4
                                ? "Good"
                                : "Strong"}
                            </b>
                          </span>
                          {regConfirmPassword && (
                            <span
                              className={`flex items-center gap-1 font-semibold ${
                                passwordsMatch ? "text-emerald-700" : "text-amber-700"
                              }`}
                            >
                              {passwordsMatch ? (
                                <>
                                  <Check size={12} /> Passwords match
                                </>
                              ) : (
                                "Passwords do not match yet"
                              )}
                            </span>
                          )}
                        </div>
                        <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden flex">
                          <div
                            className={`h-full transition-all duration-300 ${
                              passwordStrength <= 2
                                ? "bg-amber-500 w-1/3"
                                : passwordStrength <= 4
                                ? "bg-emerald-500 w-2/3"
                                : "bg-emerald-700 w-full"
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <label className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          required
                          checked={regTerms}
                          onChange={(e) => setRegTerms(e.target.checked)}
                          className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-600"
                        />
                        <span>
                          I agree to Gavyadhenu&apos;s Terms of Service, Privacy Policy, and Authentic Purity Standard charter.
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={registerMutation.isPending}
                      className="w-full py-3.5 rounded-xl bg-[#234d1f] hover:bg-[#1a3a17] text-white font-semibold text-sm transition shadow-lg hover:shadow-xl disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
                    >
                      {registerMutation.isPending ? "Creating your account..." : "Complete Registration"}
                      <ArrowRight size={16} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Persona Spaces Grid */}
        <section className="mt-16 pt-10 border-t border-[#e8dfcf] dark:border-neutral-800">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-800 dark:text-emerald-400">
              ROLE-BASED WORKSPACES
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              Select your workspace to enter
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Each portal is tailored with specialized capabilities for customers, producer partners, and platform administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {roles.map((item) => {
              const Icon = item.icon;
              const isCurrent = user && actualRole === item.role;
              return (
                <div
                  key={item.role}
                  className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                    item.role === "admin"
                      ? "bg-gradient-to-b from-blue-50/60 to-white dark:from-blue-950/20 dark:to-neutral-900 border-blue-200/80 dark:border-blue-900/40"
                      : item.role === "seller"
                      ? "bg-gradient-to-b from-amber-50/60 to-white dark:from-amber-950/20 dark:to-neutral-900 border-amber-200/80 dark:border-amber-900/40"
                      : "bg-gradient-to-b from-emerald-50/60 to-white dark:from-emerald-950/20 dark:to-neutral-900 border-emerald-200/80 dark:border-emerald-900/40"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`p-2.5 rounded-2xl ${
                          item.role === "admin"
                            ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                            : item.role === "seller"
                            ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                            : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                        }`}
                      >
                        <Icon size={22} />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-neutral-900 dark:text-neutral-100 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    <div className="p-2.5 rounded-xl bg-white/80 dark:bg-neutral-950/60 border border-neutral-200/70 dark:border-neutral-800 text-[11px] mb-4">
                      <div className="text-neutral-500 text-[10px]">Credentials:</div>
                      <div className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">{item.email}</div>
                      <div className="font-mono text-[10px] text-neutral-600 dark:text-neutral-400">{item.pass}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={devLogin.isPending}
                    onClick={() => devLogin.mutate({ role: item.role as any })}
                    className={`w-full py-2.5 rounded-xl font-semibold text-xs transition shadow-sm flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? "bg-emerald-800 text-white"
                        : item.role === "admin"
                        ? "bg-blue-700 hover:bg-blue-800 text-white"
                        : item.role === "seller"
                        ? "bg-amber-700 hover:bg-amber-800 text-white"
                        : "bg-emerald-700 hover:bg-emerald-800 text-white"
                    }`}
                  >
                    {isCurrent ? "Currently in this workspace" : `Switch & Enter as ${item.role}`}
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-neutral-200 dark:border-neutral-800 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
                <KeyRound size={24} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-neutral-900 dark:text-neutral-100">
                  Reset Password
                </h3>
                <p className="text-xs text-neutral-500">
                  Enter your email to receive an expirable recovery link.
                </p>
              </div>
            </div>

            {!forgotDispatched ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotMutation.isPending}
                    className="px-5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 disabled:opacity-60 shadow"
                  >
                    {forgotMutation.isPending ? "Generating link..." : "Send Reset Link"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                  <div className="font-semibold mb-1">Recovery Token Generated:</div>
                  <div className="font-mono text-[11px] break-all bg-white/70 dark:bg-black/30 p-2 rounded-lg">
                    {forgotDispatched}
                  </div>
                  <div className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-300">
                    In development mode, token verification is automatic.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotDispatched(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

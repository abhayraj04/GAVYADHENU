import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Check,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Store,
  UserCheck,
  UserRound,
  X,
} from "lucide-react";

export function DemoPersonaBar() {
  const { user, refresh, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  const devLogin = trpc.auth.devLogin.useMutation({
    onSuccess: async (data) => {
      if (data.sessionToken) {
        try {
          localStorage.setItem("gavyadhenu-session-token", data.sessionToken);
        } catch {}
      }
      toast.success(`Switched persona to ${data.user?.name} (${data.role})`);
      await refresh();
      setIsOpen(false);
      if (data.role === "admin") setLocation("/admin");
      else if (data.role === "seller") setLocation("/seller");
      else setLocation("/customer");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to switch persona");
    },
  });

  const currentRole = user?.role === "admin" ? "admin" : user?.role === "seller" ? "seller" : user ? "customer" : "guest";

  if (isMinimized) {
    return (
      <button
        className="fixed bottom-20 sm:bottom-4 left-3 sm:left-4 z-40 flex items-center gap-1.5 rounded-full border border-emerald-700/40 bg-emerald-950/90 px-2.5 py-1 text-[11px] font-medium text-emerald-200 shadow-xl backdrop-blur-md transition hover:bg-emerald-900 active:scale-95"
        onClick={() => setIsMinimized(false)}
        title="Open Role Switcher"
      >
        <Sparkles size={12} className="text-amber-300" />
        <span><b>{currentRole.toUpperCase()}</b></span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 sm:bottom-4 left-3 sm:left-4 z-40 max-w-[calc(100vw-24px)] flex flex-col gap-1 rounded-2xl border border-emerald-800/30 bg-slate-950/95 p-2.5 text-xs text-slate-200 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 px-1 pb-1 border-b border-white/10">
        <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
          <Sparkles size={13} className="text-amber-400" />
          <span>Gavyadhenu Role Switcher</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="text-slate-400 hover:text-white px-1"
            onClick={() => setIsMinimized(true)}
            title="Minimize bar"
          >
            _
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 pt-1">
        {/* Customer Button */}
        <button
          disabled={devLogin.isPending}
          onClick={() => devLogin.mutate({ role: "customer" })}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition ${
            currentRole === "customer"
              ? "bg-emerald-700 text-white font-semibold shadow-inner"
              : "bg-white/5 hover:bg-white/10 text-slate-300"
          }`}
          title="Switch to Customer: Rahul Sharma"
        >
          <UserRound size={13} />
          <span>Customer</span>
          {currentRole === "customer" && <Check size={12} className="text-emerald-200" />}
        </button>

        {/* Seller Button */}
        <button
          disabled={devLogin.isPending}
          onClick={() => devLogin.mutate({ role: "seller" })}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition ${
            currentRole === "seller"
              ? "bg-amber-700 text-white font-semibold shadow-inner"
              : "bg-white/5 hover:bg-white/10 text-slate-300"
          }`}
          title="Switch to Seller: Gir Amrit Sanctuary"
        >
          <Store size={13} />
          <span>Seller Studio</span>
          {currentRole === "seller" && <Check size={12} className="text-amber-200" />}
        </button>

        {/* Admin Button */}
        <button
          disabled={devLogin.isPending}
          onClick={() => devLogin.mutate({ role: "admin" })}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition ${
            currentRole === "admin"
              ? "bg-blue-700 text-white font-semibold shadow-inner"
              : "bg-white/5 hover:bg-white/10 text-slate-300"
          }`}
          title="Switch to Admin: Dr. Meenakshi Sundaram"
        >
          <ShieldCheck size={13} />
          <span>Admin</span>
          {currentRole === "admin" && <Check size={12} className="text-blue-200" />}
        </button>

        {/* Sign Out / Reset Button */}
        {user && (
          <button
            onClick={async () => {
              await logout();
              toast.info("Logged out from persona.");
              setLocation("/");
            }}
            className="rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 px-2 py-1.5 ml-1 transition"
            title="Log out back to Guest mode"
          >
            Reset
          </button>
        )}
      </div>
      <div className="text-[10px] text-slate-400 px-1 pt-0.5">
        Active: <span className="text-slate-200 font-medium">{user ? user.name : "Guest Visitor"}</span>
      </div>
    </div>
  );
}

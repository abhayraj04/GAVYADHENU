import { X, ShieldCheck, Truck, RefreshCw, FileText } from "lucide-react";

export type PolicyType = "privacy" | "terms" | "shipping" | "returns" | "about";

interface PolicyModalProps {
  type: PolicyType;
  onClose: () => void;
}

export function PolicyModal({ type, onClose }: PolicyModalProps) {
  const titles: Record<PolicyType, { title: string; icon: any }> = {
    privacy: { title: "Privacy Policy", icon: ShieldCheck },
    terms: { title: "Terms & Conditions", icon: FileText },
    shipping: { title: "Shipping & Delivery Policy", icon: Truck },
    returns: { title: "Return & Refund Policy", icon: RefreshCw },
    about: { title: "About Gavyadhenu Sanctuary", icon: ShieldCheck },
  };

  const { title, icon: Icon } = titles[type] || titles.privacy;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-neutral-900 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800 bg-[#faf7f2] dark:bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-[#2d5a27] dark:text-emerald-400">
              <Icon size={22} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Gavyadhenu Commercial Standards
              </span>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                {title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/50 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 space-y-4">
          {type === "privacy" && (
            <>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                Effective Date: January 1, 2026 · Compliant with Digital Personal Data Protection (DPDP) Act 2023.
              </p>
              <p>
                At Gavyadhenu, protecting your personal data is sacred. We only collect the minimal personal information necessary to deliver pure organic harvests to your home: your name, verified phone number, delivery address, and order transaction details.
              </p>
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mt-2">1. Zero Third-Party Monetization</h4>
              <p>
                We never rent, trade, sell, or disclose your contact details or browsing records to third-party ad networks or brokers.
              </p>
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mt-2">2. Payment Security</h4>
              <p>
                All online payments are securely processed through Razorpay's PCI-DSS Level 1 compliant gateway. Gavyadhenu does not store full credit card numbers or UPI PINs on its servers.
              </p>
            </>
          )}

          {type === "terms" && (
            <>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                Terms of Use and Sale · Gavyadhenu Farmstead Collective
              </p>
              <p>
                By placing an order on Gavyadhenu, you agree to these commercial terms. All items sold are authentic agricultural, botanical, and dairy harvests prepared according to traditional Vedic methods.
              </p>
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mt-2">Product Authenticity & Batch Variations</h4>
              <p>
                Because our A2 Gir cow ghee and cold-pressed oils are strictly handmade and unrefined, subtle seasonal variations in color, aroma, and natural grain texture may occur across batches. This is a sign of living purity.
              </p>
            </>
          )}

          {type === "shipping" && (
            <>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                Pan-India Express Shipping & Cold-Care Packaging
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Free Delivery:</strong> All orders above ₹999 qualify for free doorstep shipping across India. Standard orders below ₹999 incur a flat fee of ₹79.</li>
                <li><strong>Dispatch Timelines:</strong> Freshly packed within 24 hours of confirmation directly from our partner sanctuaries and organic co-ops.</li>
                <li><strong>Transit Duration:</strong> Metro cities arrive within 2–3 business days. Regional and tier-2/3 destinations arrive within 4–5 business days.</li>
                <li><strong>Protective Packaging:</strong> Glass jars (Ghee, Oils, Honey) are enclosed in 100% recyclable, biodegradable corrugated shock-cushions to prevent transit breakage.</li>
              </ul>
            </>
          )}

          {type === "returns" && (
            <>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                100% Purity Guarantee · 7-Day Hassle-Free Returns
              </p>
              <p>
                If your order arrives damaged, unsealed, or if you suspect any compromise in freshness or lab purity, we offer an immediate replacement or full refund within 7 days of delivery.
              </p>
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mt-2">How to Request a Return:</h4>
              <p>
                Simply navigate to your <strong>Customer Portal &gt; Orders &gt; Request Return</strong>, select the damaged or affected item, and our logistics partner will coordinate a pickup within 48 hours. Refunds are credited directly to your original payment method.
              </p>
            </>
          )}

          {type === "about" && (
            <>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                Our Vision: To preserve Bharat's Timeless traditions by delivering pure authentic, & naturally nourishing products to every home.
              </p>
              <p>
                Gavyadhenu was born from a deep reverence for the sacred Gir cow, indigenous heirloom seeds, and time-honored artisanal methods like wooden Bilona curd-churning and low-temperature Kolhu cold-pressing.
              </p>
              <p>
                Every harvest we offer is traceable to verified sanctuary farms in Gujarat, Rajasthan, Meghalaya, and Bihar.
              </p>
            </>
          )}
        </div>

        <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#2d5a27] text-white text-xs font-semibold hover:bg-[#23481f] transition"
          >
            Understood &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default PolicyModal;

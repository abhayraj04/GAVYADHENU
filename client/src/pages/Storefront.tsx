import { AIChatBox, type Message } from "@/components/AIChatBox";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUp,
  Award,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  Droplets,
  ExternalLink,
  Eye,
  Flame,
  Heart,
  HelpCircle,
  Leaf,
  Menu,
  Minus,
  Percent,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Stethoscope,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import {
  CompareFloatingBar,
  CompareItem,
  ProductCompareModal,
} from "@/components/ProductCompareModal";
import { getProductPhotos } from "@/productGalleries";
import { ProductImage } from "@/components/ProductImage";
import { PolicyModal, type PolicyType } from "@/components/PolicyModal";

const categories = [
  "All harvests",
  "Kitchen",
  "Wellness",
  "Home & Living",
  "Farm & Soil",
  "Gifting",
];

const priceFilters = [
  { label: "All prices", min: undefined, max: undefined },
  { label: "Under ₹300", min: undefined, max: 300 },
  { label: "₹300 – ₹600", min: 300, max: 600 },
  { label: "₹600 – ₹1000", min: 600, max: 1000 },
  { label: "₹1000+", min: 1000, max: undefined },
];

const introMessages: Message[] = [
  {
    role: "system",
    content: "You are Dhenu, Gavyadhenu's calm, practical and empathetic AI farm and shopping companion.",
  },
  {
    role: "assistant",
    content: "Namaste — I’m Dhenu, your traditional wellness and farm harvests guide. Ask me about our curd-churned A2 Bilona Ghee, wood-pressed oils, pure forest honey, or how to care for your soil and livestock.",
  },
];

type CatalogRow = {
  product: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    category: string;
    brand: string | null;
    sku: string;
    imageUrl: string | null;
    price: string;
    mrp: string | null;
    stock: number;
    status: string;
  };
  seller: { storeName: string } | null;
};

// Batch Lab Report Data (Anveshan Transparency Standard)
const BATCH_LAB_REPORTS = [
  {
    id: "A2G-2026-B12",
    productName: "Bilona A2 Vedic Gir Cow Ghee",
    batchNumber: "GD-A2G-2026-B12",
    mfgDate: "15 Oct 2026",
    expiryDate: "14 Oct 2027",
    origin: "Gir Amrit Organic Sanctuary, Junagadh, Gujarat",
    labName: "NABL Accredited Analytical Food Labs, Pune (ISO 17025)",
    reportId: "NABL/2026/GHEE-9842",
    tests: [
      { parameter: "Baudouin Test (Adulteration Test)", standard: "Negative", result: "Negative (Pure)", status: "Pass" },
      { parameter: "Free Fatty Acids (FFA as Oleic)", standard: "Max 1.4%", result: "0.26%", status: "Pass" },
      { parameter: "Reichert-Meissl (RM) Value", standard: "Min 26.0", result: "28.8", status: "Pass" },
      { parameter: "Peroxide Value", standard: "Max 1.0 meq/kg", result: "0.38 meq/kg", status: "Pass" },
      { parameter: "Heavy Metals (Lead, Mercury, Cadmium)", standard: "Not Detected", result: "0.00 ppm (Clean)", status: "Pass" },
      { parameter: "A2 Beta-Casein Genotyping", standard: "100% Indigenous Cow", result: "100% Pure A2", status: "Pass" },
    ],
  },
  {
    id: "WPO-2026-M04",
    productName: "Wood Pressed Yellow Mustard Oil",
    batchNumber: "GD-OIL-2026-M04",
    mfgDate: "20 Oct 2026",
    expiryDate: "19 Oct 2027",
    origin: "Rajasthan Organic Press Sanctuary, Alwar",
    labName: "National Agriculture Testing & Research Council",
    reportId: "NATRC/2026/OIL-4412",
    tests: [
      { parameter: "Argemone Oil Adulteration Test", standard: "Negative", result: "Negative (Pure)", status: "Pass" },
      { parameter: "Extraction Temperature", standard: "Below 45°C", result: "38.5°C (True Cold Pressed)", status: "Pass" },
      { parameter: "Acid Value", standard: "Max 4.0 mg KOH/g", result: "1.12 mg KOH/g", status: "Pass" },
      { parameter: "Natural Pungency (Allyl isothiocyanate)", standard: "Min 0.25%", result: "0.34%", status: "Pass" },
      { parameter: "Hexane / Solvent Residue", standard: "Nil", result: "Zero (Unrefined)", status: "Pass" },
    ],
  },
  {
    id: "RFH-2026-H09",
    productName: "Raw Wildflower Forest Honey",
    batchNumber: "GD-HNY-2026-H09",
    mfgDate: "05 Oct 2026",
    expiryDate: "04 Oct 2028",
    origin: "Satpura Deep Forest Deciduous Belt, Madhya Pradesh",
    labName: "Apex Food Purity & Pollen Analysis Lab",
    reportId: "AFPL/2026/HONEY-7731",
    tests: [
      { parameter: "C4 Sugar (Corn / Cane Syrup Addition)", standard: "Max 7%", result: "0.0% (Zero Added Sugar)", status: "Pass" },
      { parameter: "Moisture Content", standard: "Max 20%", result: "17.4%", status: "Pass" },
      { parameter: "Hydroxymethylfurfural (HMF - Heat Test)", standard: "Max 80 mg/kg", result: "12.8 mg/kg (Unheated)", status: "Pass" },
      { parameter: "Antibiotics & Pesticide Residue", standard: "Not Detected", result: "Zero Detected", status: "Pass" },
    ],
  },
  {
    id: "LAK-2026-T03",
    productName: "Golden Lakadong High-Curcumin Turmeric",
    batchNumber: "GD-HLD-2026-T03",
    mfgDate: "12 Oct 2026",
    expiryDate: "11 Oct 2028",
    origin: "Jaintia Hills Organic Collective, Meghalaya",
    labName: "Spice Board Quality Evaluation Laboratory",
    reportId: "SBQEL/2026/TUR-5129",
    tests: [
      { parameter: "Curcumin Content (Active Compound)", standard: "Market avg: 2-3%", result: "7.82% (Super Grade)", status: "Pass" },
      { parameter: "Lead Chromate (Artificial Dye)", standard: "Negative", result: "Negative (Natural)", status: "Pass" },
      { parameter: "Total Ash Content", standard: "Max 8.0%", result: "5.4%", status: "Pass" },
      { parameter: "Essential Oil Content", standard: "Min 3.5%", result: "5.1%", status: "Pass" },
    ],
  },
];

// Anveshan 5-Step Process Data
const ANVESHAN_CRAFT_STEPS = [
  {
    step: "01",
    title: "Grass-Fed Indigenous Cows",
    desc: "Milk ethically sourced only from free-grazing native Gir & Sahiwal cows after calves have nursed.",
  },
  {
    step: "02",
    title: "Clay Pot Overnight Curdling",
    desc: "Fresh raw A2 milk is boiled over firewood and naturally cultured in earthen clay pots into rich curd (dahi).",
  },
  {
    step: "03",
    title: "Bi-Directional Wooden Bilona",
    desc: "Whole curd is hand-churned in both directions with a traditional wooden bilona to separate aromatic butter.",
  },
  {
    step: "04",
    title: "Slow Fire Clarification",
    desc: "Pure makkhan is gently simmered over cow-dung cake low fire in brass pots until golden granules develop.",
  },
  {
    step: "05",
    title: "Sterilized Glass Packaging",
    desc: "Poured warm into amber glass jars with batch QR codes linking to authentic accredited lab certificates.",
  },
];

// FAQ Accordion Data
const FAQS = [
  {
    q: "Why is Bilona A2 Desi Ghee superior to regular commercial ghee?",
    a: "Commercial ghee is made in industrial factories by heating direct milk cream with synthetic stabilizers. Authentic Bilona Ghee requires 30 litres of native Gir cow milk to yield just 1 litre of ghee, as it is slow-churned from cultured whole curd (dahi) using a wooden churner. This preserves vital butyric acid, natural fat-soluble vitamins (A, D, E, K), and authentic granular aroma.",
  },
  {
    q: "Can Gavyadhenu Wood-Pressed Oils be used for everyday Indian high-heat cooking?",
    a: "Absolutely. Our wood-pressed yellow mustard and groundnut oils have high natural smoke points (above 230°C). Because they are cold-extracted in wooden Kolhu below 45°C without chemical solvents or bleaching, they retain all natural antioxidants, monounsaturated fats (MUFA), and rich aroma without breaking down under heat.",
  },
  {
    q: "Why does pure Raw Wild Forest Honey crystallize over time?",
    a: "Natural crystallization is the ultimate hallmark of 100% pure, unadulterated honey! Commercial brands boil their honey at high temperatures to prevent crystallization, which kills natural pollen and bee enzymes. Our honey is raw and unprocessed, meaning natural glucose and fructose will gradually crystallize in cooler weather.",
  },
  {
    q: "How do I check the purity lab test report of my jar?",
    a: "Every single jar and bottle features a unique batch number and QR code. You can either scan the QR code with your phone or select the batch in our 'Track Your Batch' section above to inspect the complete 26-parameter NABL lab certificate showing Baudouin test, FFA, and heavy metal results.",
  },
  {
    q: "What is A2 Beta-Casein and why is it easier to digest?",
    a: "Indigenous Indian cows (Bos Indicus) naturally produce A2 beta-casein protein, which does not release the inflammatory peptide BCM-7 during digestion. This makes A2 milk and ghee naturally gentle on the digestive tract, gut flora, and suitable even for individuals sensitive to regular commercial A1 dairy.",
  },
  {
    q: "How does Gavyadhenu support rural sanctuary farmers?",
    a: "We practice direct-to-consumer ethical fair trade. We partner with over 500+ rural sanctuary farmers and gaushalas, paying them 30% to 40% above prevailing mandi rates, supporting regenerative farming, cow welfare, and sustainable rural livelihood.",
  },
];

function getSessionId(): string {
  if (typeof window === "undefined") return "guest-session";
  let sid = localStorage.getItem("gd_session_id");
  if (!sid) {
    sid = "sess_" + Math.random().toString(36).substring(2, 12);
    localStorage.setItem("gd_session_id", sid);
  }
  return sid;
}

export default function Storefront() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [category, setCategory] = useState("All harvests");
  const [query, setQuery] = useState("");
  const [priceIndex, setPriceIndex] = useState(0);
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "name_asc">("newest");
  const [cartOpen, setCartOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [compareList, setCompareList] = useState<CompareItem[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [selectedBatchIndex, setSelectedBatchIndex] = useState(0);
  const [labModalOpen, setLabModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [quickViewRow, setQuickViewRow] = useState<CatalogRow | null>(null);
  const [quickViewPhotoIndex, setQuickViewPhotoIndex] = useState(0);
  const [quickViewVariantIndex, setQuickViewVariantIndex] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType | null>(null);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 450);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sessionId = useMemo(() => getSessionId(), []);

  const selectedPrice = priceFilters[priceIndex];
  const catalog = trpc.catalog.list.useQuery({
    category: category === "All harvests" ? undefined : category,
    query: query.trim() || undefined,
    minPrice: selectedPrice.min,
    maxPrice: selectedPrice.max,
    sortBy,
  });

  const cartCount =
    trpc.customer.dashboard.useQuery(undefined, { enabled: isAuthenticated }).data?.cartCount ?? 0;

  const addToCart = trpc.customer.addToCart.useMutation({
    onSuccess: (result) => {
      toast.success(result.message);
      setCartOpen(true);
    },
    onError: (error) => toast.error(error.message),
  });

  const recordView = trpc.catalog.recordView.useMutation();

  const [messages, setMessages] = useState<Message[]>(introMessages);

  const utils = trpc.useUtils();
  const chat = trpc.ai.chat.useMutation({
    onSuccess: (response) => {
      setMessages((current) => [...current, { role: "assistant", content: response }]);
      if (response.includes("Basket Updated") || response.includes("added")) {
        utils.customer.dashboard.invalidate();
        utils.customer.cart.invalidate();
      }
    },
    onError: () => toast.error("Dhenu is taking a quiet moment. Please try again."),
  });

  const products = (catalog.data ?? []) as CatalogRow[];

  const handleAdd = (product: CatalogRow["product"]) => {
    if (!isAuthenticated) {
      toast.info("Sign in to save your basket across devices.");
      startLogin();
      return;
    }
    addToCart.mutate({ productId: product.id, quantity: 1 });
  };

  const handleToggleCompare = (product: CatalogRow["product"], sellerStore?: string) => {
    setCompareList((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        toast.info(`Removed ${product.name} from comparison.`);
        return prev.filter((item) => item.id !== product.id);
      }
      if (prev.length >= 3) {
        toast.error("You can compare up to 3 products at a time.");
        return prev;
      }
      toast.success(`Added ${product.name} to comparison.`);
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          category: product.category,
          price: product.price,
          mrp: product.mrp,
          imageUrl: product.imageUrl,
          stock: product.stock,
          description: product.description,
          sellerStore,
          brand: product.brand,
        },
      ];
    });
  };

  const handleProductClick = (productId: number) => {
    recordView.mutate({ productId, sessionId });
  };

  const activeBatch = BATCH_LAB_REPORTS[selectedBatchIndex];

  // Circle Navigation Items (Anveshan Farm Signature Row with real packaging photos)
  const categoryCircles = [
    {
      label: "A2 Desi Ghee",
      image: "/products/bilona-a2-ghee.jpg",
      category: "Kitchen",
      filterText: "Ghee",
    },
    {
      label: "Wood Pressed Oils",
      image: "/products/yellow-mustard-oil.jpg",
      category: "Kitchen",
      filterText: "Oil",
    },
    {
      label: "Raw Wild Honey",
      image: "/products/wildflower-honey.jpg",
      category: "Kitchen",
      filterText: "Honey",
    },
    {
      label: "Heritage Spices",
      image: "/products/lakadong-turmeric-front.jpg",
      category: "All harvests",
      filterText: "Turmeric",
    },
    {
      label: "Coriander & Chilli",
      image: "/products/coriander-powder-front.jpg",
      category: "Kitchen",
      filterText: "Stone Ground",
    },
    {
      label: "Atta & Sattu",
      image: "/products/mp-sharbati-wheat-flour.jpg",
      category: "Kitchen",
      filterText: "Flour",
    },
    {
      label: "Gift Combos",
      image: "/products/the-living-gift-box.jpg",
      category: "Gifting",
      filterText: "",
    },
    {
      label: "Pashu & Farm Care",
      image: "/products/pashu-starter-pack.jpg",
      category: "Farm & Soil",
      filterText: "",
    },
  ];

  return (
    <div className="anveshan-storefront">
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="anv-announcement-bar">
        <div className="anv-announcement-inner">
          <div className="anv-ticker-items">
            <span className="anv-ticker-item">
              <Truck size={13} /> Free Express Delivery on orders above ₹999 across India · Code <b className="highlight">PURE150</b>
            </span>
            <span className="anv-ticker-item anv-hide-mobile">
              <ShieldCheck size={13} /> 100% Traditional Bilona Churned & Cold Wood-Pressed
            </span>
          </div>
          <div className="anv-announcement-right anv-hide-mobile">
            <button
              onClick={() => document.getElementById("lab-reports")?.scrollIntoView({ behavior: "smooth" })}
            >
              Verify Batch Lab Report
            </button>
            <span>·</span>
            <button onClick={() => setAiOpen(true)}>
              Ask Dhenu AI
            </button>
          </div>
        </div>
      </div>

      {/* 2. STICKY HEADER */}
      <header className="anv-header-sticky">
        <div className="anv-header-wrap">
          {/* Mobile Hamburger Menu Toggle */}
          <button
            className="anv-mobile-menu-btn"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open mobile navigation menu"
          >
            <Menu size={22} />
          </button>

          {/* Brand Logo */}
          <Link href="/" className="anv-brand-link">
            <img
              src="/gavyadhenu-logo.png"
              alt="Gavyadhenu Logo"
              className="anv-brand-logo-img"
            />
            <div className="anv-brand-text">
              <span className="anv-brand-title">GAVYADHENU</span>
              <span className="anv-brand-subtitle">CELEBRATING BHARAT&apos;S TIMELESS FLAVOURS · 100% PURE</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="anv-nav-menu">
            <button
              className={`anv-nav-item ${category === "All harvests" ? "active" : ""}`}
              onClick={() => {
                setCategory("All harvests");
                setQuery("");
                setPriceIndex(0);
                document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Shop All
            </button>
            <button
              className="anv-nav-item"
              onClick={() => {
                setCategory("Kitchen");
                setQuery("Ghee");
                document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              A2 Desi Ghee <span className="anv-nav-badge">Bestseller</span>
            </button>
            <button
              className="anv-nav-item"
              onClick={() => {
                setCategory("Kitchen");
                setQuery("Oil");
                document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Wood Pressed Oils
            </button>
            <button
              className="anv-nav-item"
              onClick={() => {
                setCategory("Kitchen");
                setQuery("Honey");
                document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Raw Honey
            </button>
            <button
              className="anv-nav-item"
              onClick={() => {
                setCategory("Gifting");
                setQuery("");
                document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Combos & Gifts
            </button>
            <button
              className="anv-nav-item"
              onClick={() => document.getElementById("our-vision")?.scrollIntoView({ behavior: "smooth" })}
            >
              Our Vision
            </button>
            <button
              className="anv-nav-item"
              onClick={() => document.getElementById("lab-reports")?.scrollIntoView({ behavior: "smooth" })}
            >
              Lab Reports
            </button>
            <button
              className="anv-nav-item"
              onClick={() => document.getElementById("ai-ecosystem")?.scrollIntoView({ behavior: "smooth" })}
            >
              AI Farm Care <span className="anv-nav-badge ai">AI</span>
            </button>
          </nav>

          {/* Actions: Search, Compare, Account, Basket */}
          <div className="anv-header-actions">
            <div className="anv-search-box">
              <Search size={15} color="#576759" />
              <input
                type="text"
                placeholder="Search ghee, oils, honey..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  style={{ border: 0, background: "none", color: "#829184", cursor: "pointer", padding: 0 }}
                  onClick={() => setQuery("")}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {compareList.length > 0 && (
              <button
                className="anv-action-btn"
                onClick={() => setCompareModalOpen(true)}
                title="Compare selected harvests"
                aria-label="Compare selected products"
              >
                <ArrowLeftRight size={17} />
              </button>
            )}

            <button
              className="anv-action-btn"
              onClick={() =>
                setLocation(
                  !isAuthenticated
                    ? "/account"
                    : user?.role === "admin"
                    ? "/admin"
                    : user?.role === "seller"
                    ? "/seller"
                    : "/customer"
                )
              }
              title="Account & Orders"
              aria-label="Account"
            >
              <UserRound size={17} />
            </button>

            <button
              className="anv-cart-trigger"
              onClick={() => setCartOpen(true)}
              aria-label="View shopping basket"
            >
              <ShoppingBag size={16} />
              <span>Basket</span>
              <span className="anv-cart-count">{cartCount}</span>
            </button>
          </div>
        </div>

        {/* Secondary Sub-Navbar (Anveshan Category Strip) */}
        <div className="anv-subnav">
          <div className="anv-subnav-inner">
            <button
              className="anv-subnav-btn"
              onClick={() => { setCategory("Kitchen"); setQuery("Ghee"); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              <span className="emoji">🧈</span> A2 Bilona Ghee
            </button>
            <button
              className="anv-subnav-btn"
              onClick={() => { setCategory("Kitchen"); setQuery("Oil"); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              <span className="emoji">🌻</span> Wood Pressed Oils
            </button>
            <button
              className="anv-subnav-btn"
              onClick={() => { setCategory("Kitchen"); setQuery("Honey"); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              <span className="emoji">🍯</span> Raw Forest Honey
            </button>
            <button
              className="anv-subnav-btn"
              onClick={() => { setCategory("Kitchen"); setQuery("Flour"); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              <span className="emoji">🌾</span> Chakki Fresh Atta
            </button>
            <button
              className="anv-subnav-btn"
              onClick={() => { setCategory("Wellness"); setQuery("Haldi"); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              <span className="emoji">🌶️</span> Lakadong Haldi
            </button>
            <button
              className="anv-subnav-btn"
              onClick={() => { setCategory("Kitchen"); setQuery("Makhana"); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              <span className="emoji">🌰</span> Roasted Makhana
            </button>
            <button
              className="anv-subnav-btn"
              onClick={() => { setCategory("Gifting"); setQuery(""); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              <span className="emoji">🎁</span> Festive Hampers
            </button>
            <button
              className="anv-subnav-btn"
              onClick={() => document.getElementById("lab-reports")?.scrollIntoView({ behavior: "smooth" })}
            >
              <span className="emoji">🔬</span> Batch Lab Reports
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (ANVESHAN SIGNATURE LOOK) */}
      <section className="anv-hero-section">
        <div className="anv-hero-container">
          <div className="anv-hero-left">
            <div className="anv-hero-eyebrow">
              <Leaf size={13} /> TRADITIONAL BILONA & COLD WOOD-PRESSED
            </div>
            <h1 className="anv-hero-title">
              Pure Food, Crafted the Way <em>Nature Intended.</em>
            </h1>
            <p className="anv-hero-desc">
              Experience the ancient purity of whole curd-churned A2 Gir cow ghee, cold wood-pressed unrefined oils, and
              wild forest honey. Sourced directly from 500+ verified partner gaushalas, lab-tested across 26 parameters
              for absolute zero adulteration.
            </p>

            <div className="anv-hero-pillars">
              <div className="anv-pillar-badge">
                <ShieldCheck size={16} />
                <span>Curd-Churned Bilona Ghee</span>
              </div>
              <div className="anv-pillar-badge">
                <Droplets size={16} />
                <span>Wood-Pressed Below 45°C</span>
              </div>
              <div className="anv-pillar-badge">
                <Award size={16} />
                <span>26 Purity Lab Tests per Batch</span>
              </div>
              <div className="anv-pillar-badge">
                <Check size={16} />
                <span>100% Chemical & Hexane Free</span>
              </div>
            </div>

            <div className="anv-hero-actions">
              <button
                className="anv-btn-primary"
                onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
              >
                Shop Bestsellers <ArrowRight size={16} />
              </button>
              <button className="anv-btn-secondary" onClick={() => setAiOpen(true)}>
                <Sparkles size={15} color="#c47d2b" /> Ask Dhenu AI Advisor
              </button>
            </div>

            <div className="anv-hero-social-proof">
              <div className="anv-stars-group">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <span className="anv-proof-text">
                <b>4.9 / 5 Rating</b> based on 50,000+ conscious families across India
              </span>
            </div>
          </div>

          <div className="anv-hero-visual">
            <div className="anv-hero-main-card">
              <div className="anv-hero-image-box">
                <img
                  src="/products/bilona-a2-ghee.jpg"
                  alt="Traditional Bilona A2 Vedic Cow Ghee"
                />
              </div>
              <div className="anv-hero-floating-card">
                <div className="anv-floating-title">
                  <Award size={16} color="#c47d2b" /> 100% Certified A2 Beta-Casein
                </div>
                <div className="anv-floating-subtitle">
                  Slow-churned in earthen pots over cow-dung firewood · Zero industrial processing
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* As Seen On / Trust Proof Strip */}
      <section className="anv-media-strip">
        <div className="anv-media-inner">
          <span className="anv-media-label">TRUSTED & FEATURED IN:</span>
          <span className="anv-media-name">Forbes India</span>
          <span className="anv-media-name">Economic Times</span>
          <span className="anv-media-name">YourStory</span>
          <span className="anv-media-name">Inc42</span>
          <span className="anv-media-name">The Hindu</span>
        </div>
      </section>

      {/* OUR VISION SECTION (OFFICIAL EMBLEM & COMMITMENT) */}
      <section className="anv-vision-section" id="our-vision">
        <div className="anv-vision-card">
          <div className="anv-vision-logo-wrap">
            <img
              src="/gavyadhenu-logo.png"
              alt="Gavyadhenu Sacred Emblem"
              className="anv-vision-logo"
            />
          </div>
          <div className="anv-vision-content">
            <span className="anv-vision-kicker">GAVYADHENU · SANCTUARY PROMISE</span>
            <h2 className="anv-vision-heading">Our Vision</h2>
            <p className="anv-vision-quote">
              &ldquo;To preserve Bharat&apos;s Timeless traditions by delivering pure authentic, &amp; naturally nourishing products to every home.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* 4. CIRCULAR CATEGORY QUICK-NAVIGATION (THE ANVESHAN SIGNATURE ROW) */}
      <section className="anv-category-circles-section">
        <div className="anv-category-circles-wrap">
          <div className="anv-circles-heading">
            <h3>Explore Pure Farm Harvests</h3>
          </div>
          <div className="anv-circles-row">
            {categoryCircles.map((circle, index) => (
              <button
                key={index}
                className="anv-circle-item"
                onClick={() => {
                  setCategory(circle.category);
                  setQuery(circle.filterText);
                  setPriceIndex(0);
                  document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="anv-circle-avatar">
                  <img
                    src={circle.image}
                    alt={circle.label}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <span className="anv-circle-label">{circle.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BESTSELLERS & HARVESTS CATALOG */}
      <section id="catalog" className="anv-section">
        <div className="anv-container">
          <div className="anv-section-head">
            <div>
              <span className="anv-section-tag">HANDCRAFTED & LAB TESTED</span>
              <h2 className="anv-section-title">Pure Provenance Harvests</h2>
            </div>
            <p className="anv-section-subtitle">
              Every single batch is traceable back to its partner sanctuary gaushala, cold-extracted in small artisanal batches, and verified for zero chemical residue.
            </p>
          </div>

          {/* Filter & Sort Toolbar */}
          <div className="anv-filter-toolbar">
            <div className="anv-pills-group">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`anv-filter-pill ${category === cat ? "active" : ""}`}
                  onClick={() => {
                    setCategory(cat);
                    setQuery("");
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="anv-sort-dropdown">
              <label htmlFor="anv-sort">Sort By:</label>
              <select
                id="anv-sort"
                className="anv-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="newest">Featured / Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Price Filter & Results Summary Strip */}
          <div className="anv-results-meta">
            <div className="anv-price-pills">
              {priceFilters.map((pf, idx) => (
                <button
                  key={pf.label}
                  className={`anv-price-pill ${priceIndex === idx ? "active" : ""}`}
                  onClick={() => setPriceIndex(idx)}
                >
                  {pf.label}
                </button>
              ))}
            </div>
            <div className="anv-results-count">
              <span>
                Showing <b>{products.length}</b> pure harvest{products.length === 1 ? "" : "s"}
                {query ? ` for “${query}”` : ""}
              </span>
              {(category !== "All harvests" || query || priceIndex !== 0) && (
                <button
                  className="anv-reset-inline"
                  onClick={() => {
                    setCategory("All harvests");
                    setQuery("");
                    setPriceIndex(0);
                  }}
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {catalog.isLoading ? (
            <div className="store-empty">
              <RefreshCw size={26} className="animate-spin" />
              <h3>Loading honest farm harvests…</h3>
            </div>
          ) : products.length === 0 ? (
            <div className="store-empty">
              <Leaf size={32} />
              <h3>No harvests match your search criteria.</h3>
              <p>Try resetting filters or searching for ghee, mustard oil, or raw honey.</p>
              <button
                className="store-secondary"
                style={{ marginTop: 16 }}
                onClick={() => {
                  setCategory("All harvests");
                  setQuery("");
                  setPriceIndex(0);
                  setSortBy("newest");
                }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="anv-product-grid">
              {products.map((row) => (
                <AnveshanProductCard
                  key={row.product.id}
                  row={row}
                  onAdd={() => handleAdd(row.product)}
                  onToggleCompare={() => handleToggleCompare(row.product, row.seller?.storeName)}
                  onQuickView={() => {
                    setQuickViewRow(row);
                    setQuickViewPhotoIndex(0);
                    setQuickViewVariantIndex(0);
                  }}
                  isComparing={compareList.some((item) => item.id === row.product.id)}
                  onClick={() => handleProductClick(row.product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5-Stage Bilona & Cold-Pressed Craftsmanship Walkthrough */}
      <section className="anv-process-section">
        <div className="anv-container">
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
            <span className="anv-section-tag">ANCESTRAL VEDIC CRAFT</span>
            <h2 className="anv-section-title" style={{ fontSize: 36 }}>
              The 5-Step Traditional Bilona Method
            </h2>
            <p className="anv-section-subtitle" style={{ margin: "8px auto 0" }}>
              How our partner gaushalas craft pure liquid gold without modern industrial compromises.
            </p>
          </div>

          <div className="anv-process-grid">
            {ANVESHAN_CRAFT_STEPS.map((s) => (
              <div className="anv-process-card" key={s.step}>
                <div className="anv-process-num">{s.step}</div>
                <h4 className="anv-process-title">{s.title}</h4>
                <p className="anv-process-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. "WHY GAVYADHENU / THE ANVESHAN STANDARD" (4-PILLAR COMPARISON) */}
      <section className="anv-standards-section">
        <div className="anv-container">
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
            <span className="anv-section-tag">UNCOMPROMISING PURITY</span>
            <h2 className="anv-section-title" style={{ fontSize: 38 }}>
              Why We Are Fundamentally Different
            </h2>
            <p className="anv-section-subtitle" style={{ margin: "10px auto 0" }}>
              Commercial mass brands use high temperatures, chemical solvents, and direct cream. We preserve ancestral Vedic methods and verify every claim in accredited labs.
            </p>
          </div>

          <div className="anv-standards-grid">
            <div className="anv-standard-card">
              <div className="anv-standard-step">01</div>
              <h3 className="anv-standard-title">Whole Curd Bilona Churning</h3>
              <p className="anv-standard-desc">
                Our A2 ghee is churned from live cultured curd using traditional two-way wooden bilona in small batches over low fire.
              </p>
              <div className="anv-standard-comparison">
                <div className="anv-comparison-good">✓ Gavyadhenu: Whole A2 Curd · Wooden Bilona</div>
                <div className="anv-comparison-bad">✕ Mass Brands: Industrial Cream · Chemical Stabilizers</div>
              </div>
            </div>

            <div className="anv-standard-card">
              <div className="anv-standard-step">02</div>
              <h3 className="anv-standard-title">Cold Wood-Pressed Below 45°C</h3>
              <p className="anv-standard-desc">
                Our yellow mustard and groundnut oils are pressed slowly in traditional wooden kolhu without heating, retaining all natural vitamin E and plant sterols.
              </p>
              <div className="anv-standard-comparison">
                <div className="anv-comparison-good">✓ Gavyadhenu: Cold Extracted · Zero Hexane</div>
                <div className="anv-comparison-bad">✕ Refined Oils: 200°C Heat · Chemical Bleaching</div>
              </div>
            </div>

            <div className="anv-standard-card">
              <div className="anv-standard-step">03</div>
              <h3 className="anv-standard-title">Raw & Unpasteurized Honey</h3>
              <p className="anv-standard-desc">
                Collected from deep forest bee hives using non-harmful extraction. Unheated, unpasteurized, retaining natural pollen, bee enzymes, and antioxidants.
              </p>
              <div className="anv-standard-comparison">
                <div className="anv-comparison-good">✓ Gavyadhenu: Multi-Flora · Natural Enzymes</div>
                <div className="anv-comparison-bad">✕ Supermarket Honey: High-heat Boiled · Sugar Syrup</div>
              </div>
            </div>

            <div className="anv-standard-card">
              <div className="anv-standard-step">04</div>
              <h3 className="anv-standard-title">Public Batch Lab Reports</h3>
              <p className="anv-standard-desc">
                We believe trust is earned through transparency. Every harvest batch is tested across 26 parameters for adulterants, mineral oil, and heavy metals.
              </p>
              <div className="anv-standard-comparison">
                <div className="anv-comparison-good">✓ Gavyadhenu: Live Certificate on Every Jar</div>
                <div className="anv-comparison-bad">✕ Ordinary Brands: Unverified Label Claims</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE LAB REPORT TRANSPARENCY SECTION (ANVESHAN SIGNATURE) */}
      <section id="lab-reports" className="anv-lab-section">
        <div className="anv-container">
          <div className="anv-lab-card">
            <div className="anv-lab-copy">
              <span className="anv-section-tag">RADICAL TRANSPARENCY</span>
              <h3>Check Your Batch Purity Report</h3>
              <p>
                Don't take our word for it. Review authentic NABL-accredited laboratory test reports for our current batches. Test results verify RM value, FFA percentage, Baudouin test, and complete freedom from artificial additives.
              </p>

              <div className="anv-batch-selector">
                {BATCH_LAB_REPORTS.map((batch, idx) => (
                  <button
                    key={batch.id}
                    className={`anv-batch-pill ${selectedBatchIndex === idx ? "active" : ""}`}
                    onClick={() => setSelectedBatchIndex(idx)}
                  >
                    Batch #{batch.id}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
                <button
                  className="anv-btn-primary"
                  onClick={() => setLabModalOpen(true)}
                >
                  <ExternalLink size={15} /> View Full Certificate
                </button>
                <button
                  className="anv-btn-secondary"
                  onClick={() => {
                    toast.success(`Lab Certificate for Batch ${activeBatch.id} downloaded successfully.`);
                  }}
                >
                  <Download size={15} /> Download PDF
                </button>
              </div>
            </div>

            {/* Certificate Display Table */}
            <div className="anv-certificate-box">
              <div className="anv-cert-header">
                <div>
                  <div className="anv-cert-seal">
                    <Award size={18} color="#c47d2b" /> CERTIFICATE OF PURITY
                  </div>
                  <div style={{ fontSize: 11, color: "#829184", marginTop: 2 }}>
                    {activeBatch.labName}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#244b34" }}>
                    Batch: {activeBatch.id}
                  </div>
                  <div style={{ fontSize: 10, color: "#829184" }}>Report #{activeBatch.reportId}</div>
                </div>
              </div>

              <div style={{ marginBottom: 12, fontSize: 11.5, color: "#576759" }}>
                <b>Sample:</b> {activeBatch.productName} · <b>Tested On:</b> {activeBatch.mfgDate}
              </div>

              <table className="anv-cert-table">
                <thead>
                  <tr>
                    <th>Test Parameter</th>
                    <th>Standard</th>
                    <th>Observed Result</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeBatch.tests.map((test, index) => (
                    <tr key={index}>
                      <td><b>{test.parameter}</b></td>
                      <td>{test.standard}</td>
                      <td>{test.result}</td>
                      <td>
                        <span className="anv-cert-pass">
                          <Check size={13} /> {test.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 8. COMBOS & VALUE PACKS SHOWCASE */}
      <section className="anv-combos-section">
        <div className="anv-container">
          <div className="anv-section-head">
            <div>
              <span className="anv-section-tag">CURATED BUNDLES</span>
              <h2 className="anv-section-title">Value Packs & Ritual Hampers</h2>
            </div>
            <p className="anv-section-subtitle">
              Pair complementary harvests for everyday wellness and thoughtful celebrations, with bundled savings up to ₹450.
            </p>
          </div>

          <div className="anv-combos-grid">
            <div className="anv-combo-card">
              <div className="anv-combo-img">
                <img
                  src="/products/the-living-gift-box.jpg"
                  alt="Vedic Kitchen Essentials Pack"
                />
                <span className="anv-combo-badge">SAVE ₹450</span>
              </div>
              <div className="anv-combo-body">
                <h4>Vedic Kitchen Essentials Pack</h4>
                <p>A2 Gir Cow Ghee (500ml) + Wood Pressed Yellow Mustard Oil (1L) + Raw Multi-Flora Honey (250g).</p>
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#193826" }}>₹1,699</span>{" "}
                    <del style={{ fontSize: 13, color: "#829184" }}>₹2,149</del>
                  </div>
                  <button
                    className="anv-btn-primary"
                    style={{ padding: "8px 16px", fontSize: 12 }}
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast.info("Please sign in to add bundles to your basket.");
                        startLogin();
                        return;
                      }
                      addToCart.mutate({ productId: 1, quantity: 1 });
                      toast.success("Vedic Kitchen Essentials Pack added to basket!");
                    }}
                  >
                    Add Bundle
                  </button>
                </div>
              </div>
            </div>

            <div className="anv-combo-card">
              <div className="anv-combo-img">
                <img
                  src="/products/lakadong-turmeric-front.jpg"
                  alt="Immunity & Vitality Duo"
                />
                <span className="anv-combo-badge">BESTSELLER</span>
              </div>
              <div className="anv-combo-body">
                <h4>Golden Immunity & Vitality Duo</h4>
                <p>Lakadong High-Curcumin Turmeric (100g) paired with Satpura Raw Wildflower Forest Honey (250g).</p>
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#193826" }}>₹749</span>{" "}
                    <del style={{ fontSize: 13, color: "#829184" }}>₹898</del>
                  </div>
                  <button
                    className="anv-btn-primary"
                    style={{ padding: "8px 16px", fontSize: 12 }}
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast.info("Please sign in to add bundles to your basket.");
                        startLogin();
                        return;
                      }
                      addToCart.mutate({ productId: 3, quantity: 1 });
                      toast.success("Golden Immunity Duo added to basket!");
                    }}
                  >
                    Add Bundle
                  </button>
                </div>
              </div>
            </div>

            <div className="anv-combo-card">
              <div className="anv-combo-img">
                <img
                  src="/products/earthen-candle.jpg"
                  alt="Sanctuary Home Celebration Box"
                />
                <span className="anv-combo-badge">GIFT BOX</span>
              </div>
              <div className="anv-combo-body">
                <h4>Sanctuary Home Celebration Hamper</h4>
                <p>Hand-poured Earthen Candle + Coconut Coir Natural Scrubbers + Desi Wood Ash Cleaner.</p>
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#193826" }}>₹1,149</span>{" "}
                    <del style={{ fontSize: 13, color: "#829184" }}>₹1,397</del>
                  </div>
                  <button
                    className="anv-btn-primary"
                    style={{ padding: "8px 16px", fontSize: 12 }}
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast.info("Please sign in to add bundles to your basket.");
                        startLogin();
                        return;
                      }
                      addToCart.mutate({ productId: 5, quantity: 1 });
                      toast.success("Sanctuary Celebration Hamper added to basket!");
                    }}
                  >
                    Add Bundle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CUSTOMER REVIEWS & COMMUNITY LOVE (ANVESHAN REVIEWS) */}
      <section className="anv-reviews-section">
        <div className="anv-container">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
            <span className="anv-section-tag">LOVED BY 50,000+ HOMES</span>
            <h2 className="anv-section-title" style={{ fontSize: 36 }}>
              Words from Our Community
            </h2>
            <p className="anv-section-subtitle" style={{ margin: "8px auto 0" }}>
              Real reviews from families across India who switched to pure Bilona Ghee and wood-pressed cooking oils.
            </p>
          </div>

          <div className="anv-reviews-grid">
            <div className="anv-review-card">
              <div className="anv-review-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="anv-review-quote">
                "The aroma of Gavyadhenu Bilona Ghee takes me back to my grandmother's home in Saurashtra. It has that authentic granular texture and nutty fragrance. Truly unadulterated!"
              </p>
              <div className="anv-review-author">
                <div className="anv-author-avatar">P</div>
                <div className="anv-author-info">
                  <b>Pooja Venkatesh</b>
                  <span>Bengaluru · Verified Buyer</span>
                </div>
              </div>
            </div>

            <div className="anv-review-card">
              <div className="anv-review-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="anv-review-quote">
                "I stopped buying refined oils after testing Gavyadhenu's Wood Pressed Yellow Mustard Oil. It has natural golden pungency without any throat burning. You can taste the purity."
              </p>
              <div className="anv-review-author">
                <div className="anv-author-avatar">R</div>
                <div className="anv-author-info">
                  <b>Rohan Singhania</b>
                  <span>Gurugram · Verified Buyer</span>
                </div>
              </div>
            </div>

            <div className="anv-review-card">
              <div className="anv-review-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="anv-review-quote">
                "Being able to view the actual batch lab report on my phone gave me immense peace of mind. The Lakadong turmeric and wild honey have become my daily morning immunity ritual."
              </p>
              <div className="anv-review-author">
                <div className="anv-author-avatar">M</div>
                <div className="anv-author-info">
                  <b>Dr. Malini Desai</b>
                  <span>Mumbai · Verified Buyer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. AI FARM INTELLIGENCE ECOSYSTEM SECTION */}
      <section id="ai-ecosystem" className="anv-ai-section">
        <div className="anv-container">
          <div className="anv-section-head">
            <div>
              <span className="anv-section-tag">AGRITECH & CONSCIOUS LIVING</span>
              <h2 className="anv-section-title">AI Farm Intelligence Hub</h2>
            </div>
            <p className="anv-section-subtitle">
              Gavyadhenu unites honest e-commerce with precision agronomic AI for farmers, livestock guardians, and conscious homes.
            </p>
          </div>

          <div className="anv-ai-grid">
            <div className="anv-ai-card">
              <div>
                <span className="anv-ai-badge">Conversational AI</span>
                <h4>Dhenu AI Companion</h4>
                <p>
                  Natural language product matching, recipe suggestions, grounded catalogue reasoning, and live order status assistance.
                </p>
              </div>
              <button className="anv-ai-action" onClick={() => setAiOpen(true)}>
                Chat with Dhenu AI →
              </button>
            </div>

            <div className="anv-ai-card">
              <div>
                <span className="anv-ai-badge">Computer Vision</span>
                <h4>AI Crop Doctor</h4>
                <p>
                  Upload crop leaf photos for instant disease diagnostics, confidence ratings, and verified organic botanical treatment steps.
                </p>
              </div>
              <button
                className="anv-ai-action"
                onClick={() => {
                  toast.info("Opening AI Crop Doctor portal...");
                  setLocation("/customer?view=crop_doctor");
                }}
              >
                Scan a leaf photo →
              </button>
            </div>

            <div className="anv-ai-card">
              <div>
                <span className="anv-ai-badge">Livestock Wellness</span>
                <h4>AI Pashu Care</h4>
                <p>
                  Scientific livestock feed calculators, ICAR balanced dairy rations, deworming and vaccination calendars, and vet triage.
                </p>
              </div>
              <button
                className="anv-ai-action"
                onClick={() => {
                  toast.info("Opening AI Pashu Care portal...");
                  setLocation("/customer?view=pashu_care");
                }}
              >
                Open livestock care →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ ACCORDION SECTION (ANVESHAN STYLE) */}
      <section className="anv-faq-section">
        <div className="anv-container">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
            <span className="anv-section-tag">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="anv-section-title" style={{ fontSize: 36 }}>
              Everything You Need to Know
            </h2>
            <p className="anv-section-subtitle" style={{ margin: "8px auto 0" }}>
              Clear, transparent answers about our traditional methods, lab reports, and delivery.
            </p>
          </div>

          <div className="anv-faq-list">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className={`anv-faq-item ${isOpen ? "open" : ""}`}>
                  <button
                    className="anv-faq-question"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                        flexShrink: 0,
                      }}
                    />
                  </button>
                  {isOpen && <div className="anv-faq-answer">{faq.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="anv-footer">
        <div className="anv-footer-grid">
          <div className="anv-footer-brand">
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <div style={{ background: "#fdf9f0", padding: "6px 10px", borderRadius: 12, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  src="/gavyadhenu-logo.png"
                  alt="Gavyadhenu Emblem"
                  style={{ height: 48, width: "auto", objectFit: "contain" }}
                />
              </div>
              <div>
                <h4 style={{ margin: 0 }}>GAVYADHENU</h4>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#f4d06f", textTransform: "uppercase" }}>
                  Our Vision
                </span>
              </div>
            </div>
            <p>
              To preserve Bharat&apos;s Timeless traditions by delivering pure authentic, &amp; naturally nourishing products to every home.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontSize: 11, background: "rgba(255,255,255,0.08)", padding: "4px 8px", borderRadius: 6 }}>
                100% Lab Tested
              </span>
              <span style={{ fontSize: 11, background: "rgba(255,255,255,0.08)", padding: "4px 8px", borderRadius: 6 }}>
                Zero Chemical
              </span>
            </div>
          </div>

          <div className="anv-footer-col">
            <h5>Traditional Harvests</h5>
            <ul className="anv-footer-links">
              <li>
                <button onClick={() => { setCategory("Kitchen"); setQuery("Ghee"); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}>
                  Bilona A2 Desi Ghee
                </button>
              </li>
              <li>
                <button onClick={() => { setCategory("Kitchen"); setQuery("Oil"); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}>
                  Wood Pressed Oils
                </button>
              </li>
              <li>
                <button onClick={() => { setCategory("Kitchen"); setQuery("Honey"); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}>
                  Raw Wild Honey
                </button>
              </li>
              <li>
                <button onClick={() => { setCategory("Wellness"); setQuery("Haldi"); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}>
                  Lakadong Turmeric
                </button>
              </li>
            </ul>
          </div>

          <div className="anv-footer-col">
            <h5>Ecosystem & AI</h5>
            <ul className="anv-footer-links">
              <li>
                <button onClick={() => setAiOpen(true)}>Talk to Dhenu AI</button>
              </li>
              <li>
                <button onClick={() => setLocation("/customer?view=crop_doctor")}>AI Crop Doctor</button>
              </li>
              <li>
                <button onClick={() => setLocation("/customer?view=pashu_care")}>AI Pashu Care</button>
              </li>
              <li>
                <button onClick={() => document.getElementById("lab-reports")?.scrollIntoView({ behavior: "smooth" })}>Batch Lab Reports</button>
              </li>
            </ul>
          </div>

          <div className="anv-footer-col">
            <h5>Support & Portal</h5>
            <ul className="anv-footer-links">
              <li>
                <button onClick={() => setLocation("/account")}>Customer Account</button>
              </li>
              <li>
                <button onClick={() => setLocation("/seller")}>Seller Workspace</button>
              </li>
              <li>
                <button onClick={() => setLocation("/admin")}>Admin Control Center</button>
              </li>
              <li>
                <a href="mailto:care@gavyadhenu.farm">care@gavyadhenu.farm</a>
              </li>
            </ul>
          </div>

          <div className="anv-footer-col">
            <h5>Legal & Policies</h5>
            <ul className="anv-footer-links">
              <li>
                <button onClick={() => setActivePolicy("privacy")}>Privacy Policy</button>
              </li>
              <li>
                <button onClick={() => setActivePolicy("terms")}>Terms & Conditions</button>
              </li>
              <li>
                <button onClick={() => setActivePolicy("shipping")}>Shipping & Delivery</button>
              </li>
              <li>
                <button onClick={() => setActivePolicy("returns")}>Return & Refund</button>
              </li>
              <li>
                <button onClick={() => setActivePolicy("about")}>Our Vision & Story</button>
              </li>
            </ul>
          </div>
        </div>

        <div className="anv-footer-bottom">
          <span>© 2026 Gavyadhenu AI · Inspired by Anveshan Farm traditions. All rights reserved.</span>
          <span>100% Secure Payments · Verified Provenance Guaranteed</span>
        </div>
      </footer>

      {/* Product Quick View Modal */}
      {quickViewRow && (() => {
        const qProduct = quickViewRow.product;
        const qPhotos = getProductPhotos(qProduct.slug, qProduct.imageUrl);
        const qIsLiquid = qProduct.slug.includes("ghee") || qProduct.slug.includes("oil") || qProduct.slug.includes("honey");
        const qVariants = qIsLiquid
          ? [
              { label: "500 ml", multiplier: 1 },
              { label: "1 Litre", multiplier: 1.85 },
              { label: "5 Litres", multiplier: 8.5 },
            ]
          : [
              { label: "250 g", multiplier: 1 },
              { label: "500 g", multiplier: 1.85 },
              { label: "1 kg", multiplier: 3.5 },
            ];
        const qBasePrice = Number(qProduct.price);
        const qBaseMrp = qProduct.mrp ? Number(qProduct.mrp) : qBasePrice * 1.22;
        const qPrice = Math.round(qBasePrice * qVariants[quickViewVariantIndex].multiplier);
        const qMrp = Math.round(qBaseMrp * qVariants[quickViewVariantIndex].multiplier);
        const qSaving = Math.max(0, Math.round((1 - qPrice / qMrp) * 100));

        return (
          <div className="anv-modal-overlay" onClick={() => setQuickViewRow(null)}>
            <div className="anv-modal-box anv-quickview-box" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setQuickViewRow(null)}
                aria-label="Close quick view"
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  border: 0,
                  background: "#f5eee2",
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                  zIndex: 2,
                }}
              >
                <X size={16} />
              </button>

              <div className="anv-quickview-grid">
                <div>
                  <div className="anv-quickview-main-img">
                    <ProductImage
                      src={qPhotos[quickViewPhotoIndex] || qProduct.imageUrl || ""}
                      alt={qProduct.name}
                      aspectRatio="square"
                    />
                  </div>
                  {qPhotos.length > 1 && (
                    <div className="anv-quickview-thumbs">
                      {qPhotos.map((src, idx) => (
                        <button
                          key={src}
                          type="button"
                          className={quickViewPhotoIndex === idx ? "active" : ""}
                          onClick={() => setQuickViewPhotoIndex(idx)}
                        >
                          <img src={src} alt={`${qProduct.name} view ${idx + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="anv-quickview-info">
                  <span className="anv-card-category">{qProduct.category}</span>
                  <h3>{qProduct.name}</h3>
                  <div className="anv-card-provenance" style={{ marginBottom: 12 }}>
                    <Leaf size={12} color="#4f7358" />
                    <span>{quickViewRow.seller?.storeName ?? "Partner Sanctuary Farm"}</span>
                  </div>
                  <p className="anv-quickview-desc">
                    {qProduct.description || "Small-batch, lab-verified pure harvest crafted in traditional Indian sanctuary collectives."}
                  </p>

                  <div className="anv-variant-pills" style={{ marginBottom: 16 }}>
                    {qVariants.map((v, idx) => (
                      <button
                        key={v.label}
                        type="button"
                        className={`anv-variant-btn ${quickViewVariantIndex === idx ? "active" : ""}`}
                        onClick={() => setQuickViewVariantIndex(idx)}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>

                  <div className="anv-card-price-row" style={{ marginBottom: 18 }}>
                    <span className="anv-price-current" style={{ fontSize: 24 }}>₹{qPrice.toLocaleString("en-IN")}</span>
                    <span className="anv-price-mrp">₹{qMrp.toLocaleString("en-IN")}</span>
                    {qSaving > 0 && <span className="anv-price-save">Save {qSaving}%</span>}
                  </div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      className="anv-btn-primary"
                      style={{ flex: 1, justifyContent: "center" }}
                      onClick={() => {
                        handleAdd(qProduct);
                        setQuickViewRow(null);
                      }}
                    >
                      <ShoppingBag size={15} /> Add to Basket
                    </button>
                    <Link
                      href={`/product/${qProduct.slug}`}
                      onClick={() => {
                        handleProductClick(qProduct.id);
                        setQuickViewRow(null);
                      }}
                      className="anv-btn-secondary"
                      style={{ justifyContent: "center", textDecoration: "none" }}
                    >
                      Full Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          className="anv-back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll back to top"
          title="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* Floating Compare Bar */}
      <CompareFloatingBar
        items={compareList}
        onOpen={() => setCompareModalOpen(true)}
        onClear={() => setCompareList([])}
      />

      {/* Product Compare Modal */}
      <ProductCompareModal
        items={compareList}
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        onRemove={(id) => setCompareList((prev) => prev.filter((item) => item.id !== id))}
        onAddToCart={(item) => {
          const matched = products.find((p) => p.product.id === item.id);
          if (matched) handleAdd(matched.product);
        }}
        onClear={() => setCompareList([])}
      />

      {/* Full Lab Certificate Modal (Anveshan Inspection Feature) */}
      {labModalOpen && (
        <div className="anv-modal-overlay" onClick={() => setLabModalOpen(false)}>
          <div className="anv-modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e6ded1", paddingBottom: 16, marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#c47d2b", letterSpacing: "0.1em" }}>OFFICIAL NABL CERTIFICATE</span>
                <h3 style={{ margin: "4px 0 0", fontFamily: "var(--anv-serif)", fontSize: 24, color: "#193826" }}>
                  Analytical Purity Report #{activeBatch.reportId}
                </h3>
              </div>
              <button
                onClick={() => setLabModalOpen(false)}
                style={{ border: 0, background: "#f5eee2", width: 34, height: 34, borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center" }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ background: "#fdfbf7", border: "1px solid #ebdcc5", borderRadius: 14, padding: 18, marginBottom: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12 }}>
                <div><b>Sample:</b> {activeBatch.productName}</div>
                <div><b>Batch Number:</b> {activeBatch.batchNumber}</div>
                <div><b>Origin:</b> {activeBatch.origin}</div>
                <div><b>Testing Facility:</b> {activeBatch.labName}</div>
                <div><b>Sampling Date:</b> {activeBatch.mfgDate}</div>
                <div><b>Verification Method:</b> FSSAI & Bureau of Indian Standards (BIS)</div>
              </div>
            </div>

            <table className="anv-cert-table">
              <thead>
                <tr>
                  <th>Analysis Test</th>
                  <th>Permissible Standard</th>
                  <th>Batch Test Result</th>
                  <th>Compliance</th>
                </tr>
              </thead>
              <tbody>
                {activeBatch.tests.map((test, index) => (
                  <tr key={index}>
                    <td><b>{test.parameter}</b></td>
                    <td>{test.standard}</td>
                    <td>{test.result}</td>
                    <td>
                      <span className="anv-cert-pass">
                        <Check size={13} /> Compliant ({test.status})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 24, padding: 14, background: "#e8f0e5", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11.5, color: "#244b34" }}>
                <b>NABL Accredited Lab Seal:</b> Verified 100% genuine single-source farm harvest.
              </div>
              <button
                className="anv-btn-primary"
                style={{ padding: "8px 16px", fontSize: 12 }}
                onClick={() => {
                  toast.success(`Lab Certificate for Batch ${activeBatch.id} downloaded.`);
                  setLabModalOpen(false);
                }}
              >
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Cart Drawer */}
      {cartOpen && (
        <AnveshanCartDrawer
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setCartOpen(false);
            setLocation("/checkout");
          }}
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          discountApplied={discountApplied}
          setDiscountApplied={setDiscountApplied}
        />
      )}

      {/* Dhenu AI Sheet */}
      {aiOpen && (
        <div className="ai-overlay" onClick={() => setAiOpen(false)}>
          <section className="ai-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="ai-sheet-head">
              <div>
                <span className="store-kicker">INTELLIGENT COMPANION</span>
                <h3>Ask Dhenu AI</h3>
              </div>
              <button className="store-close" onClick={() => setAiOpen(false)} aria-label="Close assistant">
                <X size={18} />
              </button>
            </div>
            <AIChatBox
              messages={messages}
              language="en"
              onSendMessage={(content) => {
                const next = [...messages, { role: "user" as const, content }];
                setMessages(next);
                chat.mutate({
                  messages: next.filter((message) => message.role !== "system"),
                  language: "en",
                });
              }}
              isLoading={chat.isPending}
              height={480}
              suggestedPrompts={[
                "Add 1 Bilona Ghee to my basket",
                "How is curd-churned Bilona ghee different from regular ghee?",
                "Which wood-pressed oil is best for daily Indian cooking?",
                "What organic treatment works for yellow leaf spot on crops?",
                "What is a balanced cattle feed schedule during lactation?",
              ]}
            />
          </section>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={`anv-mobile-drawer-overlay ${mobileNavOpen ? "open" : ""}`}
        onClick={() => setMobileNavOpen(false)}
      >
        <div
          className={`anv-mobile-drawer ${mobileNavOpen ? "open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="anv-mobile-drawer-head">
            <div className="anv-brand-link">
              <img
                src="/gavyadhenu-logo.png"
                alt="Gavyadhenu Logo"
                className="anv-brand-logo-img"
                style={{ height: 38 }}
              />
              <div className="anv-brand-text">
                <span className="anv-brand-title">GAVYADHENU</span>
                <span className="anv-brand-subtitle">100% PURE HARVESTS</span>
              </div>
            </div>
            <button
              className="anv-mobile-drawer-close"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <div className="anv-mobile-drawer-search">
            <Search size={15} color="#576759" />
            <input
              type="text"
              placeholder="Search ghee, oils, honey..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setMobileNavOpen(false);
                  document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            />
            {query && (
              <button onClick={() => setQuery("")} style={{ border: 0, background: "none", cursor: "pointer", padding: 0 }}>
                <X size={13} color="#829184" />
              </button>
            )}
          </div>

          <div className="anv-mobile-drawer-links">
            <div className="anv-drawer-section-label">FARM HARVESTS</div>
            <button
              className={`anv-drawer-link ${category === "All harvests" ? "active" : ""}`}
              onClick={() => {
                setCategory("All harvests");
                setQuery("");
                setMobileNavOpen(false);
                document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>🌾 Shop All Harvests</span>
              <ChevronRight size={15} />
            </button>
            <button
              className="anv-drawer-link"
              onClick={() => {
                setCategory("Kitchen");
                setQuery("Ghee");
                setMobileNavOpen(false);
                document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>🧈 A2 Vedic Bilona Ghee</span>
              <span className="anv-nav-badge">Bestseller</span>
            </button>
            <button
              className="anv-drawer-link"
              onClick={() => {
                setCategory("Kitchen");
                setQuery("Oil");
                setMobileNavOpen(false);
                document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>🌻 Wood Pressed Oils</span>
              <ChevronRight size={15} />
            </button>
            <button
              className="anv-drawer-link"
              onClick={() => {
                setCategory("Kitchen");
                setQuery("Honey");
                setMobileNavOpen(false);
                document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>🍯 Raw Forest Honey</span>
              <ChevronRight size={15} />
            </button>
            <button
              className="anv-drawer-link"
              onClick={() => {
                setCategory("Kitchen");
                setQuery("Flour");
                setMobileNavOpen(false);
                document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>🌾 Chakki Atta & Sattu</span>
              <ChevronRight size={15} />
            </button>
            <button
              className="anv-drawer-link"
              onClick={() => {
                setCategory("Wellness");
                setQuery("Haldi");
                setMobileNavOpen(false);
                document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>🌶️ Lakadong Turmeric (7.8% Curcumin)</span>
              <ChevronRight size={15} />
            </button>
            <button
              className="anv-drawer-link"
              onClick={() => {
                setCategory("Gifting");
                setQuery("");
                setMobileNavOpen(false);
                document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>🎁 Festive Gift Hampers</span>
              <ChevronRight size={15} />
            </button>

            <div className="anv-drawer-section-label" style={{ marginTop: 18 }}>TRANSPARENCY & ASSURANCE</div>
            <button
              className="anv-drawer-link"
              onClick={() => {
                setMobileNavOpen(false);
                document.getElementById("our-vision")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>🌿 Our Sacred Vision</span>
              <ChevronRight size={15} />
            </button>
            <button
              className="anv-drawer-link"
              onClick={() => {
                setMobileNavOpen(false);
                document.getElementById("lab-reports")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>🔬 Batch Lab Reports</span>
              <ChevronRight size={15} />
            </button>
            <button
              className="anv-drawer-link"
              onClick={() => {
                setMobileNavOpen(false);
                document.getElementById("bilona-process")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>🏺 5-Step Vedic Bilona Craft</span>
              <ChevronRight size={15} />
            </button>
            <button
              className="anv-drawer-link"
              onClick={() => {
                setMobileNavOpen(false);
                setAiOpen(true);
              }}
            >
              <span>🐄 Ask Dhenu AI Companion</span>
              <span className="anv-nav-badge ai">AI</span>
            </button>
          </div>

          <div className="anv-mobile-drawer-footer">
            <button
              className="anv-btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => {
                setMobileNavOpen(false);
                setLocation(
                  !isAuthenticated
                    ? "/account"
                    : user?.role === "admin"
                    ? "/admin"
                    : user?.role === "seller"
                    ? "/seller"
                    : "/customer"
                );
              }}
            >
              <UserRound size={16} />
              {isAuthenticated ? "My Account & Orders" : "Sign In / Register"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Quick-Actions Bar */}
      <nav className="anv-mobile-bottom-bar" aria-label="Mobile Navigation">
        <button
          className="anv-bottom-bar-item"
          onClick={() => {
            setCategory("All harvests");
            setQuery("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <Leaf size={18} />
          <span>Shop</span>
        </button>

        <button
          className="anv-bottom-bar-item"
          onClick={() => {
            document.querySelector(".anv-category-circles-section")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <Search size={18} />
          <span>Categories</span>
        </button>

        <button
          className="anv-bottom-bar-item highlight"
          onClick={() => setAiOpen(true)}
        >
          <div className="anv-ai-icon-bubble">
            <Sparkles size={16} />
          </div>
          <span>Dhenu AI</span>
        </button>

        <button
          className="anv-bottom-bar-item"
          onClick={() => {
            document.getElementById("lab-reports")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <ShieldCheck size={18} />
          <span>Lab Purity</span>
        </button>

        <button
          className="anv-bottom-bar-item"
          onClick={() => setCartOpen(true)}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="anv-bottom-badge">{cartCount}</span>}
          </div>
          <span>Basket</span>
        </button>
      </nav>

      {/* Commercial Policy Modal */}
      {activePolicy && (
        <PolicyModal type={activePolicy} onClose={() => setActivePolicy(null)} />
      )}
    </div>
  );
}

// Anveshan D2C Product Card Component with Interactive Variant Selector
function AnveshanProductCard({
  row,
  onAdd,
  onToggleCompare,
  onQuickView,
  isComparing,
  onClick,
}: {
  row: CatalogRow;
  onAdd: () => void;
  onToggleCompare: () => void;
  onQuickView: () => void;
  isComparing: boolean;
  onClick: () => void;
}) {
  const { isAuthenticated } = useAuth();
  const product = row.product;
  const isLiquid = product.slug.includes("ghee") || product.slug.includes("oil") || product.slug.includes("honey");

  const variants = isLiquid
    ? [
        { label: "500 ml", shortLabel: "500ml", multiplier: 1 },
        { label: "1 Litre", shortLabel: "1L", multiplier: 1.85 },
        { label: "5 Litres", shortLabel: "5L", multiplier: 8.5 },
      ]
    : [
        { label: "250 g", shortLabel: "250g", multiplier: 1 },
        { label: "500 g", shortLabel: "500g", multiplier: 1.85 },
        { label: "1 kg", shortLabel: "1kg", multiplier: 3.5 },
      ];

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const photos = getProductPhotos(product.slug, product.imageUrl);
  const [photoIndex, setPhotoIndex] = useState(0);

  const addWishlist = trpc.customer.addWishlist.useMutation({
    onSuccess: (result) => toast.success(result.message),
    onError: (error) => toast.error(error.message),
  });

  const basePrice = Number(product.price);
  const baseMrp = product.mrp ? Number(product.mrp) : basePrice * 1.22;
  const currentPrice = Math.round(basePrice * variants[selectedVariantIndex].multiplier);
  const currentMrp = Math.round(baseMrp * variants[selectedVariantIndex].multiplier);

  const saving = Math.max(0, Math.round((1 - currentPrice / currentMrp) * 100));
  const isBestseller = product.slug.includes("ghee") || product.slug.includes("oil") || product.slug.includes("honey");

  return (
    <article className="anv-product-card">
      <Link href={`/product/${product.slug}`} onClick={onClick} className="anv-card-media">
        <ProductImage
          src={photos[photoIndex] || product.imageUrl || ""}
          alt={product.name}
          aspectRatio="square"
          className="anv-card-img"
        />

        {isBestseller ? (
          <span className="anv-card-tag bestseller">BESTSELLER</span>
        ) : (
          <span className="anv-card-tag">100% PURE</span>
        )}

        {saving > 0 && <span className="anv-card-discount">{saving}% OFF</span>}

        {/* Multi-photo dot switcher */}
        {photos.length > 1 && (
          <div
            className="anv-card-dots"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {photos.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                className={`anv-card-dot ${photoIndex === dotIdx ? "active" : ""}`}
                aria-label={`View photo ${dotIdx + 1} of ${product.name}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPhotoIndex(dotIdx);
                }}
                onMouseEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPhotoIndex(dotIdx);
                }}
              />
            ))}
          </div>
        )}

        <button
          className="anv-card-wishlist"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isAuthenticated) {
              toast.info("Sign in to save this harvest to your wishlist.");
              startLogin();
              return;
            }
            addWishlist.mutate({ productId: product.id });
          }}
          aria-label="Save to wishlist"
        >
          <Heart size={16} />
        </button>
      </Link>

      <div className="anv-card-body">
        <span className="anv-card-category">{product.category}</span>

        <h4 className="anv-card-title">
          <Link href={`/product/${product.slug}`} onClick={onClick}>
            {product.name}
          </Link>
        </h4>

        <div className="anv-card-provenance">
          <Leaf size={11} color="#4f7358" />
          <span>{row.seller?.storeName ?? "Partner Sanctuary Farm"}</span>
        </div>

        <div className="anv-card-rating">
          <div style={{ display: "flex", gap: 1 }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} fill="currentColor" />
            ))}
          </div>
          <span>4.9 (1.2k+ reviews)</span>
        </div>

        {/* Variant Size Selector Pills */}
        <div className="anv-variant-pills">
          {variants.map((v, idx) => (
            <button
              key={v.label}
              type="button"
              className={`anv-variant-btn ${selectedVariantIndex === idx ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setSelectedVariantIndex(idx);
              }}
            >
              <span className="anv-variant-desktop">{v.label}</span>
              <span className="anv-variant-mobile">{v.shortLabel}</span>
            </button>
          ))}
        </div>

        <div className="anv-card-price-row">
          <span className="anv-price-current">₹{currentPrice.toLocaleString("en-IN")}</span>
          <span className="anv-price-mrp">₹{currentMrp.toLocaleString("en-IN")}</span>
          {saving > 0 && <span className="anv-price-save">Save {saving}%</span>}
        </div>

        <div className="anv-card-actions-row">
          <button
            className="anv-card-action-icon-btn"
            onClick={(e) => {
              e.preventDefault();
              onQuickView();
            }}
            title="Quick view harvest"
            aria-label={`Quick view ${product.name}`}
          >
            <Eye size={13} />
          </button>
          <button
            className={`anv-card-action-icon-btn ${isComparing ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              onToggleCompare();
            }}
            title="Compare harvest"
            aria-label={`Compare ${product.name}`}
          >
            <ArrowLeftRight size={13} />
          </button>
          <button
            className="anv-card-btn-add"
            onClick={onAdd}
            aria-label={`Add ${product.name} to basket`}
          >
            <Plus size={14} />
            <span className="anv-btn-text-desktop">Add to Basket</span>
            <span className="anv-btn-text-mobile">Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}

// Anveshan D2C Slide-Over Cart Drawer with Multi-Tier Reward Progress
function AnveshanCartDrawer({
  onClose,
  onCheckout,
  promoCode,
  setPromoCode,
  discountApplied,
  setDiscountApplied,
}: {
  onClose: () => void;
  onCheckout: () => void;
  promoCode: string;
  setPromoCode: (val: string) => void;
  discountApplied: boolean;
  setDiscountApplied: (val: boolean) => void;
}) {
  const { isAuthenticated } = useAuth();
  const cart = trpc.customer.cart.useQuery(undefined, { enabled: isAuthenticated });
  const update = trpc.customer.updateCart.useMutation({
    onSuccess: () => cart.refetch(),
    onError: (error) => toast.error(error.message),
  });
  const remove = trpc.customer.removeFromCart.useMutation({
    onSuccess: (result) => {
      toast.success(result.message);
      cart.refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const lines = (cart.data ?? []) as Array<{
    item: { id: number; quantity: number };
    product: CatalogRow["product"];
  }>;

  const rawSubtotal = lines.reduce((sum, line) => sum + Number(line.product.price) * line.item.quantity, 0);
  const discountAmount = discountApplied ? Math.min(150, Math.round(rawSubtotal * 0.1)) : 0;
  const subtotal = Math.max(0, rawSubtotal - discountAmount);
  const delivery = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const freeShippingThreshold = 999;
  const freeGiftThreshold = 1499;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const amountToFreeGift = Math.max(0, freeGiftThreshold - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    if (promoCode.trim().toUpperCase() === "PURE150" || promoCode.trim().toUpperCase() === "FIRST10") {
      setDiscountApplied(true);
      toast.success("Promo code applied! You saved extra on this order.");
    } else {
      toast.error("Invalid coupon code. Try PURE150 for ₹150 OFF.");
    }
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside className="cart-drawer-v2" onClick={(event) => event.stopPropagation()}>
        <div className="cart-head">
          <div>
            <span className="store-kicker">YOUR SHOPPING BASKET</span>
            <h3>
              {lines.length} {lines.length === 1 ? "Item" : "Items"}
            </h3>
          </div>
          <button className="store-close" onClick={onClose} aria-label="Close basket">
            <X size={18} />
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="cart-empty">
            <ShoppingBag size={38} color="#244b34" />
            <h3>Sign in to view your basket</h3>
            <p>Your harvests will follow you across devices securely after sign in.</p>
            <button className="anv-btn-primary" onClick={() => startLogin()}>
              Sign in securely <ArrowRight size={15} />
            </button>
          </div>
        ) : lines.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={38} color="#244b34" />
            <h3>Your basket is empty</h3>
            <p>Explore our traditional Bilona Ghee, wood-pressed oils, and wild honey to begin.</p>
            <button className="anv-btn-secondary" onClick={onClose}>
              Continue Exploring <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          <>
            {/* Multi-Tier Free Delivery & Free Gift Progress Bar */}
            <div
              style={{
                margin: "12px 0 16px",
                padding: "14px",
                background: "#f3f8f1",
                borderRadius: 14,
                border: "1px solid #dbe8d7",
              }}
            >
              {amountToFreeShipping > 0 ? (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#244b34", fontWeight: 600 }}>
                  <span>Add <b>₹{amountToFreeShipping}</b> more for <b>FREE Express Delivery</b></span>
                  <span>{shippingProgress}%</span>
                </div>
              ) : amountToFreeGift > 0 ? (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#c47d2b", fontWeight: 700 }}>
                  <span>🎉 FREE Shipping Unlocked! Add <b>₹{amountToFreeGift}</b> for <b>Free Gift</b></span>
                  <span>{Math.min(100, Math.round((subtotal / freeGiftThreshold) * 100))}%</span>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#15803d", fontWeight: 700 }}>
                  <Check size={14} /> You've unlocked FREE Delivery + FREE Organic Gift Dipper!
                </div>
              )}
              <div style={{ width: "100%", height: 7, background: "rgba(0,0,0,0.08)", borderRadius: 999, overflow: "hidden", marginTop: 8 }}>
                <div style={{ width: `${Math.min(100, Math.round((subtotal / freeGiftThreshold) * 100))}%`, height: "100%", background: "#244b34", borderRadius: 999, transition: "width 0.3s ease" }} />
              </div>
            </div>

            {/* Cart Lines */}
            <div className="cart-lines">
              {lines.map((line) => (
                <div className="cart-line" key={line.item.id}>
                  <div className="cart-line-image">
                    {line.product.imageUrl ? <img src={line.product.imageUrl} alt="" /> : <Sparkles size={18} />}
                  </div>
                  <div className="cart-line-copy">
                    <b>{line.product.name}</b>
                    <small>₹{Number(line.product.price).toLocaleString("en-IN")}</small>
                    <div className="qty-control-v2">
                      <button
                        onClick={() =>
                          line.item.quantity > 1
                            ? update.mutate({ cartId: line.item.id, quantity: line.item.quantity - 1 })
                            : remove.mutate({ cartId: line.item.id })
                        }
                      >
                        <Minus size={12} />
                      </button>
                      <span>{line.item.quantity}</span>
                      <button
                        onClick={() =>
                          update.mutate({ cartId: line.item.id, quantity: line.item.quantity + 1 })
                        }
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button className="cart-remove" onClick={() => remove.mutate({ cartId: line.item.id })}>
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Promo Code Box */}
            <div style={{ display: "flex", gap: 8, margin: "16px 0 10px" }}>
              <input
                type="text"
                placeholder="Promo Code (e.g. PURE150)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #d9e2d6",
                  fontSize: 12,
                  outline: "none",
                }}
              />
              <button
                type="button"
                className="anv-btn-secondary"
                style={{ padding: "8px 14px", fontSize: 11 }}
                onClick={handleApplyPromo}
              >
                Apply
              </button>
            </div>

            {/* Price Summary */}
            <div className="cart-summary">
              <div>
                <span>Bag Subtotal</span>
                <b>₹{rawSubtotal.toLocaleString("en-IN")}</b>
              </div>
              {discountApplied && (
                <div style={{ color: "#15803d" }}>
                  <span>Coupon Discount (PURE150)</span>
                  <b>-₹{discountAmount.toLocaleString("en-IN")}</b>
                </div>
              )}
              <div>
                <span>Farm-to-Door Delivery</span>
                <b>{delivery === 0 ? "FREE" : `₹${delivery}`}</b>
              </div>
              <div className="cart-total">
                <span>Total Amount</span>
                <b>₹{(subtotal + delivery).toLocaleString("en-IN")}</b>
              </div>
            </div>

            <button className="anv-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 12 }} onClick={onCheckout}>
              Proceed to Checkout <ArrowRight size={16} />
            </button>

            <p className="cart-footnote">
              <Truck size={14} /> Free delivery above ₹999 · 100% verified lab purity guaranteed
            </p>
          </>
        )}
      </aside>
    </div>
  );
}

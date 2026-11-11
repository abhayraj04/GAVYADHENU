import { AIChatBox, type Message } from "@/components/AIChatBox";
import { CommerceDrawer } from "@/components/CommerceDrawer";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { RoleWorkspace } from "@/components/RoleWorkspace";
import { trpc } from "@/lib/trpc";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Coffee,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleCheck,
  Clock3,
  Droplets,
  HeartPulse,
  Heart,
  Flower2,
  Gift,
  Home as House,
  Leaf,
  Menu,
  Milk,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sprout,
  Star,
  Stethoscope,
  SunMedium,
  Wheat,
  X,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const heroImage = "/products/bilona-a2-ghee.jpg";
const logoImage = "/products/bilona-a2-ghee.jpg";

type Product = {
  name: string;
  category: string;
  price: number;
  note: string;
  accent: string;
  icon: typeof Milk;
  image: string;
};

const products: Product[] = [
  { name: "Bilona A2 Ghee", category: "Kitchen", price: 899, note: "Hand-churned · 500 ml", accent: "saffron", icon: SunMedium, image: "/products/bilona-a2-ghee.jpg" },
  { name: "Farmstead Makhana", category: "Kitchen", price: 349, note: "Slow-roasted · 250 g", accent: "moss", icon: Wheat, image: "/products/farmstead-makhana.jpg" },
  { name: "Golden Haldi Ritual", category: "Wellness", price: 299, note: "Lakadong turmeric · 100 g", accent: "clay", icon: Sprout, image: "/products/lakadong-turmeric-front.jpg" },
  { name: "Farm Care Starter", category: "Farm & Soil", price: 649, note: "Minerals · herbal wash · balm", accent: "sage", icon: HeartPulse, image: "/products/pashu-starter-pack.jpg" },
  { name: "Wildflower Honey", category: "Kitchen", price: 549, note: "Unfiltered · 250 g", accent: "honey", icon: Flower2, image: "/products/wildflower-honey.jpg" },
  { name: "Earthen Home Candle", category: "Home & Living", price: 799, note: "Soy wax · cedarwood · 180 g", accent: "night", icon: House, image: "/products/earthen-candle.jpg" },
  { name: "Quiet Morning Brew", category: "Wellness", price: 449, note: "Single-origin herbal infusion · 40 g", accent: "tea", icon: Coffee, image: "/products/quiet-morning-brew.jpg" },
  { name: "The Living Gift Box", category: "Gifting", price: 1499, note: "Four partner-farm favourites", accent: "gift", icon: Gift, image: "/products/the-living-gift-box.jpg" },
];

const categories = ["All harvests", "Kitchen", "Wellness", "Home & Living", "Farm & Soil", "Gifting"];

const rituals = [
  { title: "Slow kitchen", note: "Honest staples for everyday cooking", category: "Kitchen", accent: "ritual-kitchen", icon: SunMedium },
  { title: "A softer morning", note: "Warm rituals for body and mind", category: "Wellness", accent: "ritual-wellness", icon: Coffee },
  { title: "Home, with feeling", note: "Objects that make space for stillness", category: "Home & Living", accent: "ritual-home", icon: House },
  { title: "Give something living", note: "Thoughtful gifts with a traceable story", category: "Gifting", accent: "ritual-gift", icon: Gift },
];

const starterMessages: Message[] = [
  {
    role: "system",
    content:
      "You are Dhenu, Gavyadhenu's warm and practical regenerative living companion. Give concise, grounded guidance across food, wellness, home rituals, gifting, farming and farm-animal care. Never diagnose an animal or replace a veterinarian; for urgent symptoms advise a local veterinary professional.",
  },
  {
    role: "assistant",
    content:
      "Namaste — I’m Dhenu. Ask me about a calmer kitchen, a thoughtful gift, a restorative ritual, your herd, or which partner-farm harvest fits your life.",
  },
];

export default function Home() {
  const [activeSection, setActiveSection] = useState("overview");
  const [category, setCategory] = useState("All harvests");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<{ name: string; quantity: number }[]>(() => {
    try {
      const saved = localStorage.getItem("gavyadhenu-cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [basketOpen, setBasketOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [notice, setNotice] = useState("");
  const [aiError, setAiError] = useState("");
  const [lastAiPrompt, setLastAiPrompt] = useState("");
  const [checkoutMode, setCheckoutMode] = useState(false);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    localStorage.setItem("gavyadhenu-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const chatMutation = trpc.ai.chat.useMutation({
    onSuccess: response => {
      setAiError("");
      setMessages(current => [...current, { role: "assistant", content: response }]);
    },
    onError: error => {
      console.error("[Dhenu AI] request failed", error);
      setAiError("Dhenu could not reach the AI service right now. Please try again.");
      setMessages(current => [
        ...current,
        {
          role: "assistant",
          content: "I’m having a quiet moment. Please try again in a few seconds. For urgent animal symptoms, contact a local veterinarian immediately.",
        },
      ]);
    },
  });

  const visibleProducts = useMemo(
    () => products.filter(product => (category === "All harvests" || product.category === category) && product.name.toLowerCase().includes(query.toLowerCase().trim())),
    [category, query],
  );

  const scrollTo = (section: string) => {
    setActiveSection(section);
    setMobileOpen(false);
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const addToCart = (name: string) => {
    setCartItems(items => {
      const existing = items.find(item => item.name === name);
      return existing
        ? items.map(item => item.name === name ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { name, quantity: 1 }];
    });
    setNotice(`${name} added to your basket`);
    setBasketOpen(true);
    window.setTimeout(() => setNotice(""), 2400);
  };

  const buyNow = (name: string) => {
    setCartItems([{ name, quantity: 1 }]);
    setCheckoutMode(true);
    setBasketOpen(true);
    setSelectedProduct(null);
  };

  const removeFromCart = (name: string) => {
    setCartItems(items => items.flatMap(item => item.name === name
      ? (item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : [])
      : [item]));
  };

  const sendMessage = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || chatMutation.isPending) return;
    setLastAiPrompt(trimmed);
    setAiError("");
    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    chatMutation.mutate({
      messages: nextMessages
        .filter(message => message.role !== "system")
        .map(message => ({ role: message.role, content: message.content })),
    });
  };

  return (
    <div className="site-shell">
      <div className="announcement">
        <div className="container announcement-inner">
          <span className="announcement-pulse" />
          <span>New season, same promise: traceable care from soil to shelf.</span>
          <button onClick={() => scrollTo("harvests")}>Explore the harvest <ArrowUpRight size={13} /></button>
        </div>
      </div>

      <header className="site-header">
        <div className="container nav-wrap">
          <button className="brand" onClick={() => scrollTo("overview")} aria-label="Gavyadhenu home">
            <img className="brand-logo-image" src={logoImage} alt="Gavyadhenu" />
          </button>

          <nav className={`main-nav ${mobileOpen ? "is-open" : ""}`} aria-label="Primary navigation">
            <button className={activeSection === "overview" ? "active" : ""} onClick={() => scrollTo("overview")}>Overview</button>
            <button className={activeSection === "care" ? "active" : ""} onClick={() => scrollTo("care")}>Care planner <span className="nav-new">NEW</span></button>
            <button className={activeSection === "harvests" ? "active" : ""} onClick={() => scrollTo("harvests")}>The harvest</button>
            <button className={activeSection === "rituals" ? "active" : ""} onClick={() => scrollTo("rituals")}>The rituals</button>
            <button className={activeSection === "story" ? "active" : ""} onClick={() => scrollTo("story")}>Our story</button>
          </nav>

          <div className="nav-actions">
            <button className="icon-button search-button" onClick={() => { setSearchOpen(true); scrollTo("harvests"); }} aria-label="Search"><Search size={18} /></button>
            <button className="basket-button" onClick={() => setBasketOpen(true)}>
              <ShoppingBag size={17} /> <span>Basket</span><b>{cartCount}</b>
            </button>
            <button className="profile-button" onClick={() => setWorkspaceOpen(true)} aria-label="Open profile workspaces"><UserRound size={17} /></button>
            <button className="mobile-menu" onClick={() => setMobileOpen(open => !open)} aria-label="Toggle menu">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div className="marketplace-utility" aria-label="Marketplace benefits">
        <div className="container marketplace-utility-inner"><span><PackageCheck size={15} /><b>Farm-to-door delivery</b><small>Freshly packed</small></span><span><ShieldCheck size={15} /><b>Secure checkout</b><small>Protected payments</small></span><span><Heart size={15} /><b>Easy returns</b><small>7 days unopened</small></span><span><BrainCircuit size={15} /><b>Dhenu support</b><small>Always one tap away</small></span></div>
      </div>

      <main>
        <section id="overview" className="hero-section container">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> Regenerative care, made visible</div>
            <h1>A better future starts with <em>how we care.</em></h1>
            <p className="hero-lede">Gavyadhenu brings together honest harvests, restorative rituals, thoughtful objects, and the intelligence to help people and the land thrive — one small decision at a time.</p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={() => scrollTo("harvests")}>Explore the harvest <ArrowRight size={16} /></button>
              <button className="text-button" onClick={() => setAiOpen(true)}><span className="mini-ai"><Sparkles size={14} /></span> Meet Dhenu AI</button>
            </div>
            <button className="hero-ai-card" onClick={() => setAiOpen(true)} aria-label="Open Dhenu AI companion">
              <span className="hero-ai-orb"><Sparkles size={19} /></span>
              <span className="hero-ai-copy"><small>YOUR PERSONAL COMPANION</small><b>Ask Dhenu anything</b><em>Food · wellness · home · farm care</em></span>
              <span className="hero-ai-arrow"><ArrowUpRight size={17} /></span>
            </button>
            <div className="hero-proof">
              <div className="avatar-stack"><span>R</span><span>A</span><span>M</span><span>+</span></div>
              <div><div className="stars"><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /></div><p>Loved by 2,400+ mindful households</p></div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-wrap"><img src={heroImage} alt="A dairy farmer caring for cows in a sunlit field" /></div>
            <div className="hero-note note-top"><span className="note-icon green"><CircleCheck size={15} /></span><div><b>100% traceable</b><small>Farm to family, always</small></div></div>
            <div className="hero-note note-bottom"><div className="mini-ring"><span>24</span></div><div><b>partner farms</b><small>Growing with the land</small></div></div>
            <div className="hero-stamp"><span>Care</span><strong>first</strong><span>always</span></div>
          </div>
        </section>

        <section className="trust-strip">
          <div className="container trust-grid">
            <div><ShieldCheck size={21} /><span><b>Radically honest</b><small>No fillers. No shortcuts.</small></span></div>
            <div><Sprout size={21} /><span><b>Earth-positive</b><small>Better soil, better tomorrow.</small></span></div>
            <div><PackageCheck size={21} /><span><b>Carefully delivered</b><small>Freshness, packed with intention.</small></span></div>
            <div><BrainCircuit size={21} /><span><b>Intelligence, with empathy</b><small>Meet Dhenu, your AI companion.</small></span></div>
          </div>
        </section>

        <section id="care" className="care-section container section-pad">
          <div className="section-heading split-heading">
            <div><div className="eyebrow"><span className="eyebrow-line" /> Your farm, at a glance</div><h2>Care that feels <em>clearer.</em></h2></div>
            <div className="heading-side"><p>Good care is a daily practice. Keep the signal visible, spot the next best action, and give every animal room to thrive.</p><button className="link-button" onClick={() => setAiOpen(true)}>Ask Dhenu for a plan <ArrowUpRight size={15} /></button></div>
          </div>

          <div className="dashboard-grid">
            <article className="health-card featured-card">
              <div className="card-topline"><span className="soft-label">HERD WELLNESS</span><span className="live-chip"><span /> Live snapshot</span></div>
              <div className="health-score"><div className="score-ring"><div><strong>92</strong><span>/100</span></div></div><div><h3>Looking good, Meera.</h3><p>All key signals are in a healthy range this week.</p><button className="small-link" onClick={() => setAiOpen(true)}>View insight <ChevronRight size={14} /></button></div></div>
              <div className="metric-row"><div><span>Comfort</span><b>96%</b><div className="metric-bar"><i style={{ width: "96%" }} /></div></div><div><span>Nutrition</span><b>89%</b><div className="metric-bar"><i style={{ width: "89%" }} /></div></div><div><span>Hydration</span><b>94%</b><div className="metric-bar"><i style={{ width: "94%" }} /></div></div></div>
            </article>

            <article className="care-card action-card"><div className="card-icon lavender"><Droplets size={20} /></div><span className="soft-label">NEXT BEST ACTION</span><h3>Water check <span>· today</span></h3><p>Fresh water points are due for their afternoon refresh.</p><button className="outline-button" onClick={() => setNotice("Water check marked as done")}>Mark complete <Check size={15} /></button></article>
            <article className="care-card feed-card"><div className="care-card-header"><div className="card-icon yellow"><Wheat size={20} /></div><span className="soft-label">FEED BALANCE</span><ArrowUpRight size={16} /></div><div className="feed-value"><strong>7.4</strong><span>/10</span><small>Well balanced</small></div><div className="feed-legend"><span><i className="dot dot-green" />Forage 62%</span><span><i className="dot dot-yellow" />Minerals 18%</span><span><i className="dot dot-clay" />Concentrate 20%</span></div></article>
            <article className="care-card timeline-card"><div className="care-card-header"><div className="card-icon terracotta"><Clock3 size={20} /></div><span className="soft-label">TODAY'S RHYTHM</span><span className="time-zone">IST</span></div><div className="timeline"><span className="timeline-dot done" /><div><b>Morning check-in</b><small>Completed · 06:40</small></div><span className="timeline-dot current" /><div><b>Water refresh</b><small>Next up · 14:00</small></div><span className="timeline-dot" /><div><b>Evening wind-down</b><small>Planned · 18:30</small></div></div></article>
          </div>
        </section>

        <section id="harvests" className="harvest-section section-pad">
          <div className="container">
            <div className="section-heading split-heading harvest-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> From our partner farms</div><h2>The honest <em>harvest.</em></h2></div><div className="heading-side"><p>Food, wellness, home and gifting — small-batch things shaped by the land, the season, and the people who care for it.</p><button className="link-button" onClick={() => { setCategory("All harvests"); setQuery(""); setSearchOpen(false); scrollTo("harvests"); }}>See all products <ArrowUpRight size={15} /></button></div></div>
            <div className="catalog-toolbar"><div className="category-tabs" role="tablist">{categories.map(item => <button key={item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><button className="wishlist-summary" onClick={() => setNotice(wishlist.length ? `${wishlist.length} saved harvest${wishlist.length === 1 ? "" : "s"}` : "Save a harvest you love") }><Heart size={15} fill={wishlist.length ? "currentColor" : "none"} /> Saved {wishlist.length}</button></div>
            {searchOpen && <div className="catalog-search"><Search size={16} /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Search kitchen, home, gifts..." aria-label="Search products" /><button onClick={() => { setQuery(""); setSearchOpen(false); }} aria-label="Close search"><X size={16} /></button></div>}
            <div className="product-grid">{visibleProducts.map(product => { const Icon = product.icon; const wishlisted = wishlist.includes(product.name); return <article className="product-card" key={product.name}><div className={`product-art ${product.accent} has-product-image`}><img src={product.image} alt={`${product.name} product`} loading="lazy" /><span className="product-badge">{product.category}</span><button className={`product-wish ${wishlisted ? "is-wishlisted" : ""}`} onClick={() => setWishlist(items => wishlisted ? items.filter(item => item !== product.name) : [...items, product.name])} aria-label={`${wishlisted ? "Remove" : "Save"} ${product.name}`}><Heart size={15} fill={wishlisted ? "currentColor" : "none"} /></button><button className="product-plus" onClick={() => addToCart(product.name)} aria-label={`Add ${product.name} to basket`}><Plus size={18} /></button></div><div className="product-info"><button className="product-name-button" onClick={() => setSelectedProduct(product)}><div><h3>{product.name}</h3><p>{product.note}</p></div></button><div className="product-price"><span>₹</span>{product.price}</div></div><div className="product-actions"><button className="product-add" onClick={() => addToCart(product.name)}>Add to cart <ArrowUpRight size={15} /></button><button className="product-buy-now" onClick={() => buyNow(product.name)}>Buy now <ArrowRight size={15} /></button></div></article>; })}</div>
            {visibleProducts.length === 0 && <div className="catalog-empty"><Search size={20} /><b>No harvests found</b><span>Try a different search or browse all harvests.</span></div>}
          </div>
        </section>

        <section id="rituals" className="marketplace-section container section-pad">
          <div className="section-heading split-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> Curated by intention</div><h2>Shop by <em>ritual.</em></h2></div><div className="heading-side"><p>Not everything needs to be about a product. Begin with a feeling, then find the small things that support it.</p></div></div>
          <div className="ritual-grid">{rituals.map(ritual => { const Icon = ritual.icon; return <button className={`ritual-card ${ritual.accent}`} key={ritual.title} onClick={() => { setCategory(ritual.category); scrollTo("harvests"); }}><span className="ritual-icon"><Icon size={23} /></span><span className="ritual-number">0{rituals.indexOf(ritual) + 1}</span><strong>{ritual.title}</strong><small>{ritual.note}</small><span className="ritual-link">Explore edit <ArrowUpRight size={14} /></span></button>; })}</div>
          <div className="bundle-feature"><div className="bundle-mark"><Gift size={27} /></div><div><span className="soft-label">THE SEASONAL EDIT</span><h3>The Gavyadhenu welcome box</h3><p>Ghee, honey, haldi and a little something for stillness — a considered introduction to the living marketplace.</p></div><button className="button button-primary" onClick={() => { setSelectedProduct(products.find(product => product.name === "The Living Gift Box") ?? products[0]); }}>View the edit <ArrowRight size={15} /></button></div>
        </section>

        <section id="story" className="story-section container section-pad">
          <div className="story-card"><div className="story-image"><img src={heroImage} alt="A farmer and calf at a Gavyadhenu partner farm" /><span className="image-caption">A morning at Asha Farm, Maharashtra</span></div><div className="story-copy"><div className="eyebrow light"><span className="eyebrow-line" /> Why Gavyadhenu exists</div><h2>Care is the most <em>powerful</em> technology we have.</h2><p>We’re building a calmer, more connected way to live with the land — where farmers have better signals, families have better food, homes have more feeling, and cows are treated as partners in a living system.</p><div className="story-stats"><div><strong>24</strong><span>partner farms</span></div><div><strong>7.8k</strong><span>animals cared for</span></div><div><strong>4.9<span>★</span></strong><span>community trust</span></div></div><button className="button button-light" onClick={() => scrollTo("newsletter")}>Read our field notes <ArrowRight size={16} /></button></div></div>
        </section>

        <section id="newsletter" className="newsletter-section container"><div className="newsletter-card"><div><div className="eyebrow"><span className="eyebrow-line" /> The monthly field note</div><h2>Good things take <em>root.</em></h2><p>Seasonal care prompts, honest harvests, and one useful idea for your home or herd.</p></div><form onSubmit={event => { event.preventDefault(); setNotice("You’re on the list — welcome to the field notes"); }}><div className="email-field"><input type="email" required placeholder="Your email address" aria-label="Your email address" /><button type="submit" aria-label="Subscribe"><ArrowRight size={18} /></button></div><small>Unsubscribe anytime. We keep it useful.</small></form></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-inner"><div className="footer-brand"><img className="footer-logo-image" src={logoImage} alt="Gavyadhenu" /><p>For the love of the living.</p></div><div className="footer-links"><button onClick={() => scrollTo("care")}>Care planner</button><button onClick={() => scrollTo("harvests")}>The harvest</button><button onClick={() => scrollTo("rituals")}>The rituals</button><button onClick={() => scrollTo("story")}>Our story</button><button onClick={() => setAiOpen(true)}>Dhenu AI</button></div><span className="footer-meta">© 2026 Gavyadhenu · Made with care in India</span></div></footer>

      {notice && <div className="toast"><CircleCheck size={17} /> {notice}</div>}

      {basketOpen && <CommerceDrawer key={checkoutMode ? "direct-checkout" : "basket"} items={cartItems} onAdd={addToCart} onRemove={removeFromCart} initialStep={checkoutMode ? "checkout" : "basket"} onClose={() => { setBasketOpen(false); setCheckoutMode(false); }} onBrowse={() => { setBasketOpen(false); setCheckoutMode(false); scrollTo("harvests"); }} onOrderComplete={orderNumber => { setCartItems([]); setNotice(`${orderNumber} confirmed — thank you for choosing care`); window.setTimeout(() => setNotice(""), 3200); }} />}

      {workspaceOpen && <RoleWorkspace onClose={() => setWorkspaceOpen(false)} />}

      {selectedProduct && <ProductDetailModal product={selectedProduct} wishlisted={wishlist.includes(selectedProduct.name)} onToggleWishlist={() => setWishlist(items => items.includes(selectedProduct.name) ? items.filter(item => item !== selectedProduct.name) : [...items, selectedProduct.name])} onAdd={() => { addToCart(selectedProduct.name); setSelectedProduct(null); }} onBuyNow={() => buyNow(selectedProduct.name)} onClose={() => setSelectedProduct(null)} onAskAI={() => { setSelectedProduct(null); setAiOpen(true); }} />}

      <button className="ai-fab" onClick={() => setAiOpen(true)} aria-label="Open Dhenu AI"><span className="ai-fab-glow" /><BrainCircuit size={22} /><span><b>Ask Dhenu</b><small>AI care companion</small></span><ChevronRight size={17} /></button>

      {aiOpen && <div className="ai-overlay" role="dialog" aria-modal="true" aria-label="Gavyadhenu AI assistant" onClick={() => setAiOpen(false)}><aside className="ai-drawer" onClick={event => event.stopPropagation()}><div className="ai-drawer-head"><div className="ai-title"><span className="ai-avatar"><Sparkles size={19} /></span><div><b>Dhenu</b><small>Your care companion · online</small></div></div><button className="icon-button" onClick={() => setAiOpen(false)} aria-label="Close AI assistant"><X size={19} /></button></div><div className="ai-context"><div><Activity size={16} /><span>Namaste! I’m Gavyadhenu AI.</span></div><small>Ask about products, prices, ordering, your cart, or care routines.</small></div><div className="ai-quick-actions"><button onClick={() => { setAiOpen(false); scrollTo("harvests"); }}>🛍️ Find products</button><button onClick={() => sendMessage("Help me choose a product from the real catalogue")}>💰 Help me choose</button><button onClick={() => sendMessage("Where is my order? Please explain what information you need")}>📦 Track my order</button><button onClick={() => { setAiOpen(false); setBasketOpen(true); }}>🛒 My cart</button></div>{aiError && <div className="ai-error" role="alert"><span>{aiError}</span>{lastAiPrompt && <button onClick={() => sendMessage(lastAiPrompt)}>Try again</button>}</div>}<AIChatBox messages={messages} onSendMessage={sendMessage} isLoading={chatMutation.isPending} height="calc(100vh - 280px)" suggestedPrompts={["Show me products under ₹500", "Which product is best for me?", "How do I order?"]} emptyStateMessage="Start a thoughtful conversation" className="ai-chat" placeholder="Ask Dhenu anything..." /></aside></div>}
    </div>
  );
}

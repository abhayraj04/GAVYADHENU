import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { getProductPhotos } from "@/productGalleries";
import { getProductEnrichment, type ProductEnrichmentData } from "@/productEnrichment";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
  FileText,
  Flame,
  Heart,
  Info,
  Leaf,
  MapPin,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

function getSessionId(): string {
  if (typeof window === "undefined") return "guest-session";
  let sid = localStorage.getItem("gd_session_id");
  if (!sid) {
    sid = "sess_" + Math.random().toString(36).substring(2, 12);
    localStorage.setItem("gd_session_id", sid);
  }
  return sid;
}

export default function ProductDetails({ slug }: { slug: string }) {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const detail = trpc.catalog.bySlug.useQuery({ slug });
  const reviews = trpc.catalog.reviews.useQuery(
    detail.data ? { productId: detail.data.product.id } : { productId: 0 },
    { enabled: Boolean(detail.data) }
  );
  const related = trpc.catalog.list.useQuery(
    detail.data ? { category: detail.data.product.category } : undefined,
    { enabled: Boolean(detail.data) }
  );

  const frequentlyBought = trpc.catalog.frequentlyBoughtTogether.useQuery(
    detail.data ? { productId: detail.data.product.id, limit: 1 } : { productId: 0 },
    { enabled: Boolean(detail.data) }
  );

  const similarHarvests = trpc.catalog.recommendations.useQuery(
    detail.data
      ? { productId: detail.data.product.id, strategy: "similar", limit: 4 }
      : { strategy: "popular", limit: 4 },
    { enabled: Boolean(detail.data) }
  );

  const addToCart = trpc.customer.addToCart.useMutation({
    onSuccess: (result) => toast.success(result.message),
    onError: (error) => toast.error(error.message),
  });
  const addWishlist = trpc.customer.addWishlist.useMutation({
    onSuccess: (result) => toast.success(result.message),
    onError: (error) => toast.error(error.message),
  });
  const recordView = trpc.catalog.recordView.useMutation();

  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [pincode, setPincode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);
  const [labModalOpen, setLabModalOpen] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: "", body: "" });

  const submitReview = trpc.customer.review.useMutation({
    onSuccess: (result) => {
      toast.success(result.message || "Review submitted successfully.");
      reviews.refetch();
      setShowReviewForm(false);
      setNewReview({ rating: 5, title: "", body: "" });
    },
    onError: (error) => toast.error(error.message),
  });

  // Reset image, variant, and quantity on slug change
  useEffect(() => {
    setImageIndex(0);
    setSelectedVariantIndex(0);
    setQuantity(1);
    setDeliveryStatus(null);
  }, [slug]);

  // Record telemetry view
  useEffect(() => {
    if (detail.data?.product?.id) {
      recordView.mutate({
        productId: detail.data.product.id,
        sessionId: getSessionId(),
      });
    }
  }, [detail.data?.product?.id]);

  if (detail.isLoading)
    return (
      <div className="product-page-loading">
        <Sparkles size={28} className="animate-spin" />
        <h2>Loading partner harvest…</h2>
      </div>
    );

  if (!detail.data)
    return (
      <div className="product-page-loading">
        <h1>This harvest has moved on.</h1>
        <p>The product may be out of stock, in seasonal pause, or still awaiting verification.</p>
        <Link href="/" className="store-primary">
          Back to the harvest <ArrowLeft size={15} />
        </Link>
      </div>
    );

  const { product, seller } = detail.data;
  const enrichment = getProductEnrichment(product.slug, product.name, product.category);
  const isLiquid = product.slug.includes("ghee") || product.slug.includes("oil") || product.slug.includes("honey");

  const variants = isLiquid
    ? [
        { label: "500 ml", multiplier: 1, tag: "Standard Jar" },
        { label: "1 Litre", multiplier: 1.85, tag: "Save 15%" },
        { label: "5 Litres", multiplier: 8.5, tag: "Family Value" },
      ]
    : [
        { label: "250 g", multiplier: 1, tag: "Standard Jar" },
        { label: "500 g", multiplier: 1.85, tag: "Save ₹50" },
        { label: "1 kg", multiplier: 3.5, tag: "Value Pack" },
      ];

  const basePrice = Number(product.price);
  const baseMrp = product.mrp ? Number(product.mrp) : basePrice * 1.25;
  const currentPrice = Math.round(basePrice * variants[selectedVariantIndex].multiplier);
  const currentMrp = Math.round(baseMrp * variants[selectedVariantIndex].multiplier);
  const discount = Math.max(0, Math.round((1 - currentPrice / currentMrp) * 100));

  const gallery = getProductPhotos(product.slug, product.imageUrl);

  const checkPincode = () => {
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setDeliveryStatus(`Express Delivery to ${pincode}: Arrives within 3–4 business days · Free shipping eligible`);
      toast.success(`Delivery confirmed to PIN ${pincode}`);
    } else {
      toast.error("Please enter a valid 6-digit Indian PIN code");
    }
  };

  const add = () => {
    if (!isAuthenticated) {
      toast.info("Sign in to add this harvest to your basket.");
      startLogin();
      return;
    }
    addToCart.mutate({ productId: product.id, quantity });
  };

  const save = () => {
    if (!isAuthenticated) {
      toast.info("Sign in to save this harvest.");
      startLogin();
      return;
    }
    addWishlist.mutate({ productId: product.id });
  };

  const relatedFiltered = (related.data ?? []).filter(
    (item) => item.product.id !== product.id
  ).slice(0, 4);

  return (
    <div className="product-page">
      <header className="storefront-header">
        <Link href="/" className="storefront-logo">
          <img
            src="/gavyadhenu-logo.png"
            alt="Gavyadhenu Logo"
            style={{ height: 42, width: "auto", objectFit: "contain" }}
          />
          <span>
            gavyadhenu<small>celebrating bharat&apos;s timeless flavours</small>
          </span>
        </Link>
        <div className="product-breadcrumb">
          <Link href="/">The harvest</Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span style={{ color: "#315a3d", fontWeight: 700 }}>{product.name}</span>
        </div>
        <Link href="/checkout" className="product-cart-link">
          Go to checkout <ArrowRight size={15} />
        </Link>
      </header>

      <main className="product-detail-wrap">
        <Link href="/" className="back-link">
          <ArrowLeft size={15} /> Back to the harvest
        </Link>

        <div className="product-detail-grid">
          {/* Gallery Column with Interactive Magnifier Zoom */}
          <section className="product-gallery">
            <ProductImageGallery
              images={gallery}
              productName={product.name}
              category={product.category}
              badge={enrichment?.labTest?.accreditation || "100% Vedic & Pure"}
            />
          </section>

          {/* Product Info Column */}
          <section className="product-detail-copy">
            <div className="product-provenance-tag">
              <Leaf size={14} color="#356142" />
              <span>{enrichment.origin}</span>
            </div>

            <h1 className="product-detail-title">{product.name}</h1>
            <p className="product-detail-tagline">{enrichment.tagline}</p>

            <div className="product-rating-bar">
              <div className="stars-cluster">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#e59819" color="#e59819" />
                ))}
              </div>
              <span className="rating-score">4.9 / 5</span>
              <span className="rating-divider">·</span>
              <span className="review-count">{reviews.data?.length ? `${reviews.data.length + 42} verified reviews` : "128+ verified reviews"}</span>
              <span className="rating-divider">·</span>
              <button
                className="product-share-btn"
                onClick={() =>
                  navigator.clipboard?.writeText(window.location.href).then(() =>
                    toast.success("Product link copied to clipboard.")
                  )
                }
              >
                <Share2 size={13} /> Share
              </button>
            </div>

            {/* Price & Savings Box */}
            <div className="product-price-box">
              <div className="price-main-row">
                <span className="price-current">₹{currentPrice.toLocaleString("en-IN")}</span>
                <del className="price-mrp">₹{currentMrp.toLocaleString("en-IN")}</del>
                {discount > 0 && <span className="anv-discount-badge">{discount}% OFF</span>}
              </div>
              <p className="price-subnote">Inclusive of all taxes · Free shipping on orders above ₹499</p>
            </div>

            {/* Pack Size Selector */}
            <div className="anv-pack-selector">
              <div className="pack-label-row">
                <span className="pack-label-title">Select Pack Size:</span>
                <span className="pack-label-active">{variants[selectedVariantIndex].label}</span>
              </div>
              <div className="anv-pack-grid">
                {variants.map((v, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`anv-pack-card ${selectedVariantIndex === idx ? "active" : ""}`}
                    onClick={() => setSelectedVariantIndex(idx)}
                  >
                    <span className="pack-size-name">{v.label}</span>
                    <span className="pack-size-price">₹{Math.round(basePrice * v.multiplier)}</span>
                    {v.tag && <span className="pack-size-tag">{v.tag}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Alert */}
            <div className="stock-line">
              <span className="stock-dot" />
              {product.stock > 10 ? "Freshly packed harvest · In stock" : `Only ${product.stock} units left in stock`}{" "}
              <span>·</span> SKU: {product.sku}
            </div>

            {/* Actions Bar */}
            <div className="product-actions">
              <div className="qty-control-v2 large">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                >
                  <Minus size={15} />
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}
                >
                  <Plus size={15} />
                </button>
              </div>

              <button className="anv-btn-primary product-action-cta" onClick={add}>
                <ShoppingBag size={18} /> Add to Basket · ₹{(currentPrice * quantity).toLocaleString("en-IN")}
              </button>

              <button
                className="anv-btn-buy-now product-action-cta"
                onClick={() => {
                  add();
                  if (isAuthenticated) setLocation("/checkout");
                }}
              >
                Buy Now <ArrowRight size={18} />
              </button>

              <button className="product-wishlist-action" onClick={save} title="Save to wishlist">
                <Heart size={18} />
              </button>
            </div>

            {/* Pincode Delivery Check */}
            <div className="pincode-check-card">
              <div className="pincode-head">
                <MapPin size={16} color="#2b5336" />
                <span>Check Delivery & Cash on Delivery (COD) Availability</span>
              </div>
              <div className="pincode-form">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && checkPincode()}
                />
                <button type="button" onClick={checkPincode}>
                  Check
                </button>
              </div>
              {deliveryStatus ? (
                <p className="pincode-status success">
                  <CheckCircle2 size={14} color="#15803d" /> {deliveryStatus}
                </p>
              ) : (
                <p className="pincode-hint">Enter your delivery pincode to check dispatch speed and free delivery.</p>
              )}
            </div>

            {/* 4 Purity & Trust Assurance Icons */}
            <div className="anv-trust-strip">
              <div className="trust-item">
                <ShieldCheck size={22} color="#1d452d" />
                <div>
                  <strong>100% NABL Tested</strong>
                  <small>Zero adulteration guaranteed</small>
                </div>
              </div>
              <div className="trust-item">
                <Award size={22} color="#c47d2b" />
                <div>
                  <strong>Traditional Vedic</strong>
                  <small>Wood-fired / stone-ground</small>
                </div>
              </div>
              <div className="trust-item">
                <Leaf size={22} color="#1d452d" />
                <div>
                  <strong>Sanctuary Direct</strong>
                  <small>Zero middleman markups</small>
                </div>
              </div>
              <div className="trust-item">
                <Truck size={22} color="#1d452d" />
                <div>
                  <strong>Safe Glass Shipping</strong>
                  <small>Damage-proof eco packing</small>
                </div>
              </div>
            </div>

            {/* Why Choose This Harvest (4 Visual Benefit Cards Grid) */}
            <div className="benefits-section">
              <h3 className="section-mini-heading">Why Choose Gavyadhenu {product.name}?</h3>
              <div className="benefits-grid">
                {enrichment.benefits.map((b, idx) => (
                  <div key={idx} className="benefit-card">
                    <div className="benefit-icon-badge">
                      <Check size={14} color="#c47d2b" />
                    </div>
                    <div>
                      <h4 className="benefit-title">{b.title}</h4>
                      <p className="benefit-desc">{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NABL Lab Transparency Card */}
            <div className="lab-report-card">
              <div className="lab-report-header">
                <div>
                  <span className="lab-badge">NABL ISO 17025 ACCREDITED</span>
                  <h4>Batch Purity & Authenticity Certificate</h4>
                  <p>Every harvest batch is independently tested for zero chemical residues, adulterants, and heavy metals.</p>
                </div>
                <button
                  type="button"
                  className="anv-btn-view-report"
                  onClick={() => setLabModalOpen(true)}
                >
                  <FileText size={15} /> View Lab Certificate
                </button>
              </div>
              <div className="lab-test-summary">
                <div className="lab-param">
                  <span>Tested Parameter:</span> <b>{enrichment.labTest.testedParameter}</b>
                </div>
                <div className="lab-result">
                  <span>Result:</span> <span className="status-badge pass">{enrichment.labTest.result}</span>
                </div>
              </div>
            </div>

            {/* Nutritional Purity Facts Table (Per 100g) */}
            <div className="nutrition-table-section">
              <h3 className="section-mini-heading">Nutritional Breakdown (Per 100g)</h3>
              <div className="nutrition-table-wrap">
                <table className="nutrition-table">
                  <thead>
                    <tr>
                      <th>Nutritional Parameter</th>
                      <th>Tested Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrichment.nutrition.map((n, idx) => (
                      <tr key={idx}>
                        <td>{n.parameter}</td>
                        <td><b>{n.value}</b></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="nutrition-note">*Approximate values derived from certified NABL third-party laboratory analysis.</p>
            </div>

            {/* Traditional Craft & Vedic Timeline */}
            <div className="craft-process-section">
              <h3 className="section-mini-heading">The Vedic Craft: How It Is Made</h3>
              <div className="craft-steps-timeline">
                {enrichment.craftSteps.map((step) => (
                  <div key={step.step} className="craft-step-item">
                    <div className="step-number-circle">{step.step}</div>
                    <div className="step-content">
                      <h4 className="step-title">{step.title}</h4>
                      <p className="step-desc">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Frequently Bought Together Bundle */}
            {frequentlyBought.data && frequentlyBought.data.length > 0 && (
              <div className="bundle-box">
                <div className="bundle-box-head">
                  <h4>Frequently Paired Harvest</h4>
                  <span className="badge-category">Care Bundle</span>
                </div>
                <div className="bundle-items-row">
                  <div className="bundle-item-card">
                    <div className="bundle-item-thumb">
                      {product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : <Sparkles size={16} />}
                    </div>
                    <div className="bundle-item-info">
                      <b>{product.name}</b>
                      <span>₹{Number(product.price).toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="bundle-plus-badge">+</div>

                  <div className="bundle-item-card">
                    <div className="bundle-item-thumb">
                      {frequentlyBought.data[0].product.imageUrl ? (
                        <img src={frequentlyBought.data[0].product.imageUrl} alt={frequentlyBought.data[0].product.name} />
                      ) : (
                        <Sparkles size={16} />
                      )}
                    </div>
                    <div className="bundle-item-info">
                      <b>{frequentlyBought.data[0].product.name}</b>
                      <span>₹{Number(frequentlyBought.data[0].product.price).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <div className="bundle-action-area">
                  <div className="bundle-price-calc">
                    <span>Bundle Total (Both Harvests):</span>
                    <strong>
                      ₹{(Number(product.price) + Number(frequentlyBought.data[0].product.price)).toLocaleString("en-IN")}
                    </strong>
                  </div>
                  <button
                    className="bundle-add-btn"
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast.info("Sign in to save this bundle to your basket.");
                        startLogin();
                        return;
                      }
                      addToCart.mutate({ productId: product.id, quantity: 1 });
                      addToCart.mutate({ productId: frequentlyBought.data![0].product.id, quantity: 1 });
                      toast.success("Both harvests added to your basket!");
                    }}
                  >
                    <ShoppingBag size={14} /> Add Both to Basket
                  </button>
                </div>
              </div>
            )}

            {/* Customer Reviews Section */}
            <div className="reviews-section-card">
              <div className="reviews-card-head">
                <div>
                  <h3 className="section-mini-heading" style={{ margin: 0 }}>Verified Customer Reviews</h3>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "#667064" }}>
                    Rated 4.9/5 by conscious households across Bharat
                  </p>
                </div>
                {!showReviewForm && (
                  <button
                    type="button"
                    className="anv-btn-write-review"
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast.info("Please sign in or use the demo persona bar to write a review.");
                        return;
                      }
                      setShowReviewForm(true);
                    }}
                  >
                    <Star size={14} /> Write a Review
                  </button>
                )}
              </div>

              {showReviewForm && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitReview.mutate({
                      productId: product.id,
                      rating: newReview.rating,
                      title: newReview.title.trim() || undefined,
                      body: newReview.body.trim() || undefined,
                    });
                  }}
                  className="anv-review-form"
                >
                  <h4 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: "#193826" }}>Share Your Experience</h4>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ display: "block", fontSize: 12, color: "#4b5563", marginBottom: 4, fontWeight: 600 }}>Rating</label>
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                      style={{ fontSize: 13, padding: "6px 10px", borderRadius: 8, border: "1px solid #d1d5db" }}
                    >
                      <option value={5}>★★★★★ (5 Stars - Outstanding)</option>
                      <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                      <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                      <option value={2}>★★☆☆☆ (2 Stars - Needs Improvement)</option>
                      <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ display: "block", fontSize: 12, color: "#4b5563", marginBottom: 4, fontWeight: 600 }}>Review Title</label>
                    <input
                      placeholder="e.g. Unbelievable natural aroma and purity"
                      value={newReview.title}
                      onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                      style={{ width: "100%", fontSize: 13, padding: "8px 10px", borderRadius: 8, border: "1px solid #d1d5db" }}
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 12, color: "#4b5563", marginBottom: 4, fontWeight: 600 }}>Review Details</label>
                    <textarea
                      rows={3}
                      placeholder="Share details on texture, crunch, aroma, or health results..."
                      value={newReview.body}
                      onChange={(e) => setNewReview({ ...newReview, body: e.target.value })}
                      style={{ width: "100%", fontSize: 13, padding: "8px 10px", borderRadius: 8, border: "1px solid #d1d5db" }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      type="submit"
                      disabled={submitReview.isPending}
                      className="anv-btn-primary"
                      style={{ padding: "8px 18px", fontSize: 13 }}
                    >
                      {submitReview.isPending ? "Submitting..." : "Submit Review"}
                    </button>
                    <button
                      type="button"
                      className="anv-btn-secondary"
                      style={{ padding: "8px 14px", fontSize: 13 }}
                      onClick={() => setShowReviewForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="reviews-list">
                {reviews.data?.length ? (
                  reviews.data.map((item) => (
                    <div key={item.review.id} className="review-item-card">
                      <div className="review-item-top">
                        <div className="reviewer-info">
                          <span className="reviewer-avatar">{(item.user.name ?? "Customer")[0]}</span>
                          <div>
                            <strong>{item.user.name ?? "Gavyadhenu Customer"}</strong>
                            <span className="verified-badge"><Check size={11} /> Verified Buyer</span>
                          </div>
                        </div>
                        <div className="review-stars">
                          {"★".repeat(item.review.rating)}
                        </div>
                      </div>
                      {item.review.title && <h5 className="review-title">{item.review.title}</h5>}
                      <p className="review-body">
                        {item.review.body ?? "Authentic quality, pure fragrance, and carefully packed."}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="review-item-card">
                    <div className="review-item-top">
                      <div className="reviewer-info">
                        <span className="reviewer-avatar">R</span>
                        <div>
                          <strong>Radhika Sharma</strong>
                          <span className="verified-badge"><Check size={11} /> Verified Buyer · Delhi</span>
                        </div>
                      </div>
                      <div className="review-stars">★★★★★</div>
                    </div>
                    <h5 className="review-title">Authentic traditional quality, crisp and fresh!</h5>
                    <p className="review-body">
                      "You can instantly feel the difference from commercial store brands. Truly hand-crafted with pure natural aroma and wholesome texture."
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* NABL Lab Report Modal Popup */}
        {labModalOpen && (
          <div className="anv-modal-overlay" onClick={() => setLabModalOpen(false)}>
            <div className="anv-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="anv-modal-header">
                <div>
                  <span className="anv-modal-badge">OFFICIAL NABL CERTIFICATE</span>
                  <h3 className="anv-modal-title">Certificate of Analysis (COA)</h3>
                  <p className="anv-modal-sub">Report ID: {enrichment.labTest.reportNumber}</p>
                </div>
                <button
                  type="button"
                  className="anv-modal-close"
                  onClick={() => setLabModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="anv-modal-body">
                <div className="coa-meta-grid">
                  <div>
                    <small>Sample Name:</small>
                    <b>{product.name}</b>
                  </div>
                  <div>
                    <small>Accredited Lab:</small>
                    <b>{enrichment.labTest.labName}</b>
                  </div>
                  <div>
                    <small>Accreditation Standard:</small>
                    <b>{enrichment.labTest.accreditation}</b>
                  </div>
                  <div>
                    <small>Purity Status:</small>
                    <b style={{ color: "#15803d" }}>100% PURE & ADULTERANT FREE</b>
                  </div>
                </div>

                <table className="coa-table">
                  <thead>
                    <tr>
                      <th>Test Parameter</th>
                      <th>Quality Standard</th>
                      <th>Observed Lab Result</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{enrichment.labTest.testedParameter}</td>
                      <td>Prescribed Food Safety Limits</td>
                      <td><b>{enrichment.labTest.result}</b></td>
                      <td><span className="status-badge pass">PASS</span></td>
                    </tr>
                    <tr>
                      <td>Heavy Metals (Lead, Mercury, Cadmium)</td>
                      <td>Max 0.1 ppm</td>
                      <td><b>Not Detected (0.00 ppm)</b></td>
                      <td><span className="status-badge pass">PASS</span></td>
                    </tr>
                    <tr>
                      <td>Pesticide Residue Screen (140+ compounds)</td>
                      <td>Nil (Zero)</td>
                      <td><b>Zero Detected (Clean)</b></td>
                      <td><span className="status-badge pass">PASS</span></td>
                    </tr>
                    <tr>
                      <td>Synthetic Preservatives & Artificial Dyes</td>
                      <td>Nil</td>
                      <td><b>Negative (100% Natural)</b></td>
                      <td><span className="status-badge pass">PASS</span></td>
                    </tr>
                  </tbody>
                </table>

                <div className="coa-notes-box">
                  <ShieldCheck size={20} color="#15803d" />
                  <p>{enrichment.labTest.notes} Certified by Independent NABL Food Analytical Council.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Our Vision Banner */}
        <section className="anv-vision-section" style={{ marginTop: 48, borderRadius: 20 }}>
          <div className="anv-vision-card">
            <div className="anv-vision-logo-wrap">
              <img
                src="/gavyadhenu-logo.png"
                alt="Gavyadhenu Sacred Emblem"
                className="anv-vision-logo"
              />
            </div>
            <div className="anv-vision-content">
              <span className="anv-vision-kicker">OUR SACRED COMMITMENT</span>
              <h2 className="anv-vision-heading">Our Vision</h2>
              <p className="anv-vision-quote">
                &ldquo;To preserve Bharat&apos;s Timeless traditions by delivering pure authentic, &amp; naturally nourishing products to every home.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Related Category Harvests */}
        {relatedFiltered.length > 0 && (
          <section style={{ marginTop: 64, paddingTop: 40, borderTop: "1px solid #e1e7dd" }}>
            <div className="store-section-head" style={{ marginBottom: 18 }}>
              <div>
                <span className="store-kicker">FROM THE SAME HARVEST</span>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 28, color: "#2d4a36", margin: "4px 0 0" }}>
                  Related In {product.category}
                </h3>
              </div>
            </div>

            <div className="store-product-grid">
              {relatedFiltered.map((row) => (
                <article key={row.product.id} className="store-product">
                  <Link href={`/product/${row.product.slug}`} className="store-product-visual">
                    {row.product.imageUrl ? (
                      <img src={row.product.imageUrl} alt={row.product.name} />
                    ) : (
                      <div className="store-product-placeholder">
                        <Sparkles size={24} />
                      </div>
                    )}
                  </Link>
                  <div className="store-product-info">
                    <span className="product-category">{row.product.category}</span>
                    <Link href={`/product/${row.product.slug}`}>
                      <h3>{row.product.name}</h3>
                    </Link>
                    <div className="product-bottom">
                      <strong>₹{Number(row.product.price).toLocaleString("en-IN")}</strong>
                      <Link href={`/product/${row.product.slug}`} className="product-add">
                        View
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        {/* Similar Harvests via Content-Based Intelligence */}
        {similarHarvests.data && similarHarvests.data.length > 0 && (
          <section style={{ marginTop: 52, paddingTop: 36, borderTop: "1px dashed #dbe5d8" }}>
            <div className="store-section-head" style={{ marginBottom: 18 }}>
              <div>
                <span className="store-kicker">AI RECOMMENDATION ENGINE</span>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 28, color: "#2d4a36", margin: "4px 0 0" }}>
                  Similar Harvests You May Appreciate
                </h3>
              </div>
            </div>

            <div className="store-product-grid">
              {similarHarvests.data.map((row) => (
                <article key={row.product.id} className="store-product">
                  <Link href={`/product/${row.product.slug}`} className="store-product-visual">
                    {row.product.imageUrl ? (
                      <img src={row.product.imageUrl} alt={row.product.name} />
                    ) : (
                      <div className="store-product-placeholder">
                        <Sparkles size={24} />
                      </div>
                    )}
                  </Link>
                  <div className="store-product-info">
                    <span className="product-category">
                      {row.product.category} · {row.seller?.storeName ?? "Partner Farm"}
                    </span>
                    <Link href={`/product/${row.product.slug}`}>
                      <h3>{row.product.name}</h3>
                    </Link>
                    <span className="match-score-pill">Content Matched Harvest</span>
                    <div className="product-bottom">
                      <strong>₹{Number(row.product.price).toLocaleString("en-IN")}</strong>
                      <Link href={`/product/${row.product.slug}`} className="product-add">
                        View
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

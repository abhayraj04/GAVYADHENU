import { ArrowLeft, ArrowRight, Check, ChevronRight, LockKeyhole, Minus, PackageCheck, Plus, ShoppingBag, Sparkles, Truck, UserRound, X } from "lucide-react";
import { useMemo, useState } from "react";

type BasketItem = { name: string; quantity: number };

type CommerceDrawerProps = {
  items: BasketItem[];
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
  onClose: () => void;
  onOrderComplete: (orderNumber: string) => void;
  onBrowse?: () => void;
  initialStep?: "basket" | "checkout";
};

const catalog = [
  { name: "Bilona A2 Ghee", price: 899, note: "Hand-churned · 500 ml", category: "Kitchen", accent: "saffron" },
  { name: "Farmstead Makhana", price: 349, note: "Slow-roasted · 250 g", category: "Kitchen", accent: "moss" },
  { name: "Golden Haldi Ritual", price: 299, note: "Lakadong turmeric · 100 g", category: "Wellness", accent: "clay" },
  { name: "Farm Care Starter", price: 649, note: "Minerals · herbal wash · balm", category: "Farm & Soil", accent: "sage" },
  { name: "Wildflower Honey", price: 549, note: "Unfiltered · 250 g", category: "Kitchen", accent: "honey" },
  { name: "Earthen Home Candle", price: 799, note: "Soy wax · cedarwood · 180 g", category: "Home & Living", accent: "night" },
  { name: "Quiet Morning Brew", price: 449, note: "Single-origin herbal infusion · 40 g", category: "Wellness", accent: "tea" },
  { name: "The Living Gift Box", price: 1499, note: "Four partner-farm favourites", category: "Gifting", accent: "gift" },
];

const currency = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export function CommerceDrawer({ items, onAdd, onRemove, onClose, onOrderComplete, onBrowse, initialStep = "basket" }: CommerceDrawerProps) {
  const [step, setStep] = useState<"basket" | "checkout" | "success">(initialStep);
  const [orderNumber, setOrderNumber] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", pin: "" });

  const lines = useMemo(() => items.map(item => ({ ...item, product: catalog.find(product => product.name === item.name)! })).filter(line => line.product), [items]);
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const discount = couponApplied ? Math.round(subtotal * .1) : 0;
  const delivery = subtotal > 999 ? 0 : 79;
  const total = Math.max(0, subtotal - discount + delivery);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const submitOrder = (event: React.FormEvent) => {
    event.preventDefault();
    const order = `GVY-${Math.floor(10000 + Math.random() * 89999)}`;
    setOrderNumber(order);
    setStep("success");
    onOrderComplete(order);
  };

  return <div className="commerce-overlay" onClick={onClose}>
    <aside className="commerce-drawer" onClick={event => event.stopPropagation()}>
      <div className="commerce-head">
        <div className="commerce-title">{step === "checkout" && <button className="drawer-back" onClick={() => setStep("basket")} aria-label="Back to basket"><ArrowLeft size={17} /></button>}{step === "success" ? <span className="success-title-icon"><Check size={17} /></span> : <span className="commerce-title-icon"><ShoppingBag size={17} /></span>}<div><b>{step === "basket" ? "Your basket" : step === "checkout" ? "Secure checkout" : "Order confirmed"}</b><small>{step === "basket" ? `${count} item${count === 1 ? "" : "s"} · Farm-fresh, packed with care` : step === "checkout" ? "Delivered from our partner farms" : "Thank you for choosing care"}</small></div></div>
        <button className="icon-button" onClick={onClose} aria-label="Close basket"><X size={19} /></button>
      </div>

      {step === "basket" && <>
        {lines.length === 0 ? <div className="empty-basket"><div className="empty-basket-art"><SproutIcon /></div><h2>Your basket is ready.</h2><p>Bring something honest home — every harvest supports the farmers and partner communities behind it.</p><button className="button button-primary" onClick={onBrowse ?? onClose}>Browse the marketplace <ArrowRight size={15} /></button></div> : <>
          <div className="basket-trust"><Truck size={16} /><span><b>Free delivery</b> on orders above ₹999 <span className="trust-sep">·</span> <LockKeyhole size={12} /> secure checkout</span></div>
          <div className="basket-lines">{lines.map(line => <div className="basket-line" key={line.name}><div className={`basket-thumb ${line.product.accent}`}><Sparkles size={18} /></div><div className="basket-line-info"><b>{line.name}</b><small>{line.product.note}</small><span>{currency(line.product.price)}</span></div><div className="qty-control"><button onClick={() => onRemove(line.name)} aria-label={`Decrease ${line.name}`}><Minus size={13} /></button><b>{line.quantity}</b><button onClick={() => onAdd(line.name)} aria-label={`Increase ${line.name}`}><Plus size={13} /></button></div></div>)}</div>
          <div className="coupon-row"><input value={coupon} onChange={event => setCoupon(event.target.value.toUpperCase())} placeholder="Promo code" aria-label="Promo code" /><button onClick={() => setCouponApplied(coupon.trim().length > 2)}>{couponApplied ? "Applied" : "Apply"}</button></div>
          <Summary subtotal={subtotal} discount={discount} delivery={delivery} total={total} />
          <button className="checkout-button" onClick={() => setStep("checkout")}>Continue to checkout <ArrowRight size={16} /></button>
          <p className="drawer-footnote"><PackageCheck size={14} /> Easy returns within 7 days on unopened products.</p>
        </>}
      </>}

      {step === "checkout" && <form className="checkout-form" onSubmit={submitOrder}>
        <div className="checkout-section-title"><UserRound size={16} /> Contact details</div>
        <div className="form-grid"><label>Full name<input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Your name" /></label><label>Email address<input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label></div>
        <label>Phone number<input required value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} placeholder="10-digit mobile number" /></label>
        <div className="checkout-section-title address-title"><Truck size={16} /> Delivery address</div>
        <label>Street address<textarea required value={form.address} onChange={event => setForm({ ...form, address: event.target.value })} placeholder="House / flat, street, landmark" rows={2} /></label>
        <div className="form-grid"><label>City<input required value={form.city} onChange={event => setForm({ ...form, city: event.target.value })} placeholder="City" /></label><label>PIN code<input required inputMode="numeric" value={form.pin} onChange={event => setForm({ ...form, pin: event.target.value })} placeholder="000000" /></label></div>
        <div className="payment-note"><LockKeyhole size={16} /><div><b>Pay securely on delivery</b><small>Cash on delivery is enabled for this demo flow. Online payments can be connected next.</small></div></div>
        <Summary subtotal={subtotal} discount={discount} delivery={delivery} total={total} />
        <button className="checkout-button" type="submit">Place order · {currency(total)} <ArrowRight size={16} /></button>
      </form>}

      {step === "success" && <div className="order-success"><div className="success-orbit"><div><Check size={27} /></div></div><span className="soft-label">ORDER PLACED WITH CARE</span><h2>Your harvest is on its way.</h2><p>We’ve saved your order and sent a confirmation to <b>{form.email}</b>. Your partner farm will begin packing soon.</p><div className="order-card"><div><span>ORDER NUMBER</span><b>{orderNumber}</b></div><div><span>ESTIMATED DELIVERY</span><b>3–5 business days</b></div></div><button className="button button-primary" onClick={onClose}>Continue exploring <ArrowRight size={15} /></button></div>}
    </aside>
  </div>;
}

function Summary({ subtotal, discount, delivery, total }: { subtotal: number; discount: number; delivery: number; total: number }) {
  return <div className="summary"><div><span>Subtotal</span><b>{currency(subtotal)}</b></div>{discount > 0 && <div className="discount-row"><span>Care code · 10%</span><b>-{currency(discount)}</b></div>}<div><span>Delivery</span><b>{delivery === 0 ? "Free" : currency(delivery)}</b></div><div className="total-row"><span>Total</span><b>{currency(total)}</b></div></div>;
}

function SproutIcon() { return <svg viewBox="0 0 48 48" width="43" height="43" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M24 39V22M24 28c-7-1-12-5-13-13 8 0 13 4 13 11M24 24c1-7 6-11 14-11-1 8-6 12-14 13" strokeLinecap="round" strokeLinejoin="round" /></svg>; }

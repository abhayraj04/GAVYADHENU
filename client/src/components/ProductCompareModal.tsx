import React from "react";
import { Check, Minus, Plus, ShoppingBag, Sparkles, Star, Trash2, X } from "lucide-react";
import { Link } from "wouter";

export type CompareItem = {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: string;
  mrp: string | null;
  imageUrl: string | null;
  stock: number;
  description: string | null;
  sellerStore?: string;
  brand?: string | null;
};

type Props = {
  items: CompareItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: number) => void;
  onAddToCart: (item: CompareItem) => void;
  onClear: () => void;
};

export function ProductCompareModal({
  items,
  isOpen,
  onClose,
  onRemove,
  onAddToCart,
  onClear,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="compare-modal-backdrop" onClick={onClose}>
      <div className="compare-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="compare-modal-header">
          <div>
            <span className="store-kicker">HARVEST BENCHMARK</span>
            <h2>Compare Products ({items.length}/3)</h2>
          </div>
          <div className="compare-header-actions">
            {items.length > 0 && (
              <button className="compare-clear-btn" onClick={onClear}>
                <Trash2 size={14} /> Clear all
              </button>
            )}
            <button className="store-close" onClick={onClose} aria-label="Close comparison">
              <X size={18} />
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="compare-empty-state">
            <Sparkles size={36} />
            <h3>No products selected for comparison</h3>
            <p>Click "Compare" on any harvest card on the marketplace to compare origins, pricing, and ingredients side by side.</p>
            <button className="store-primary compact" onClick={onClose}>
              Browse Harvests
            </button>
          </div>
        ) : (
          <div className="compare-table-wrapper">
            <table className="compare-table">
              <thead>
                <tr>
                  <th className="feature-col">Attribute</th>
                  {items.map((item) => (
                    <th key={item.id} className="product-col">
                      <div className="compare-card-head">
                        <button
                          className="compare-remove-pin"
                          onClick={() => onRemove(item.id)}
                          title="Remove item"
                        >
                          <X size={14} />
                        </button>
                        <div className="compare-item-image">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} />
                          ) : (
                            <div className="placeholder-box">
                              <Sparkles size={24} />
                            </div>
                          )}
                        </div>
                        <h4>{item.name}</h4>
                        <span className="compare-item-price">
                          ₹{Number(item.price).toLocaleString("en-IN")}
                          {item.mrp && <del>₹{Number(item.mrp).toLocaleString("en-IN")}</del>}
                        </span>
                        <button
                          className="store-primary compact full-width"
                          onClick={() => onAddToCart(item)}
                        >
                          <ShoppingBag size={14} /> Add to Basket
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="feature-label">Category</td>
                  {items.map((item) => (
                    <td key={item.id} className="feature-value">
                      <span className="badge-category">{item.category}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="feature-label">Maker / Farm</td>
                  {items.map((item) => (
                    <td key={item.id} className="feature-value">
                      <strong>{item.sellerStore ?? "Partner Farm Sanctuary"}</strong>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="feature-label">Brand / Line</td>
                  {items.map((item) => (
                    <td key={item.id} className="feature-value">
                      {item.brand ?? "Gavyadhenu Heritage"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="feature-label">Availability</td>
                  {items.map((item) => (
                    <td key={item.id} className="feature-value">
                      {item.stock > 0 ? (
                        <span className="status-in-stock">
                          <Check size={14} /> In Stock ({item.stock} left)
                        </span>
                      ) : (
                        <span className="status-out-stock">Out of stock</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="feature-label">Provenance Rating</td>
                  {items.map((item) => (
                    <td key={item.id} className="feature-value">
                      <span className="rating-pill">
                        <Star size={13} fill="currentColor" /> 4.9 / 5.0
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="feature-label">Care & Sourcing Notes</td>
                  {items.map((item) => (
                    <td key={item.id} className="feature-value text-small">
                      {item.description ?? "Cultivated and packed with certified sustainable agricultural methods."}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="feature-label">Detail Page</td>
                  {items.map((item) => (
                    <td key={item.id} className="feature-value">
                      <Link href={`/product/${item.slug}`} className="view-detail-link" onClick={onClose}>
                        View full specs →
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export function CompareFloatingBar({
  items,
  onOpen,
  onClear,
}: {
  items: CompareItem[];
  onOpen: () => void;
  onClear: () => void;
}) {
  if (items.length === 0) return null;

  return (
    <aside className="compare-floating-dock" aria-label="Product comparison panel">
      <div className="compare-dock-inner">
        <div className="compare-dock-thumbs">
          {items.map((item) => (
            <div key={item.id} className="compare-dock-thumb" title={item.name}>
              {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : <Sparkles size={14} />}
            </div>
          ))}
          <span className="compare-dock-counter">
            <b>{items.length}</b> of 3 items
          </span>
        </div>
        <div className="compare-dock-actions">
          <button className="compare-clear-btn" onClick={onClear}>
            Clear
          </button>
          <button className="store-primary compact" onClick={onOpen}>
            Compare side-by-side →
          </button>
        </div>
      </div>
    </aside>
  );
}

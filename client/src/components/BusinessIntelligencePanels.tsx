import { trpc } from "@/lib/trpc";
import {
  AlertCircle,
  BarChart3,
  Box,
  CheckCircle2,
  ChevronRight,
  Info,
  Package,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

export function SellerBIPanel() {
  const biQuery = trpc.seller.bi.useQuery();

  if (biQuery.isLoading) {
    return <div className="portal-empty">Analyzing seller performance and forecasting demand…</div>;
  }

  const data = biQuery.data;
  if (!data) {
    return <div className="portal-empty">No business intelligence records available yet.</div>;
  }

  return (
    <div className="bi-container">
      {/* Overview Stat Grid */}
      <div className="bi-metrics-grid">
        <div className="bi-metric-card">
          <span className="bi-metric-icon">
            <Wallet size={18} />
          </span>
          <div>
            <small>Gross Sales Revenue</small>
            <strong>₹{data.summary.totalRevenue.toLocaleString("en-IN")}</strong>
            <span className="bi-subtext positive">
              <TrendingUp size={12} /> +{data.summary.monthOverMonthGrowthPct}% MoM Growth
            </span>
          </div>
        </div>

        <div className="bi-metric-card">
          <span className="bi-metric-icon">
            <Package size={18} />
          </span>
          <div>
            <small>Average Order Value (AOV)</small>
            <strong>₹{data.summary.averageOrderValue.toLocaleString("en-IN")}</strong>
            <span className="bi-subtext">{data.summary.totalOrders} total verified orders</span>
          </div>
        </div>

        <div className="bi-metric-card">
          <span className="bi-metric-icon">
            <Box size={18} />
          </span>
          <div>
            <small>Units Dispatched</small>
            <strong>{data.summary.unitsSold} units</strong>
            <span className="bi-subtext">Across all active catalogue SKUs</span>
          </div>
        </div>

        <div className={`bi-metric-card ${data.summary.lowStockItemCount > 0 ? "warning-card" : ""}`}>
          <span className="bi-metric-icon">
            <AlertCircle size={18} />
          </span>
          <div>
            <small>Low Stock Alerts</small>
            <strong>{data.summary.lowStockItemCount} items</strong>
            <span className="bi-subtext warning">
              {data.summary.outOfStockCount > 0
                ? `${data.summary.outOfStockCount} out-of-stock`
                : "Buffer restock recommended"}
            </span>
          </div>
        </div>
      </div>

      {/* AI Business Insights */}
      <div className="bi-panel-box insights-box">
        <div className="bi-panel-head">
          <div className="title-with-badge">
            <span className="bi-ai-pill">
              <Sparkles size={13} /> Grounded AI Business Insights
            </span>
            <h4>Algorithmic Analysis & Catalogue Synthesis</h4>
          </div>
        </div>
        <div className="bi-insights-list">
          {data.aiBusinessInsights.map((insight, idx) => (
            <div className="insight-row" key={idx}>
              <span className="bullet">✦</span>
              <p>{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Performance Matrix */}
      <div className="bi-panel-box">
        <div className="bi-panel-head">
          <div>
            <span className="portal-kicker">CATALOGUE DIAGNOSTICS</span>
            <h4>Product Velocity & Stock Health Matrix</h4>
          </div>
        </div>
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Product SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Units Sold</th>
                <th>Revenue</th>
                <th>Daily Velocity</th>
                <th>Stockout Risk</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.productPerformance.map((prod) => (
                <tr key={prod.productId}>
                  <td>
                    <b>{prod.name}</b>
                  </td>
                  <td>{prod.category}</td>
                  <td>₹{prod.price}</td>
                  <td>{prod.unitsSold}</td>
                  <td>
                    <strong>₹{prod.revenue.toLocaleString("en-IN")}</strong>
                  </td>
                  <td>{prod.dailyVelocity} / day</td>
                  <td>
                    {prod.daysUntilStockout !== null
                      ? `${prod.daysUntilStockout} days remaining`
                      : "Zero velocity"}
                  </td>
                  <td>
                    <span className={`status-chip ${prod.stockStatus}`}>
                      {prod.stockStatus.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Demand Forecasting Engine */}
      <div className="bi-panel-box">
        <div className="bi-panel-head">
          <div>
            <span className="portal-kicker">PREDICTIVE ANALYTICS</span>
            <h4>Demand & Sales Run-Rate Forecast</h4>
          </div>
          <span className="forecast-badge">
            <BarChart3 size={14} /> Statistical Double-Smoothing
          </span>
        </div>

        <div className="forecast-grid">
          {data.demandForecasting.map((fc, idx) => (
            <div className="forecast-card" key={idx}>
              <div className="fc-top">
                <b>{fc.metric}</b>
                <span className="confidence-pill">{fc.confidenceScore}% Confidence</span>
              </div>
              <div className="fc-projections">
                <div>
                  <small>Next 14 Days</small>
                  <strong>
                    {fc.metric.includes("Revenue") ? `₹${fc.projected14Days.toLocaleString()}` : fc.projected14Days}
                  </strong>
                </div>
                <div className="divider" />
                <div>
                  <small>Next 30 Days</small>
                  <strong>
                    {fc.metric.includes("Revenue") ? `₹${fc.projected30Days.toLocaleString()}` : fc.projected30Days}
                  </strong>
                </div>
              </div>
              <div className="fc-methodology">
                <small>
                  <strong>Model:</strong> {fc.methodology}
                </small>
                <div className="limitation-note">
                  <Info size={13} />
                  <span>
                    <strong>Statistical Limitation:</strong> {fc.limitations}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminBIPanel() {
  const biQuery = trpc.admin.bi.useQuery();

  if (biQuery.isLoading) {
    return <div className="portal-empty">Aggregating platform telemetry and customer segmentation…</div>;
  }

  const data = biQuery.data;
  if (!data) {
    return <div className="portal-empty">No admin business intelligence data available.</div>;
  }

  return (
    <div className="bi-container">
      {/* Platform Overview */}
      <div className="bi-metrics-grid admin-metrics-grid">
        <div className="bi-metric-card">
          <span className="bi-metric-icon">
            <Wallet size={18} />
          </span>
          <div>
            <small>Platform Gross GMV</small>
            <strong>₹{data.platformOverview.grossMerchandiseValue.toLocaleString("en-IN")}</strong>
            <span className="bi-subtext">₹{data.platformOverview.verifiedNetRevenue.toLocaleString("en-IN")} verified net</span>
          </div>
        </div>

        <div className="bi-metric-card">
          <span className="bi-metric-icon">
            <CheckCircle2 size={18} />
          </span>
          <div>
            <small>Fulfillment Rate</small>
            <strong>{data.platformOverview.orderFulfillmentRate}%</strong>
            <span className="bi-subtext">{data.platformOverview.totalOrdersCount} platform shipments</span>
          </div>
        </div>

        <div className="bi-metric-card">
          <span className="bi-metric-icon">
            <Users size={18} />
          </span>
          <div>
            <small>Verified Network</small>
            <strong>{data.platformOverview.verifiedSellerCount} Sellers</strong>
            <span className="bi-subtext">{data.platformOverview.activeCustomerCount} registered customers</span>
          </div>
        </div>

        <div className="bi-metric-card">
          <span className="bi-metric-icon">
            <Package size={18} />
          </span>
          <div>
            <small>Platform Basket AOV</small>
            <strong>₹{data.platformOverview.averagePlatformBasketValue.toLocaleString("en-IN")}</strong>
            <span className="bi-subtext">Multi-item basket average</span>
          </div>
        </div>
      </div>

      {/* Strategic Platform Insights */}
      <div className="bi-panel-box insights-box admin-insights">
        <div className="bi-panel-head">
          <div className="title-with-badge">
            <span className="bi-ai-pill admin-pill">
              <Sparkles size={13} /> Platform Executive Intelligence
            </span>
            <h4>Macro Health, Rural Penetration & Quality Index</h4>
          </div>
        </div>
        <div className="bi-insights-list">
          {data.strategicInsights.map((insight, idx) => (
            <div className="insight-row" key={idx}>
              <span className="bullet">✦</span>
              <p>{insight}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bi-two-col">
        {/* Category Share */}
        <div className="bi-panel-box">
          <div className="bi-panel-head">
            <div>
              <span className="portal-kicker">CATEGORY DYNAMICS</span>
              <h4>GMV Share by Agricultural Category</h4>
            </div>
          </div>
          <div className="category-share-list">
            {data.categoryBreakdown.map((cat) => (
              <div className="category-share-row" key={cat.category}>
                <div className="cat-share-info">
                  <b>{cat.category}</b>
                  <span>
                    ₹{cat.revenue.toLocaleString("en-IN")} · {cat.percentageOfSales}% of GMV
                  </span>
                </div>
                <div className="cat-share-bar-track">
                  <div
                    className="cat-share-bar-fill"
                    style={{ width: `${Math.min(100, Math.max(5, cat.percentageOfSales))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Rural Ecosystem Telemetry */}
        <div className="bi-panel-box">
          <div className="bi-panel-head">
            <div>
              <span className="portal-kicker">RURAL AI IMPACT</span>
              <h4>Agricultural Telemetry & Field Adherence</h4>
            </div>
          </div>
          <div className="ai-telemetry-grid">
            <div className="telemetry-card">
              <small>Leaf Scans Diagnosed</small>
              <strong>{data.aiEcosystemMetrics.cropScansConducted} Scans</strong>
              <span>Top: {data.aiEcosystemMetrics.topCropScanned}</span>
            </div>
            <div className="telemetry-card">
              <small>Livestock Registered</small>
              <strong>{data.aiEcosystemMetrics.registeredLivestockHeadCount} Head</strong>
              <span>Indigenous Gau & Murrah</span>
            </div>
            <div className="telemetry-card highlight">
              <small>Immunization Compliance</small>
              <strong>{data.aiEcosystemMetrics.dewormingAdherenceRatePct}%</strong>
              <span>NADCP protocol adherence</span>
            </div>
          </div>
        </div>
      </div>

      {/* RFM Customer Segmentation */}
      <div className="bi-panel-box">
        <div className="bi-panel-head">
          <div>
            <span className="portal-kicker">BEHAVIORAL DATA SCIENCE</span>
            <h4>RFM Customer Cohorts & Retention Strategy</h4>
          </div>
        </div>
        <div className="rfm-cohort-grid">
          {data.customerSegmentation.map((cohort) => (
            <div className={`cohort-card cohort-${cohort.segment}`} key={cohort.segment}>
              <div className="cohort-head">
                <b>{cohort.label}</b>
                <span className="cohort-share">{cohort.percentageOfCustomerBase}% of users</span>
              </div>
              <div className="cohort-metrics">
                <div>
                  <small>Cohort Size</small>
                  <strong>{cohort.userCount} customers</strong>
                </div>
                <div>
                  <small>Avg Historical Spend</small>
                  <strong>₹{cohort.averageSpend.toLocaleString("en-IN")}</strong>
                </div>
              </div>
              <div className="cohort-action">
                <small>Recommended Strategic Intervention:</small>
                <p>{cohort.recommendedAction}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { describe, expect, it } from "vitest";
import {
  getAdminBusinessIntelligence,
  getSellerBusinessIntelligence,
} from "./businessIntelligence";

describe("Phase 7: AI Business Intelligence – Seller Insights", () => {
  it("generates grounded seller analytics, performance metrics, and low-stock alerts", async () => {
    const bi = await getSellerBusinessIntelligence(1);

    expect(bi.summary).toBeDefined();
    expect(bi.summary.totalRevenue).toBeGreaterThanOrEqual(0);
    expect(bi.summary.averageOrderValue).toBeGreaterThanOrEqual(0);
    expect(bi.productPerformance).toBeInstanceOf(Array);

    if (bi.productPerformance.length > 0) {
      const topProd = bi.productPerformance[0];
      expect(topProd.productId).toBeDefined();
      expect(topProd.name).toBeDefined();
      expect(topProd.stockStatus).toMatch(/healthy|low_stock|stockout|overstocked/);
      expect(topProd.dailyVelocity).toBeGreaterThanOrEqual(0);
    }

    // Verify statistical demand forecast integrity
    expect(bi.demandForecasting.length).toBeGreaterThan(0);
    for (const forecast of bi.demandForecasting) {
      expect(forecast.metric).toBeDefined();
      expect(forecast.projected14Days).toBeGreaterThanOrEqual(0);
      expect(forecast.projected30Days).toBeGreaterThanOrEqual(forecast.projected14Days);
      expect(forecast.confidenceScore).toBeGreaterThan(0);
      expect(forecast.confidenceScore).toBeLessThanOrEqual(100);
      expect(forecast.methodology).toBeDefined();
      expect(forecast.limitations).toBeDefined();
      expect(forecast.limitations.length).toBeGreaterThan(15);
    }

    expect(bi.aiBusinessInsights.length).toBeGreaterThan(0);
  });
});

describe("Phase 7: AI Business Intelligence – Admin Control Center", () => {
  it("generates platform-wide revenue analytics, category share, RFM customer segmentation, and AI telemetry", async () => {
    const bi = await getAdminBusinessIntelligence();

    expect(bi.platformOverview).toBeDefined();
    expect(bi.platformOverview.grossMerchandiseValue).toBeGreaterThanOrEqual(0);
    expect(bi.platformOverview.orderFulfillmentRate).toBeGreaterThanOrEqual(0);
    expect(bi.platformOverview.orderFulfillmentRate).toBeLessThanOrEqual(100);

    // Verify category breakdown
    expect(bi.categoryBreakdown).toBeInstanceOf(Array);
    if (bi.categoryBreakdown.length > 0) {
      expect(bi.categoryBreakdown.some((c) => c.category === "Kitchen")).toBe(true);
      const totalPct = bi.categoryBreakdown.reduce((sum, c) => sum + c.percentageOfSales, 0);
      expect(totalPct).toBeGreaterThan(95); // Roughly 100% with rounding
    }

    // Verify RFM Customer Segmentation
    expect(bi.customerSegmentation.length).toBeGreaterThanOrEqual(3);
    const segments = bi.customerSegmentation.map((s) => s.segment);
    expect(segments).toContain("champions");
    expect(segments).toContain("loyal_advocates");
    expect(segments).toContain("promising_new");

    for (const seg of bi.customerSegmentation) {
      expect(seg.recommendedAction).toBeDefined();
      expect(seg.averageSpend).toBeGreaterThan(0);
    }

    // Verify AI ecosystem telemetry
    expect(bi.aiEcosystemMetrics).toBeDefined();
    expect(bi.aiEcosystemMetrics.cropScansConducted).toBeGreaterThanOrEqual(0);
    expect(bi.aiEcosystemMetrics.registeredLivestockHeadCount).toBeGreaterThanOrEqual(0);

    // Verify platform forecast
    expect(bi.platformForecast.length).toBeGreaterThan(0);
    expect(bi.platformForecast[0].limitations).toBeDefined();
  });
});

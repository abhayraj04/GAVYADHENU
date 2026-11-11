import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import {
  CROP_DISEASE_KNOWLEDGE_BASE,
  diagnoseCropDisease,
  getUserCropScans,
  recordCropScan,
} from "./cropDoctor";
import type { TrpcContext } from "./_core/context";

function createContext(userId = 1): TrpcContext {
  return {
    user: {
      id: userId,
      openId: `farmer-${userId}`,
      email: "farmer@example.com",
      name: "Krishi Mitra",
      loginMethod: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("AI Crop Doctor Module (Phase 5)", () => {
  it("provides comprehensive verified plant pathology for major crops", () => {
    expect(Object.keys(CROP_DISEASE_KNOWLEDGE_BASE)).toContain("Tomato");
    expect(Object.keys(CROP_DISEASE_KNOWLEDGE_BASE)).toContain("Rice");
    expect(Object.keys(CROP_DISEASE_KNOWLEDGE_BASE)).toContain("Wheat");
    expect(CROP_DISEASE_KNOWLEDGE_BASE.Tomato.length).toBeGreaterThan(0);
  });

  it("diagnoses crop leaf symptoms and provides verified organic and chemical treatments", async () => {
    const diagnosis = await diagnoseCropDisease("Tomato", "data:image/jpeg;base64,test", "target spots concentric rings");

    expect(diagnosis.disease).toContain("Early Blight");
    expect(diagnosis.confidence).toBeGreaterThan(70);
    expect(diagnosis.organicTreatment).toContain("Neem oil");
    expect(diagnosis.chemicalTreatment).toBeDefined();
    expect(diagnosis.severity).toBe("moderate");
  });

  it("records and persists crop scans with agronomist guidance", async () => {
    const caller = appRouter.createCaller(createContext(42));
    const scan = await caller.cropDoctor.scan({
      cropType: "Rice",
      imageUrl: "https://example.com/rice-blast.jpg",
      notes: "spindle shaped lesions with white center",
    });

    expect(scan).toBeDefined();
    expect(scan.cropType).toBe("Rice");
    expect(scan.disease).toBeDefined();
    expect(Number(scan.confidence)).toBeGreaterThan(70);

    const history = await caller.cropDoctor.history();
    expect(Array.isArray(history)).toBe(true);
    expect(history.length).toBeGreaterThan(0);
  });

  it("supports deleting scan records cleanly", async () => {
    const caller = appRouter.createCaller(createContext(42));
    const result = await caller.cropDoctor.deleteScan({ scanId: 101 });
    expect(result).toBe(true);
  });
});

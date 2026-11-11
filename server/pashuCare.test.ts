import { describe, expect, it } from "vitest";
import {
  calculateFeedPlan,
  triageLivestockSymptoms,
  STANDARD_IMMUNIZATION_PROTOCOL,
  LIVESTOCK_BREEDS_CATALOG,
  getLivestockRecords,
  createLivestockRecord,
  updateLivestockRecord,
  deleteLivestockRecord,
  createHealthLog,
  getHealthLogsForAnimal,
  getUpcomingPreventiveAlerts,
} from "./pashuCare";

describe("AI Pashu Care – Scientific Nutrition Calculator", () => {
  it("computes balanced ration for a peak lactation Gir cow", () => {
    const plan = calculateFeedPlan({
      animalType: "cow",
      breed: "Gir",
      bodyWeightKg: 420,
      lactationStage: "peak",
      dailyMilkYieldLiters: 16,
      isPregnant: false,
    });

    expect(plan.estimatedBodyWeightKg).toBe(420);
    expect(plan.totalDryMatterKg).toBeGreaterThan(10);
    expect(plan.concentrateMixKg).toBeGreaterThanOrEqual(7.5); // 1.4kg maintenance + (16 * 0.40 = 6.4kg) = ~7.8kg
    expect(plan.greenFodderKg).toBeGreaterThan(15);
    expect(plan.dryRoughageKg).toBeGreaterThanOrEqual(2);
    expect(plan.mineralMixtureGrams).toBe(55);
    expect(plan.cleanWaterLiters).toBeGreaterThanOrEqual(80);
    expect(plan.rationSchedule.morning).toBeDefined();
    expect(plan.rationSchedule.evening).toBeDefined();
    expect(plan.nutritionalTips.length).toBeGreaterThan(2);
  });

  it("calculates high butterfat nutrition for Murrah buffalo", () => {
    const plan = calculateFeedPlan({
      animalType: "buffalo",
      breed: "Murrah",
      bodyWeightKg: 550,
      lactationStage: "mid",
      dailyMilkYieldLiters: 18,
    });

    expect(plan.concentrateMixKg).toBeGreaterThanOrEqual(10.5); // 1.8kg maintenance + (18 * 0.50 = 9.0kg) = 10.8kg
    expect(plan.mineralMixtureGrams).toBe(70);
    expect(plan.cleanWaterLiters).toBeGreaterThanOrEqual(100);
    expect(plan.nutritionalTips.some((t) => t.toLowerCase().includes("buffalo"))).toBe(true);
  });

  it("calculates small-ruminant ration for Jamnapari goat", () => {
    const plan = calculateFeedPlan({
      animalType: "goat",
      breed: "Jamnapari",
      bodyWeightKg: 45,
      lactationStage: "early_lactation",
      dailyMilkYieldLiters: 2.5,
    });

    expect(plan.totalDryMatterKg).toBeLessThan(3);
    expect(plan.concentrateMixKg).toBeLessThan(1.5);
    expect(plan.cleanWaterLiters).toBeLessThan(20);
  });
});

describe("AI Pashu Care – Symptom Checker & Vet Triage", () => {
  it("triages bloat/tympany as critical with life-saving first-aid and disclaimer", () => {
    const assessment = triageLivestockSymptoms({
      animalType: "cow",
      symptoms: ["severe swollen left flank", "kicking belly", "gas in stomach"],
      bodyTemperatureC: 38.6,
    });

    expect(assessment.urgencyLevel).toBe("critical");
    expect(assessment.matchedCondition).toContain("Bloat");
    expect(assessment.professionalCareRequired).toBe(true);
    expect(assessment.emergencyHelpline).toContain("1962");
    expect(assessment.strictlyAvoid.some((a) => a.toLowerCase().includes("drench"))).toBe(true);
    expect(assessment.veterinaryDisclaimer).toContain("CRITICAL VETERINARY SAFETY NOTICE");
  });

  it("identifies bovine mastitis signs with sterile teat hygiene guidance", () => {
    const assessment = triageLivestockSymptoms({
      animalType: "cow",
      symptoms: ["swollen udder", "clots in milk", "hot teat"],
    });

    expect(assessment.urgencyLevel).toBe("high");
    expect(assessment.matchedCondition).toContain("Mastitis");
    expect(assessment.immediateFirstAid.some((f) => f.includes("California Mastitis Test"))).toBe(true);
  });

  it("handles general non-specific malaise safely without false prescription", () => {
    const assessment = triageLivestockSymptoms({
      animalType: "cow",
      symptoms: ["sluggish movement", "dull appetite"],
      bodyTemperatureC: 38.8,
    });

    expect(assessment.urgencyLevel).toBe("moderate");
    expect(assessment.immediateFirstAid.length).toBeGreaterThan(0);
    expect(assessment.strictlyAvoid.some((s) => s.includes("paracetamol"))).toBe(true);
  });
});

describe("AI Pashu Care – Immunization & Breeds Knowledge Base", () => {
  it("provides comprehensive breed profiles across cows, buffaloes, and goats", () => {
    expect(LIVESTOCK_BREEDS_CATALOG.length).toBeGreaterThanOrEqual(8);
    const breeds = LIVESTOCK_BREEDS_CATALOG.map((b) => b.breed);
    expect(breeds).toContain("Gir");
    expect(breeds).toContain("Murrah");
    expect(breeds).toContain("Jamnapari");
  });

  it("includes NADCP compliant vaccination protocols", () => {
    expect(STANDARD_IMMUNIZATION_PROTOCOL.length).toBeGreaterThanOrEqual(6);
    const targets = STANDARD_IMMUNIZATION_PROTOCOL.map((p) => p.name);
    expect(targets.some((t) => t.includes("FMD"))).toBe(true);
    expect(targets.some((t) => t.includes("HS"))).toBe(true);
    expect(targets.some((t) => t.includes("Deworming"))).toBe(true);
  });
});

describe("AI Pashu Care – Animal Records & Health Logging", () => {
  const testOwnerId = 999;
  let createdAnimalId: number;

  it("creates, retrieves, and updates an animal record", async () => {
    const created = await createLivestockRecord(testOwnerId, {
      tagId: "TEST-COW-999",
      animalType: "cow",
      breed: "Gir",
      name: "Surabhi",
      ageMonths: 36,
      gender: "female",
      lactationStage: "peak",
      dailyMilkYieldLiters: "15.00",
      healthStatus: "healthy",
    });

    expect(created.id).toBeDefined();
    expect(created.tagId).toBe("TEST-COW-999");
    createdAnimalId = created.id;

    const list = await getLivestockRecords(testOwnerId);
    expect(list.some((r) => r.id === createdAnimalId)).toBe(true);

    const updated = await updateLivestockRecord(testOwnerId, createdAnimalId, {
      dailyMilkYieldLiters: "16.50",
      healthStatus: "healthy",
    });
    expect(updated?.dailyMilkYieldLiters).toBe("16.50");
  });

  it("logs a vaccination event and computes upcoming alerts", async () => {
    const futureDate = new Date(Date.now() + 86400000 * 20); // due in 20 days
    const log = await createHealthLog(testOwnerId, createdAnimalId, {
      logType: "vaccination",
      title: "HS Annual Pre-Monsoon Booster",
      description: "Administered smoothly subcutaneously.",
      nextDueDate: futureDate,
    });

    expect(log.id).toBeDefined();
    expect(log.title).toBe("HS Annual Pre-Monsoon Booster");

    const logs = await getHealthLogsForAnimal(createdAnimalId);
    expect(logs.some((l) => l.title === "HS Annual Pre-Monsoon Booster")).toBe(true);

    const alerts = await getUpcomingPreventiveAlerts(testOwnerId);
    expect(alerts.some((a) => a.animalId === createdAnimalId)).toBe(true);
  });

  it("deletes the created animal record cleanly", async () => {
    const deleted = await deleteLivestockRecord(testOwnerId, createdAnimalId);
    expect(deleted).toBe(true);

    const list = await getLivestockRecords(testOwnerId);
    expect(list.some((r) => r.id === createdAnimalId)).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { diagnoseCropDisease, CROP_DISEASE_KNOWLEDGE_BASE } from "./cropDoctor";
import { triageLivestockSymptoms } from "./pashuCare";

describe("Phase 8: Multilingual AI Expansion – Crop Pathology & Pashu Care", () => {
  it("provides localized Hindi pathology diagnosis and organic remedies", async () => {
    const hindiDiagnosis = await diagnoseCropDisease("Tomato", "", "early blight", "hi");

    expect(hindiDiagnosis.disease).toContain("टमाटर का अगेती झुलसा");
    expect(hindiDiagnosis.organicTreatment).toContain("नीम का तेल");
    expect(hindiDiagnosis.chemicalTreatment).toContain("मैंकोज़ेब");
    expect(hindiDiagnosis.preventiveMeasures).toContain("ड्रिप सिंचाई");
  });

  it("provides English fallback when language is en", async () => {
    const englishDiagnosis = await diagnoseCropDisease("Tomato", "", "early blight", "en");

    expect(englishDiagnosis.disease).toContain("Early Blight");
    expect(englishDiagnosis.organicTreatment).toContain("Neem oil");
    expect(englishDiagnosis.chemicalTreatment).toContain("Mancozeb");
  });

  it("generates Hindi audio narration text for livestock veterinary triage", () => {
    const assessment = triageLivestockSymptoms({
      animalType: "cow",
      symptoms: ["swollen left flank gas in stomach bloat"],
      language: "hi",
    });

    expect(assessment.matchedCondition).toContain("Bloat");
    expect(assessment.audioNarrationText).toBeDefined();
    expect(assessment.audioNarrationText).toContain("पशु में");
    expect(assessment.audioNarrationText).toContain("प्राथमिक उपचार");
    expect(assessment.audioNarrationText).toContain("1962");
  });

  it("generates English audio narration text when language is en", () => {
    const assessment = triageLivestockSymptoms({
      animalType: "cow",
      symptoms: ["swollen left flank gas in stomach bloat"],
      language: "en",
    });

    expect(assessment.audioNarrationText).toContain("Assessment indicates potential");
    expect(assessment.audioNarrationText).toContain("Immediate first aid");
    expect(assessment.audioNarrationText).toContain("1962");
  });

  it("verifies Hindi field coverage across key crop pathology profiles", () => {
    for (const crop of ["Tomato", "Potato", "Rice", "Wheat"]) {
      const profiles = CROP_DISEASE_KNOWLEDGE_BASE[crop];
      expect(profiles).toBeDefined();
      expect(profiles.length).toBeGreaterThan(0);
      const first = profiles[0];
      expect(first.diseaseHindi).toBeDefined();
      expect(first.organicTreatmentHindi).toBeDefined();
      expect(first.chemicalTreatmentHindi).toBeDefined();
    }
  });
});

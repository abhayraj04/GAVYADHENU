import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import {
  Activity,
  AlertTriangle,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Heart,
  HelpCircle,
  Info,
  PhoneCall,
  Plus,
  ShieldAlert,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";

export function PashuCareModule() {
  const { language, t, speakText, stopAudio, isSpeaking } = useLanguage();
  const [activeTab, setActiveTab] = useState<"records" | "calculator" | "symptoms" | "protocol" | "alerts">("calculator");

  // Router hooks
  const breedsQuery = trpc.pashuCare.breeds.useQuery();
  const protocolQuery = trpc.pashuCare.vaccinationProtocol.useQuery();
  const recordsQuery = trpc.pashuCare.records.useQuery();
  const alertsQuery = trpc.pashuCare.alerts.useQuery();

  // Mutations
  const addRecordMutation = trpc.pashuCare.addRecord.useMutation({
    onSuccess: () => {
      toast.success("Livestock record registered successfully.");
      recordsQuery.refetch();
      setShowAddModal(false);
      resetNewAnimalForm();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteRecordMutation = trpc.pashuCare.deleteRecord.useMutation({
    onSuccess: () => {
      toast.success("Livestock record removed.");
      recordsQuery.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const addHealthLogMutation = trpc.pashuCare.addHealthLog.useMutation({
    onSuccess: () => {
      toast.success("Health event recorded successfully.");
      alertsQuery.refetch();
      setShowLogModal(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const feedPlanMutation = trpc.pashuCare.feedPlan.useMutation({
    onError: (err) => toast.error(err.message),
  });

  const symptomCheckMutation = trpc.pashuCare.symptomCheck.useMutation({
    onError: (err) => toast.error(err.message),
  });

  // Local state for modals & forms
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedAnimalForLog, setSelectedAnimalForLog] = useState<{ id: number; name: string; tagId: string } | null>(null);

  // New Animal Form
  const [newAnimal, setNewAnimal] = useState({
    tagId: "",
    animalType: "cow",
    breed: "Gir",
    name: "",
    ageMonths: 36,
    gender: "female" as "female" | "male",
    lactationStage: "peak",
    dailyMilkYieldLiters: "14.0",
    healthStatus: "healthy" as const,
  });

  const resetNewAnimalForm = () => {
    setNewAnimal({
      tagId: "",
      animalType: "cow",
      breed: "Gir",
      name: "",
      ageMonths: 36,
      gender: "female",
      lactationStage: "peak",
      dailyMilkYieldLiters: "14.0",
      healthStatus: "healthy",
    });
  };

  // Health Log Form
  const [logForm, setLogForm] = useState({
    logType: "vaccination" as "vaccination" | "deworming" | "symptom_check" | "treatment" | "feed_update",
    title: "",
    description: "",
    medication: "",
    nextDueDate: "",
  });

  // Nutrition Calculator State
  const [feedInput, setFeedInput] = useState<{
    animalType: "cow" | "buffalo" | "goat";
    breed: string;
    bodyWeightKg: number;
    lactationStage: "dry" | "early_lactation" | "peak" | "mid" | "late" | "pregnant_dry";
    dailyMilkYieldLiters: number;
    isPregnant: boolean;
  }>({
    animalType: "cow",
    breed: "Gir",
    bodyWeightKg: 420,
    lactationStage: "peak",
    dailyMilkYieldLiters: 15,
    isPregnant: false,
  });

  // Symptom Checker State
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [bodyTemp, setBodyTemp] = useState<number | undefined>(undefined);
  const [symptomNotes, setSymptomNotes] = useState("");

  const COMMON_SYMPTOM_OPTIONS = [
    { label: "Swollen Left Flank (Bloat / Afara)", value: "swollen left flank gas in stomach bloat" },
    { label: "Swollen Hot Udder / Clots in Milk (Mastitis)", value: "swollen udder hot teat clots in milk mastitis" },
    { label: "Cannot Stand / S-Shaped Neck Curve (Milk Fever)", value: "cannot stand s-shape neck downer cow milk fever" },
    { label: "Mouth Blisters & Foot Sores with Drooling (FMD)", value: "mouth blisters foot sores drooling saliva fmd" },
    { label: "Skin Nodules / Lumps on Body (LSD)", value: "skin nodules lumpy skin bumps" },
    { label: "Sweet Acetone Breath & Feed Refusal (Ketosis)", value: "sweet breath acetone smell ketosis" },
    { label: "High Fever & Ticks / Red-Brown Urine", value: "ticks high fever with ticks red water coffee colored urine" },
    { label: "Dull Appetite & Sluggish Movement", value: "sluggish movement dull appetite" },
  ];

  const toggleSymptom = (val: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );
  };

  const handleCalculateFeed = () => {
    feedPlanMutation.mutate(feedInput);
  };

  const handleRunSymptomCheck = () => {
    if (selectedSymptoms.length === 0 && !symptomNotes) {
      toast.warning("Please select at least one observed symptom or enter clinical notes.");
      return;
    }
    symptomCheckMutation.mutate({
      animalType: feedInput.animalType,
      symptoms: selectedSymptoms,
      bodyTemperatureC: bodyTemp,
      notes: symptomNotes,
      language,
    });
  };

  return (
    <div className="pashu-care-container">
      {/* Header Banner */}
      <div className="pashu-header">
        <div className="pashu-header-content">
          <span className="pashu-badge">
            <Sparkles size={14} /> AI PASHU CARE · INTELLIGENT LIVESTOCK SYSTEM
          </span>
          <h2>Intelligent Dairy Husbandry, Scientific Nutrition & Vet Triage</h2>
          <p>
            Designed for Indian dairy farmers and indigenous cattle rearers. Powered by ICAR/NDRI nutritional norms,
            pathology first-aid protocols, and NADCP immunization standards.
          </p>
        </div>
        <div className="pashu-emergency-pill">
          <PhoneCall size={18} />
          <div>
            <small>24x7 Emergency Animal Helpline</small>
            <strong>Call 1962 (Toll Free)</strong>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="pashu-tabs">
        <button
          className={`pashu-tab-btn ${activeTab === "calculator" ? "active" : ""}`}
          onClick={() => setActiveTab("calculator")}
        >
          <Activity size={16} /> Feed & Nutrition Calculator
        </button>
        <button
          className={`pashu-tab-btn ${activeTab === "symptoms" ? "active" : ""}`}
          onClick={() => setActiveTab("symptoms")}
        >
          <AlertTriangle size={16} /> AI Symptom Triage & First-Aid
        </button>
        <button
          className={`pashu-tab-btn ${activeTab === "records" ? "active" : ""}`}
          onClick={() => setActiveTab("records")}
        >
          <Heart size={16} /> My Herd Records ({recordsQuery.data?.length ?? 0})
        </button>
        <button
          className={`pashu-tab-btn ${activeTab === "alerts" ? "active" : ""}`}
          onClick={() => setActiveTab("alerts")}
        >
          <Clock size={16} /> Preventive Health Alerts ({alertsQuery.data?.length ?? 0})
        </button>
        <button
          className={`pashu-tab-btn ${activeTab === "protocol" ? "active" : ""}`}
          onClick={() => setActiveTab("protocol")}
        >
          <Calendar size={16} /> National Immunization Protocol
        </button>
      </div>

      {/* TAB 1: SCIENTIFIC FEED CALCULATOR */}
      {activeTab === "calculator" && (
        <div className="pashu-card">
          <div className="pashu-card-header">
            <div>
              <span className="portal-kicker">SCIENTIFIC NUTRITION ENGINE</span>
              <h3>ICAR / NDRI Balanced Daily Ration Formulator</h3>
            </div>
            <span className="pashu-tag-soft">Zero-Waste Nutrition</span>
          </div>

          <div className="pashu-calc-grid">
            <div className="pashu-form-col">
              <div className="form-group">
                <label>Animal Species</label>
                <div className="pashu-pill-selector">
                  {(["cow", "buffalo", "goat"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`pill-choice ${feedInput.animalType === type ? "selected" : ""}`}
                      onClick={() =>
                        setFeedInput({
                          ...feedInput,
                          animalType: type,
                          bodyWeightKg: type === "buffalo" ? 520 : type === "goat" ? 48 : 420,
                        })
                      }
                    >
                      {type === "cow" ? "Indigenous Cow (Gau Mata)" : type === "buffalo" ? "Dairy Buffalo (Bhains)" : "Goat (Bakri)"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-two">
                <label>
                  Breed
                  <select
                    value={feedInput.breed}
                    onChange={(e) => setFeedInput({ ...feedInput, breed: e.target.value })}
                  >
                    {breedsQuery.data
                      ?.filter((b) => b.species === feedInput.animalType)
                      .map((b) => (
                        <option key={b.breed} value={b.breed}>
                          {b.breed} ({b.origin.split(",")[0]})
                        </option>
                      ))}
                  </select>
                </label>

                <label>
                  Body Weight (kg)
                  <input
                    type="number"
                    min="30"
                    max="1000"
                    value={feedInput.bodyWeightKg}
                    onChange={(e) => setFeedInput({ ...feedInput, bodyWeightKg: Number(e.target.value) })}
                  />
                </label>
              </div>

              <div className="form-two">
                <label>
                  Lactation Stage
                  <select
                    value={feedInput.lactationStage}
                    onChange={(e) =>
                      setFeedInput({
                        ...feedInput,
                        lactationStage: e.target.value as typeof feedInput.lactationStage,
                      })
                    }
                  >
                    <option value="early_lactation">Early Lactation (1 - 90 Days)</option>
                    <option value="peak">Peak Lactation (High Yield)</option>
                    <option value="mid">Mid Lactation (90 - 200 Days)</option>
                    <option value="late">Late Lactation (200 - 305 Days)</option>
                    <option value="dry">Dry Non-Lactating</option>
                    <option value="pregnant_dry">Pregnant Dry Cow (Last 60 Days)</option>
                  </select>
                </label>

                <label>
                  Daily Milk Yield (Liters/day)
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="60"
                    value={feedInput.dailyMilkYieldLiters}
                    onChange={(e) => setFeedInput({ ...feedInput, dailyMilkYieldLiters: Number(e.target.value) })}
                  />
                </label>
              </div>

              <label className="checkbox-label" style={{ marginTop: "0.5rem" }}>
                <input
                  type="checkbox"
                  checked={feedInput.isPregnant}
                  onChange={(e) => setFeedInput({ ...feedInput, isPregnant: e.target.checked })}
                />
                Animal is in late pregnancy (Last trimester allowance)
              </label>

              <button
                className="portal-primary"
                style={{ marginTop: "1.2rem", width: "100%" }}
                onClick={handleCalculateFeed}
                disabled={feedPlanMutation.isPending}
              >
                {feedPlanMutation.isPending ? "Calculating Optimal Ratio…" : "Formulate Balanced Ration"} <ChevronRight size={16} />
              </button>
            </div>

            {/* Results display */}
            <div className="pashu-calc-results">
              {feedPlanMutation.data ? (
                <div className="feed-results-card">
                  <h4>Daily Balanced Ration Breakdown</h4>
                  <div className="ration-metrics">
                    <div className="ration-metric-box">
                      <small>Dry Matter (DM)</small>
                      <strong>{feedPlanMutation.data.totalDryMatterKg} kg</strong>
                      <span>Total base intake</span>
                    </div>
                    <div className="ration-metric-box highlight">
                      <small>Green Fodder</small>
                      <strong>{feedPlanMutation.data.greenFodderKg} kg</strong>
                      <span>Napier / Berseem / Maize</span>
                    </div>
                    <div className="ration-metric-box">
                      <small>Dry Straw (Bhusa)</small>
                      <strong>{feedPlanMutation.data.dryRoughageKg} kg</strong>
                      <span>Wheat / Paddy straw</span>
                    </div>
                    <div className="ration-metric-box highlight-amber">
                      <small>Concentrate Mix</small>
                      <strong>{feedPlanMutation.data.concentrateMixKg} kg</strong>
                      <span>Cake + grain + bran</span>
                    </div>
                    <div className="ration-metric-box">
                      <small>Mineral Mix</small>
                      <strong>{feedPlanMutation.data.mineralMixtureGrams} g</strong>
                      <span>Chelated trace minerals</span>
                    </div>
                    <div className="ration-metric-box">
                      <small>Clean Water</small>
                      <strong>{feedPlanMutation.data.cleanWaterLiters} L</strong>
                      <span>24/7 ad libitum</span>
                    </div>
                  </div>

                  <div className="ration-schedule-box">
                    <h5>Recommended Daily Feeding Schedule:</h5>
                    <div className="schedule-row">
                      <b>Morning Milking:</b>
                      <span>{feedPlanMutation.data.rationSchedule.morning}</span>
                    </div>
                    <div className="schedule-row">
                      <b>Afternoon Resting:</b>
                      <span>{feedPlanMutation.data.rationSchedule.afternoon}</span>
                    </div>
                    <div className="schedule-row">
                      <b>Evening Milking:</b>
                      <span>{feedPlanMutation.data.rationSchedule.evening}</span>
                    </div>
                  </div>

                  {/* Dairy Feed Economics & Farm Margin Box */}
                  {(() => {
                    const dryCost = feedPlanMutation.data.dryRoughageKg * 7;
                    const greenCost = feedPlanMutation.data.greenFodderKg * 2.5;
                    const concCost = feedPlanMutation.data.concentrateMixKg * 28;
                    const minCost = (feedPlanMutation.data.mineralMixtureGrams / 1000) * 90;
                    const totalDailyFeedCost = dryCost + greenCost + concCost + minCost;
                    const milkYield = feedInput.dailyMilkYieldLiters || 1;
                    const costPerLiter = (totalDailyFeedCost / milkYield).toFixed(2);
                    const avgA2MilkPrice = feedInput.animalType === "buffalo" ? 75 : feedInput.animalType === "goat" ? 110 : 70;
                    const dailyGrossRev = milkYield * avgA2MilkPrice;
                    const dailyNetProfit = dailyGrossRev - totalDailyFeedCost;

                    return (
                      <div className="mt-4 p-4 rounded-xl border border-emerald-700/30 bg-emerald-950/20">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <h5 className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 m-0">
                            <Sparkles size={14} className="text-amber-500" />
                            Daily Ration Economics & Farmer Profitability
                          </h5>
                          <span className="text-[10px] text-muted-foreground">Standard Regional Benchmarks</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                          <div className="p-2.5 rounded-lg bg-background/70 border border-emerald-800/20">
                            <span className="text-[10px] text-muted-foreground block">Total Feed Cost</span>
                            <strong className="text-sm font-bold text-foreground block">₹{totalDailyFeedCost.toFixed(0)} / day</strong>
                            <span className="text-[10px] text-muted-foreground">Bhusa + Green + Feed</span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-background/70 border border-emerald-800/20">
                            <span className="text-[10px] text-muted-foreground block">Feed Cost / Liter</span>
                            <strong className="text-sm font-bold text-amber-600 dark:text-amber-400 block">₹{costPerLiter} / L</strong>
                            <span className="text-[10px] text-muted-foreground">Efficiency index</span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-background/70 border border-emerald-800/20">
                            <span className="text-[10px] text-muted-foreground block">Gross Milk Revenue</span>
                            <strong className="text-sm font-bold text-emerald-600 dark:text-emerald-400 block">₹{dailyGrossRev.toFixed(0)} / day</strong>
                            <span className="text-[10px] text-muted-foreground">@ ₹{avgA2MilkPrice}/L raw</span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-background/70 border border-emerald-800/20">
                            <span className="text-[10px] text-muted-foreground block">Net Daily Margin</span>
                            <strong className={`text-sm font-bold block ${dailyNetProfit > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                              ₹{dailyNetProfit.toFixed(0)} / cow
                            </strong>
                            <span className="text-[10px] text-muted-foreground">Net operating margin</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="ration-tips-box">
                    <h5>Nutritional Guidelines:</h5>
                    <ul>
                      {feedPlanMutation.data.nutritionalTips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="pashu-empty-calc">
                  <Activity size={36} />
                  <h4>Enter herd parameters and calculate</h4>
                  <p>
                    Get precise, scientifically calculated dry matter, green fodder, dry roughage, and concentrate
                    ratios to maximize milk yield while eliminating subacute ruminal acidosis.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI SYMPTOM CHECKER & VET TRIAGE */}
      {activeTab === "symptoms" && (
        <div className="pashu-card">
          <div className="pashu-card-header">
            <div>
              <span className="portal-kicker">FIRST-AID & VETERINARY TRIAGE</span>
              <h3>Livestock Clinical Symptom Analyzer</h3>
            </div>
            <span className="pashu-alert-chip">
              <ShieldAlert size={14} /> Safety Guarded
            </span>
          </div>

          <div className="pashu-triage-disclaimer">
            <Info size={18} />
            <p>
              <strong>Veterinary Disclaimer:</strong> This AI tool assists with emergency first-aid and scientific triage.
              It <em>never</em> prescribes restricted prescription drugs. Always contact your local government Veterinary
              Assistant Surgeon (VAS) for medical procedures.
            </p>
          </div>

          <div className="pashu-symptom-selector">
            <label>Select Observed Clinical Signs:</label>
            <div className="symptom-tag-grid">
              {COMMON_SYMPTOM_OPTIONS.map((opt) => {
                const isSelected = selectedSymptoms.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={`symptom-tag ${isSelected ? "selected" : ""}`}
                    onClick={() => toggleSymptom(opt.value)}
                  >
                    {isSelected && <Check size={14} />} {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-two" style={{ marginTop: "1rem" }}>
            <label>
              Rectal Body Temperature (°C) [Normal: 38.0°C - 39.2°C]
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 39.0"
                value={bodyTemp ?? ""}
                onChange={(e) => setBodyTemp(e.target.value ? Number(e.target.value) : undefined)}
              />
            </label>
            <label>
              Additional Behavioral / Clinical Notes
              <input
                type="text"
                placeholder="e.g. Started suddenly after grazing on lush clover this morning"
                value={symptomNotes}
                onChange={(e) => setSymptomNotes(e.target.value)}
              />
            </label>
          </div>

          <button
            className="portal-primary"
            style={{ marginTop: "1rem" }}
            onClick={handleRunSymptomCheck}
            disabled={symptomCheckMutation.isPending}
          >
            {symptomCheckMutation.isPending ? "Analyzing Pathology Matrix…" : "Run Veterinary Symptom Triage"} <ChevronRight size={16} />
          </button>

          {/* Triage Assessment Results */}
          {symptomCheckMutation.data && (
            <div className={`pashu-assessment-card urgency-${symptomCheckMutation.data.urgencyLevel}`}>
              <div className="assessment-head">
                <div>
                  <span className={`urgency-badge ${symptomCheckMutation.data.urgencyLevel}`}>
                    {symptomCheckMutation.data.urgencyLevel.toUpperCase()} PRIORITY
                  </span>
                  <h4>{symptomCheckMutation.data.matchedCondition}</h4>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button
                    type="button"
                    className="portal-outline compact"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                    onClick={() => {
                      if (isSpeaking) {
                        stopAudio();
                      } else {
                        const narration =
                          symptomCheckMutation.data.audioNarrationText ||
                          symptomCheckMutation.data.immediateFirstAid.join(". ");
                        speakText(narration, language);
                      }
                    }}
                  >
                    {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    {isSpeaking
                      ? language === "hi"
                        ? "रोकें (Stop)"
                        : "Stop"
                      : language === "hi"
                      ? "प्राथमिक उपचार सुनें"
                      : "Listen to First-Aid"}
                  </button>
                  {symptomCheckMutation.data.professionalCareRequired && (
                    <a href="tel:1962" className="emergency-call-btn">
                      <PhoneCall size={15} /> Call 1962 Helpline
                    </a>
                  )}
                </div>
              </div>

              <div className="assessment-body">
                <p><strong>Clinical Signs & Pathology:</strong> {symptomCheckMutation.data.clinicalObservations}</p>

                <div className="first-aid-box">
                  <h5>Immediate First-Aid Measures:</h5>
                  <ul>
                    {symptomCheckMutation.data.immediateFirstAid.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>

                <div className="strictly-avoid-box">
                  <h5>Strictly Avoid (High Danger):</h5>
                  <ul>
                    {symptomCheckMutation.data.strictlyAvoid.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="legal-disclaimer-box">
                  <small>{symptomCheckMutation.data.veterinaryDisclaimer}</small>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MY HERD RECORDS */}
      {activeTab === "records" && (
        <div className="pashu-card">
          <div className="pashu-card-header">
            <div>
              <span className="portal-kicker">HERD MANAGEMENT</span>
              <h3>Registered Dairy Livestock ({recordsQuery.data?.length ?? 0})</h3>
            </div>
            <button className="portal-primary compact" onClick={() => setShowAddModal(true)}>
              <Plus size={15} /> Register Animal
            </button>
          </div>

          {recordsQuery.isLoading ? (
            <div className="portal-empty">Loading herd records…</div>
          ) : recordsQuery.data && recordsQuery.data.length > 0 ? (
            <div className="livestock-card-grid">
              {recordsQuery.data.map((animal) => (
                <div className="animal-card" key={animal.id}>
                  <div className="animal-card-top">
                    <div>
                      <span className="tag-badge">#{animal.tagId}</span>
                      <h4>{animal.name || "Unnamed Animal"}</h4>
                      <small>{animal.breed ?? "Indigenous"} ({animal.animalType})</small>
                    </div>
                    <span className={`health-status ${animal.healthStatus}`}>
                      {animal.healthStatus.replace("_", " ")}
                    </span>
                  </div>

                  <div className="animal-specs">
                    <div>
                      <small>Age</small>
                      <b>{animal.ageMonths ? `${Math.floor(animal.ageMonths / 12)}y ${animal.ageMonths % 12}m` : "N/A"}</b>
                    </div>
                    <div>
                      <small>Stage</small>
                      <b>{animal.lactationStage?.replace("_", " ") ?? "Dry"}</b>
                    </div>
                    <div>
                      <small>Daily Milk</small>
                      <b>{animal.dailyMilkYieldLiters} L</b>
                    </div>
                  </div>

                  <div className="animal-card-actions">
                    <button
                      className="portal-outline compact"
                      onClick={() => {
                        setSelectedAnimalForLog({ id: animal.id, name: animal.name || animal.tagId, tagId: animal.tagId });
                        setShowLogModal(true);
                      }}
                    >
                      <Plus size={14} /> Log Health Event
                    </button>
                    <button
                      className="portal-danger compact"
                      onClick={() => {
                        if (window.confirm(`Delete record for ${animal.name || animal.tagId}?`)) {
                          deleteRecordMutation.mutate({ id: animal.id });
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="portal-empty">
              <Heart size={32} />
              <h4>No livestock registered yet</h4>
              <p>Add your cows, buffaloes, or goats to monitor lactation cycles, vaccination dates, and nutritional health.</p>
              <button className="portal-primary compact" onClick={() => setShowAddModal(true)}>
                <Plus size={15} /> Add First Animal
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PREVENTIVE HEALTH ALERTS */}
      {activeTab === "alerts" && (
        <div className="pashu-card">
          <div className="pashu-card-header">
            <div>
              <span className="portal-kicker">VACCINATION & DEWORMING TIMELINE</span>
              <h3>Upcoming Animal Health Reminders</h3>
            </div>
            <span className="pashu-tag-soft">Auto-Scheduled</span>
          </div>

          {alertsQuery.isLoading ? (
            <div className="portal-empty">Checking immunization schedules…</div>
          ) : alertsQuery.data && alertsQuery.data.length > 0 ? (
            <div className="pashu-alerts-list">
              {alertsQuery.data.map((alert, idx) => (
                <div className="alert-item-card" key={idx}>
                  <div className="alert-item-icon">
                    <Calendar size={18} />
                  </div>
                  <div className="alert-item-content">
                    <b>{alert.title}</b>
                    <span>Animal: <strong>{alert.animalName}</strong> (#{alert.tagId})</span>
                    <small>Scheduled Due Date: {new Date(alert.dueDate).toLocaleDateString()}</small>
                  </div>
                  <div className="alert-item-status">
                    {alert.daysRemaining <= 0 ? (
                      <span className="due-pill overdue">Overdue by {Math.abs(alert.daysRemaining)} days</span>
                    ) : (
                      <span className="due-pill pending">Due in {alert.daysRemaining} days</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="portal-empty">
              <Check size={32} />
              <h4>No pending health alerts</h4>
              <p>All your animals have up-to-date vaccinations and deworming treatments.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: NATIONAL IMMUNIZATION PROTOCOL */}
      {activeTab === "protocol" && (
        <div className="pashu-card">
          <div className="pashu-card-header">
            <div>
              <span className="portal-kicker">GOVERNMENT OF INDIA (DAHD / NADCP)</span>
              <h3>Standard Indian Livestock Vaccination & Deworming Protocol</h3>
            </div>
          </div>

          <div className="protocol-grid">
            {protocolQuery.data?.map((item) => (
              <div className="protocol-card" key={item.id}>
                <div className="protocol-card-head">
                  <span className="protocol-name">{item.name}</span>
                  <span className="protocol-season">{item.recommendedSeason}</span>
                </div>
                <div className="protocol-card-body">
                  <p><strong>Target Disease:</strong> {item.diseaseTarget}</p>
                  <p><strong>Target Age:</strong> {item.targetAge}</p>
                  <p><strong>Frequency:</strong> {item.repeatFrequency}</p>
                  <small><strong>Precautions:</strong> {item.precautions}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: REGISTER LIVESTOCK */}
      {showAddModal && (
        <div className="pashu-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="pashu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Register New Animal</h4>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addRecordMutation.mutate({
                  ...newAnimal,
                  ageMonths: Number(newAnimal.ageMonths),
                });
              }}
            >
              <div className="form-two">
                <label>
                  Ear Tag ID *
                  <input
                    required
                    placeholder="e.g. GD-GIR-004"
                    value={newAnimal.tagId}
                    onChange={(e) => setNewAnimal({ ...newAnimal, tagId: e.target.value })}
                  />
                </label>
                <label>
                  Name / Nickname
                  <input
                    placeholder="e.g. Gauri"
                    value={newAnimal.name}
                    onChange={(e) => setNewAnimal({ ...newAnimal, name: e.target.value })}
                  />
                </label>
              </div>

              <div className="form-three">
                <label>
                  Species
                  <select
                    value={newAnimal.animalType}
                    onChange={(e) => setNewAnimal({ ...newAnimal, animalType: e.target.value })}
                  >
                    <option value="cow">Cow</option>
                    <option value="buffalo">Buffalo</option>
                    <option value="goat">Goat</option>
                  </select>
                </label>
                <label>
                  Breed
                  <input
                    placeholder="e.g. Gir / Murrah"
                    value={newAnimal.breed}
                    onChange={(e) => setNewAnimal({ ...newAnimal, breed: e.target.value })}
                  />
                </label>
                <label>
                  Age (Months)
                  <input
                    type="number"
                    min="1"
                    value={newAnimal.ageMonths}
                    onChange={(e) => setNewAnimal({ ...newAnimal, ageMonths: Number(e.target.value) })}
                  />
                </label>
              </div>

              <div className="form-two">
                <label>
                  Lactation Stage
                  <select
                    value={newAnimal.lactationStage}
                    onChange={(e) => setNewAnimal({ ...newAnimal, lactationStage: e.target.value })}
                  >
                    <option value="early_lactation">Early Lactation</option>
                    <option value="peak">Peak Lactation</option>
                    <option value="mid">Mid Lactation</option>
                    <option value="late">Late Lactation</option>
                    <option value="dry">Dry</option>
                    <option value="pregnant_dry">Pregnant Dry</option>
                  </select>
                </label>
                <label>
                  Daily Milk Yield (Liters)
                  <input
                    step="0.1"
                    value={newAnimal.dailyMilkYieldLiters}
                    onChange={(e) => setNewAnimal({ ...newAnimal, dailyMilkYieldLiters: e.target.value })}
                  />
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="portal-outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="portal-primary" disabled={addRecordMutation.isPending}>
                  {addRecordMutation.isPending ? "Saving…" : "Register Animal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG HEALTH EVENT */}
      {showLogModal && selectedAnimalForLog && (
        <div className="pashu-modal-backdrop" onClick={() => setShowLogModal(false)}>
          <div className="pashu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Log Health Event for {selectedAnimalForLog.name}</h4>
              <button className="close-btn" onClick={() => setShowLogModal(false)}>✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addHealthLogMutation.mutate({
                  animalId: selectedAnimalForLog.id,
                  logType: logForm.logType,
                  title: logForm.title,
                  description: logForm.description || undefined,
                  medication: logForm.medication || undefined,
                  nextDueDate: logForm.nextDueDate ? new Date(logForm.nextDueDate) : null,
                });
              }}
            >
              <div className="form-two">
                <label>
                  Event Type
                  <select
                    value={logForm.logType}
                    onChange={(e) =>
                      setLogForm({
                        ...logForm,
                        logType: e.target.value as typeof logForm.logType,
                      })
                    }
                  >
                    <option value="vaccination">Vaccination</option>
                    <option value="deworming">Deworming</option>
                    <option value="symptom_check">Symptom Check</option>
                    <option value="treatment">Treatment / Checkup</option>
                    <option value="feed_update">Feed Adjustment</option>
                  </select>
                </label>
                <label>
                  Event Title *
                  <input
                    required
                    placeholder="e.g. FMD Biannual Booster"
                    value={logForm.title}
                    onChange={(e) => setLogForm({ ...logForm, title: e.target.value })}
                  />
                </label>
              </div>

              <label>
                Description / Clinical Notes
                <textarea
                  rows={2}
                  placeholder="e.g. Administered smoothly with no adverse swelling or fever."
                  value={logForm.description}
                  onChange={(e) => setLogForm({ ...logForm, description: e.target.value })}
                />
              </label>

              <div className="form-two">
                <label>
                  Medication / Vaccine Name
                  <input
                    placeholder="e.g. Raksha-Ovac FMD Vaccine"
                    value={logForm.medication}
                    onChange={(e) => setLogForm({ ...logForm, medication: e.target.value })}
                  />
                </label>
                <label>
                  Next Due Date (For Reminders)
                  <input
                    type="date"
                    value={logForm.nextDueDate}
                    onChange={(e) => setLogForm({ ...logForm, nextDueDate: e.target.value })}
                  />
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="portal-outline" onClick={() => setShowLogModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="portal-primary" disabled={addHealthLogMutation.isPending}>
                  {addHealthLogMutation.isPending ? "Logging…" : "Record Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

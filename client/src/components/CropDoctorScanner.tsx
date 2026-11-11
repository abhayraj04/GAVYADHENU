import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  CheckCircle2,
  FileText,
  History,
  Leaf,
  Loader2,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";

const SAMPLE_LEAF_IMAGES = [
  {
    name: "Tomato - Early Blight",
    crop: "Tomato",
    url: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80",
    note: "Yellowing lower leaf with dark concentric target lesions.",
  },
  {
    name: "Potato - Late Blight",
    crop: "Potato",
    url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
    note: "Dark water-soaked lesions spreading across leaf margins.",
  },
  {
    name: "Wheat - Yellow Rust",
    crop: "Wheat",
    url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
    note: "Parallel yellow powdery pustules across leaf blade.",
  },
  {
    name: "Healthy Tomato Leaf",
    crop: "Tomato",
    url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80",
    note: "Vibrant green foliage with no fungal or necrotic spots.",
  },
];

const COMMON_SYMPTOM_TAGS = [
  "Concentric target rings",
  "Yellow chlorotic halo",
  "White powdery mildew spores",
  "Water-soaked dark lesions",
  "Leaf curling / mosaic",
  "Parallel orange rust pustules",
  "Bacterial oozing / blight",
];

export function CropDoctorScanner() {
  const { language, t, speakText, stopAudio, isSpeaking } = useLanguage();
  const [activeTab, setActiveTab] = useState<"scan" | "history">("scan");
  const [cropType, setCropType] = useState("Tomato");
  const [imageUrl, setImageUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [tankVolume, setTankVolume] = useState<number>(15);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<any | null>(null);

  const toggleSymptom = (tag: string) => {
    setSelectedSymptoms((prev) => {
      const next = prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag];
      setNotes(next.join(", "));
      return next;
    });
  };

  const supportedCropsQuery = trpc.cropDoctor.supportedCrops.useQuery();
  const historyQuery = trpc.cropDoctor.history.useQuery(undefined, {
    enabled: activeTab === "history",
  });

  const scanMutation = trpc.cropDoctor.scan.useMutation({
    onSuccess: (result) => {
      setCurrentDiagnosis(result);
      toast.success("Crop foliage analyzed successfully!");
      if (activeTab === "history") historyQuery.refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to analyze leaf image.");
    },
  });

  const deleteMutation = trpc.cropDoctor.deleteScan.useMutation({
    onSuccess: () => {
      toast.success("Scan removed from history.");
      historyQuery.refetch();
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image file size should be under 8MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImageUrl(base64);
      toast.info("Leaf photo uploaded. Ready to scan.");
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    if (!imageUrl) {
      toast.error("Please upload or select a leaf photograph first.");
      return;
    }

    scanMutation.mutate({
      cropType,
      imageUrl,
      notes: notes.trim() || undefined,
      language,
    });
  };

  const supportedCrops = supportedCropsQuery.data ?? [
    "Tomato",
    "Potato",
    "Rice",
    "Wheat",
    "Cotton",
    "Mustard",
    "Chilli",
  ];

  return (
    <div className="crop-doctor-container">
      {/* Top Banner Header */}
      <div className="crop-doctor-head">
        <div>
          <span className="store-kicker">COMPUTER VISION PLANT PATHOLOGY</span>
          <h2>AI Crop Doctor</h2>
          <p>
            Upload a high-resolution photograph of an affected crop leaf to detect fungal, bacterial, or viral pathogens with
            verified bio-treatment pathways.
          </p>
        </div>

        <div className="crop-doctor-tabs">
          <button
            className={`crop-tab ${activeTab === "scan" ? "active" : ""}`}
            onClick={() => setActiveTab("scan")}
          >
            <Camera size={14} /> New Diagnosis
          </button>
          <button
            className={`crop-tab ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <History size={14} /> Scan History
          </button>
        </div>
      </div>

      {activeTab === "scan" ? (
        <div className="crop-scan-layout">
          {/* Controls Column */}
          <div className="crop-input-panel">
            <div className="form-group">
              <label>Select Crop Species</label>
              <select
                className="crop-select"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
              >
                {supportedCrops.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            {/* Photo Upload Dropzone */}
            <div className="form-group">
              <label>Upload Leaf Photograph</label>
              <div className="crop-dropzone">
                <input
                  type="file"
                  id="leaf-upload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden-file-input"
                />
                <label htmlFor="leaf-upload" className="dropzone-label">
                  <Upload size={24} className="text-[#3b6645]" />
                  <span>
                    <b>Click to upload</b> or drag photo here
                  </span>
                  <small>Clear close-up of leaf lesions in good daylight</small>
                </label>
              </div>
            </div>

            {/* Instant Sample Photos for Testing */}
            <div className="form-group">
              <label>Or Try a Test Leaf Sample</label>
              <div className="sample-leaves-grid">
                {SAMPLE_LEAF_IMAGES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`sample-thumb-btn ${imageUrl === sample.url ? "selected" : ""}`}
                    onClick={() => {
                      setImageUrl(sample.url);
                      setCropType(sample.crop);
                      setNotes(sample.note);
                      toast.info(`Selected ${sample.name}`);
                    }}
                  >
                    <img src={sample.url} alt={sample.name} />
                    <span>{sample.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Symptom Tag Selector */}
            <div className="form-group">
              <label>Select Key Visible Symptoms</label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {COMMON_SYMPTOM_TAGS.map((tag) => {
                  const isSelected = selectedSymptoms.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleSymptom(tag)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition ${
                        isSelected
                          ? "bg-emerald-800 text-white border-emerald-600 font-medium"
                          : "bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-800/30 hover:bg-emerald-900/30"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Observation Notes */}
            <div className="form-group">
              <label>Field Observations (Optional)</label>
              <input
                className="crop-input-text"
                placeholder="e.g. Yellow rings noticed after 3 days of rainfall"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button
              className="store-primary full"
              disabled={scanMutation.isPending || !imageUrl}
              onClick={handleAnalyze}
            >
              {scanMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Analyzing Leaf Pigmentation…
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Run AI Crop Diagnosis
                </>
              )}
            </button>
          </div>

          {/* Results Preview Column */}
          <div className="crop-results-panel">
            {imageUrl ? (
              <div className="leaf-preview-box">
                <img src={imageUrl} alt="Leaf Preview" className="leaf-preview-img" />
                <span className="leaf-preview-tag">{cropType} Foliage</span>
              </div>
            ) : (
              <div className="leaf-preview-empty">
                <Leaf size={48} />
                <h4>No Leaf Photo Loaded</h4>
                <p>Upload a photo or choose a sample on the left to start the computer vision diagnostic process.</p>
              </div>
            )}

            {currentDiagnosis && (
              <div className="diagnosis-card">
                <div className="diagnosis-header">
                  <div>
                    <span className="store-kicker">PATHOLOGY REPORT</span>
                    <h3>{currentDiagnosis.disease}</h3>
                    <button
                      type="button"
                      className="portal-outline compact"
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8 }}
                      onClick={() => {
                        if (isSpeaking) {
                          stopAudio();
                        } else {
                          const speech = `${currentDiagnosis.disease}. ${language === "hi" ? "जैविक उपचार" : "Organic treatment"}: ${currentDiagnosis.organicTreatment}. ${language === "hi" ? "रासायनिक उपचार" : "Chemical treatment"}: ${currentDiagnosis.chemicalTreatment}`;
                          speakText(speech, language);
                        }
                      }}
                    >
                      {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      {isSpeaking
                        ? language === "hi"
                          ? "रोकें (Stop)"
                          : "Stop Audio"
                        : language === "hi"
                        ? "उपचार निर्देश सुनें"
                        : "Listen to Treatment Instructions"}
                    </button>
                  </div>
                  <span
                    className={`severity-badge ${
                      currentDiagnosis.severity === "healthy"
                        ? "badge-healthy"
                        : currentDiagnosis.severity === "severe"
                        ? "badge-severe"
                        : "badge-moderate"
                    }`}
                  >
                    {currentDiagnosis.severity.toUpperCase()}
                  </span>
                </div>

                {/* Confidence Bar */}
                <div className="confidence-meter-row">
                  <div className="confidence-label">
                    <span>AI Model Confidence:</span>
                    <strong>{Number(currentDiagnosis.confidence).toFixed(1)}%</strong>
                  </div>
                  <div className="confidence-track">
                    <div
                      className="confidence-fill"
                      style={{ width: `${Math.min(100, Number(currentDiagnosis.confidence))}%` }}
                    />
                  </div>
                </div>

                {/* Symptoms */}
                <div className="diagnosis-section">
                  <h5>
                    <AlertTriangle size={14} className="text-[#c07436]" /> Observed Symptoms
                  </h5>
                  <p>{currentDiagnosis.symptoms}</p>
                </div>

                {/* Organic Treatment */}
                <div className="diagnosis-section">
                  <h5>
                    <Leaf size={14} className="text-[#3b6645]" /> Verified Organic Treatment
                  </h5>
                  <p>{currentDiagnosis.organicTreatment}</p>
                </div>

                {/* Standard Chemical Treatment */}
                <div className="diagnosis-section">
                  <h5>
                    <ShieldCheck size={14} className="text-[#41698e]" /> Standard Chemical Treatment
                  </h5>
                  <p>{currentDiagnosis.chemicalTreatment}</p>
                </div>

                {/* Prevention Protocol */}
                <div className="diagnosis-section">
                  <h5>
                    <CheckCircle2 size={14} className="text-[#2b5938]" /> Preventive Cultural Practices
                  </h5>
                  <p>{currentDiagnosis.preventiveMeasures}</p>
                </div>

                {/* Interactive Spray Formulation & Tank Calculator */}
                <div className="mt-4 p-3.5 rounded-xl border border-emerald-700/30 bg-emerald-950/20">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-amber-500" />
                      Organic Spray Tank Dosage Calculator
                    </span>
                    <div className="flex items-center gap-1 text-xs">
                      <label className="text-muted-foreground text-[11px]">Tank Size:</label>
                      <select
                        className="text-xs rounded border border-emerald-800/40 bg-background px-2 py-0.5 text-foreground"
                        value={tankVolume}
                        onChange={(e) => setTankVolume(Number(e.target.value))}
                      >
                        <option value={5}>5 Liters (Hand Sprayer)</option>
                        <option value={15}>15 Liters (Backpack Sprayer)</option>
                        <option value={50}>50 Liters (Mini Tanker)</option>
                        <option value={100}>100 Liters (Tractor Drum)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                    <div className="p-2 rounded-lg bg-background/60 border border-emerald-800/20">
                      <span className="text-[10px] text-muted-foreground block">Pure Neem Oil</span>
                      <strong className="text-emerald-700 dark:text-emerald-300 text-sm font-semibold block">
                        {tankVolume * 5} ml
                      </strong>
                      <small className="text-[10px] text-muted-foreground">+ {tankVolume * 2}ml liquid soap</small>
                    </div>

                    <div className="p-2 rounded-lg bg-background/60 border border-emerald-800/20">
                      <span className="text-[10px] text-muted-foreground block">Sour Buttermilk (Chaas)</span>
                      <strong className="text-emerald-700 dark:text-emerald-300 text-sm font-semibold block">
                        {tankVolume * 50 >= 1000 ? `${(tankVolume * 50) / 1000} L` : `${tankVolume * 50} ml`}
                      </strong>
                      <small className="text-[10px] text-muted-foreground">Fermented in copper pot</small>
                    </div>

                    <div className="p-2 rounded-lg bg-background/60 border border-emerald-800/20">
                      <span className="text-[10px] text-muted-foreground block">Trichoderma Viride</span>
                      <strong className="text-emerald-700 dark:text-emerald-300 text-sm font-semibold block">
                        {(tankVolume * 2.5).toFixed(1)} g
                      </strong>
                      <small className="text-[10px] text-muted-foreground">Bio-fungicide strain</small>
                    </div>

                    <div className="p-2 rounded-lg bg-background/60 border border-emerald-800/20">
                      <span className="text-[10px] text-muted-foreground block">Foliar Jeevamrit</span>
                      <strong className="text-emerald-700 dark:text-emerald-300 text-sm font-semibold block">
                        {tankVolume * 100 >= 1000 ? `${(tankVolume * 100) / 1000} L` : `${tankVolume * 100} ml`}
                      </strong>
                      <small className="text-[10px] text-muted-foreground">Foliar micronutrients</small>
                    </div>
                  </div>
                </div>

                {/* Print & Action Bar */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    className="portal-outline compact"
                    onClick={() => {
                      toast.success("Prescription report generated. Ready to print or save as PDF.");
                      window.print();
                    }}
                  >
                    <FileText size={14} /> Print / Save Diagnostic Prescription
                  </button>
                </div>

                {/* Scientific Disclaimer */}
                <div className="scientific-disclaimer">
                  <ShieldAlert size={16} />
                  <div>
                    <b>Agronomic Advisory Notice</b>
                    <p>
                      This AI computer vision scan provides preliminary agronomic screening. For epidemic outbreaks or
                      commercial acreage, verify samples with your district Krishi Vigyan Kendra (KVK) or certified
                      agronomist.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* History Tab */
        <div className="crop-history-wrap">
          {historyQuery.isLoading ? (
            <div className="portal-loading">
              <RefreshCw size={22} className="animate-spin" /> Loading previous scan logs…
            </div>
          ) : !historyQuery.data || historyQuery.data.length === 0 ? (
            <div className="portal-empty">
              <Leaf size={32} />
              <h3>No Previous Scans</h3>
              <p>Your previous crop health diagnostics will be recorded here for seasonal tracking.</p>
            </div>
          ) : (
            <div className="history-scan-grid">
              {historyQuery.data.map((scan) => (
                <div key={scan.id} className="history-scan-card">
                  <div className="history-card-thumb">
                    <img src={scan.imageUrl} alt={scan.cropType} />
                    <span className="history-crop-badge">{scan.cropType}</span>
                  </div>
                  <div className="history-card-body">
                    <div className="history-date">
                      {new Date(scan.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <h4>{scan.disease}</h4>
                    <span
                      className={`severity-badge compact ${
                        scan.severity === "healthy"
                          ? "badge-healthy"
                          : scan.severity === "severe"
                          ? "badge-severe"
                          : "badge-moderate"
                      }`}
                    >
                      {scan.severity} · {Number(scan.confidence).toFixed(0)}%
                    </span>
                    <p className="history-notes">{scan.organicTreatment}</p>
                    <div className="history-card-actions">
                      <button
                        className="portal-danger compact"
                        onClick={() => deleteMutation.mutate({ scanId: scan.id })}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

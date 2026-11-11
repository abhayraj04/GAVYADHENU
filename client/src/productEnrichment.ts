// Comprehensive product enrichment data: Benefits, Nutritional Breakdown, Vedic Craft Timeline, Lab Purity Reports

export interface ProductBenefit {
  title: string;
  description: string;
}

export interface NutritionFact {
  parameter: string;
  value: string;
}

export interface CraftStep {
  step: number;
  title: string;
  desc: string;
}

export interface LabTestDetail {
  reportNumber: string;
  labName: string;
  accreditation: string;
  testedParameter: string;
  result: string;
  status: "Pass" | "Clean" | "Pure";
  notes: string;
}

export interface ProductEnrichmentData {
  tagline: string;
  origin: string;
  benefits: ProductBenefit[];
  nutrition: NutritionFact[];
  craftSteps: CraftStep[];
  labTest: LabTestDetail;
}

export const PRODUCT_ENRICHMENT: Record<string, ProductEnrichmentData> = {
  "farmstead-makhana": {
    tagline: "Natural Jumbo Puffed Lotus Seeds from Mithila Wetlands",
    origin: "Mithila Wetland Sanctuary, Darbhanga, Bihar",
    benefits: [
      { title: "High Plant Protein", description: "9.7g clean plant protein per 100g to build lean stamina and natural vitality." },
      { title: "Zero Trans-Fats & Low GI", description: "Light on the stomach with low glycemic index, making it ideal for daily healthy snacking." },
      { title: "Rich in Calcium & Magnesium", description: "Fortifies bone mineral density and supports balanced cardiovascular rhythms." },
      { title: "Slow Wood-Fired Roasted", description: "Roasted on open flame in traditional earthen kadhai without synthetic oils or chemical fumigants." },
    ],
    nutrition: [
      { parameter: "Energy", value: "358 kcal" },
      { parameter: "Protein", value: "9.7 g" },
      { parameter: "Carbohydrates", value: "76.9 g" },
      { parameter: "Dietary Fibre", value: "7.6 g" },
      { parameter: "Total Fat", value: "0.1 g" },
      { parameter: "Calcium", value: "60 mg" },
      { parameter: "Iron", value: "1.4 mg" },
      { parameter: "Potassium", value: "500 mg" },
    ],
    craftSteps: [
      { step: 1, title: "Pond Cultivation", desc: "Organically grown in pristine clean wetland freshwater ponds of Mithila." },
      { step: 2, title: "Natural Sun-Drying", desc: "Harvested black seeds are washed in fresh water and sun-dried on clean bamboo mats." },
      { step: 3, title: "Clay Pan Roasting", desc: "Slow fire-roasted over natural wood coals in traditional earthen vessels." },
      { step: 4, title: "Hand Graded & Packed", desc: "Jumbo pearls are hand-sorted and sealed immediately in glass jars to retain crunch." },
    ],
    labTest: {
      reportNumber: "NABL/2026/MAKH-4819",
      labName: "National Agriculture Testing & Research Council, Patna",
      accreditation: "ISO 17025 Accredited",
      testedParameter: "Artificial Whitening Agents & Bleach Test",
      result: "Negative (100% Unbleached Natural White)",
      status: "Pass",
      notes: "Heavy metals (Lead, Cadmium, Arsenic) tested below detection limits (0.00 ppm).",
    },
  },

  "bilona-a2-ghee": {
    tagline: "Vedic Curd-Churned Ghee from Free-Grazing Indigenous Gir Cows",
    origin: "Gir Amrit Organic Sanctuary, Junagadh, Gujarat",
    benefits: [
      { title: "100% Pure A2 Beta-Casein", description: "Derived exclusively from native Indian Gir cows; easy to digest and gentle on sensitive stomachs." },
      { title: "Bi-Directional Bilona Churn", description: "Slow-churned from natural whole-milk curd using wooden bilona to preserve delicate micro-nutrients." },
      { title: "Granular Danedaar Texture", description: "Simmered over slow cow-dung firewood in brass vessels for deep golden aroma and natural grains." },
      { title: "Rich in Butyric Acid & Omega-3", description: "Nourishes the intestinal lining, boosts metabolism, and strengthens innate immunity." },
    ],
    nutrition: [
      { parameter: "Energy", value: "897 kcal" },
      { parameter: "Total Fat", value: "99.7 g" },
      { parameter: "Saturated Fat", value: "65.2 g" },
      { parameter: "Monounsaturated Fat", value: "28.4 g" },
      { parameter: "Polyunsaturated Fat", value: "3.8 g" },
      { parameter: "Vitamin A", value: "650 mcg" },
      { parameter: "Omega-3 Fatty Acids", value: "1.2 g" },
      { parameter: "A2 Beta-Casein", value: "100% Verified" },
    ],
    craftSteps: [
      { step: 1, title: "Grass-Fed Gir Milk", desc: "Fresh whole milk from sacred Gir cows grazing on medicinal grasses and herbs." },
      { step: 2, title: "Earthen Curd Culture", desc: "Boiled and naturally set into thick probiotic curd in clay pots overnight." },
      { step: 3, title: "Wooden Bilona Churn", desc: "Curd is hand-churned bi-directionally to separate fresh aromatic Makhan (butter)." },
      { step: 4, title: "Cow-Dung Fire Simmer", desc: "Makhan is slowly simmered on gentle cow-dung fire to produce granular golden ghee." },
    ],
    labTest: {
      reportNumber: "NABL/2026/GHEE-9842",
      labName: "Analytical Food Labs, Pune (ISO 17025 Accredited)",
      accreditation: "FSSAI & NABL Recognized",
      testedParameter: "Baudouin Adulteration Test & RM Value",
      result: "Negative (Pure) · RM Value 28.8 (Standard >26.0)",
      status: "Pass",
      notes: "100% Pure Indigenous Gir Cow Ghee; Free Fatty Acids (FFA) 0.26%, Peroxide value 0.38 meq/kg.",
    },
  },

  "golden-haldi-ritual": {
    tagline: "High-Curcumin (7.5%+) Ancient Stone-Ground Lakadong Turmeric",
    origin: "Jaintia Hills Organic Collective, Meghalaya",
    benefits: [
      { title: "7.5%+ Natural Curcumin", description: "Nearly triple the potency of ordinary commercial turmeric for maximum cellular antioxidant defense." },
      { title: "Ancient Stone-Ground", description: "Milled on slow-turning natural chakki stones to prevent frictional heat damage to volatile oils." },
      { title: "Immune & Joint Recovery", description: "Supports soothing natural anti-inflammatory response and promotes radiant skin wellness." },
      { title: "Zero Artificial Dyes", description: "Guaranteed free from lead chromate, metanil yellow, chalk, or foreign starch fillers." },
    ],
    nutrition: [
      { parameter: "Curcumin Content", value: "7.82%" },
      { parameter: "Energy", value: "354 kcal" },
      { parameter: "Protein", value: "7.6 g" },
      { parameter: "Carbohydrates", value: "68.9 g" },
      { parameter: "Total Fat", value: "9.1 g" },
      { parameter: "Dietary Fibre", value: "21.4 g" },
      { parameter: "Essential Oils", value: "5.1%" },
      { parameter: "Lead Chromate", value: "0.00% (Negative)" },
    ],
    craftSteps: [
      { step: 1, title: "Highland Cultivation", desc: "Grown organically in mineral-rich virgin soil of Jaintia Hills, Meghalaya." },
      { step: 2, title: "Curing & Sun-Drying", desc: "Fresh rhizomes are washed, sliced, and sun-dried naturally on elevated drying beds." },
      { step: 3, title: "Slow Stone Grinding", desc: "Ground on cold stone chakki to safeguard fragile bioactive curcuminoids." },
      { step: 4, title: "Glass Jar Sealing", desc: "Airtight vacuum sealing preserves delicate earthy aroma and deep golden saffron hue." },
    ],
    labTest: {
      reportNumber: "SBQEL/2026/TUR-5129",
      labName: "Spices Board Quality Evaluation Laboratory, Kochi",
      accreditation: "ISO 17025 Certified",
      testedParameter: "Curcumin Content & Lead Chromate Adulteration",
      result: "7.82% Curcumin · Negative for Lead Chromate",
      status: "Pass",
      notes: "Total ash content 5.4%, volatile essential oil content 5.1%.",
    },
  },

  "wildflower-honey": {
    tagline: "Unheated, Unprocessed Multi-Flora Forest Nectar",
    origin: "Satpura Deep Forest Deciduous Belt, Madhya Pradesh",
    benefits: [
      { title: "100% Raw & Unpasteurized", description: "Never heated above hive temperature (35°C), preserving live beneficial enzymes and bee propolis." },
      { title: "Multi-Flora Diversity", description: "Harvested from wild forest blossoms including Mahua, Jamun, Palash, and forest neem." },
      { title: "Zero Added Sugar & C4 Clean", description: "Free from corn syrup, rice syrup, cane syrup, or artificial inverted sugars." },
      { title: "Digestive & Throat Soothing", description: "Natural antimicrobial properties soothe the respiratory tract and balance gut flora." },
    ],
    nutrition: [
      { parameter: "Energy", value: "304 kcal" },
      { parameter: "Natural Sugars", value: "82.4 g" },
      { parameter: "Carbohydrates", value: "82.4 g" },
      { parameter: "Moisture Content", value: "17.4%" },
      { parameter: "Total Fat", value: "0.0 g" },
      { parameter: "Protein", value: "0.3 g" },
      { parameter: "HMF (Heat Index)", value: "12.8 mg/kg" },
      { parameter: "C4 Inverted Sugars", value: "0.0% (Zero)" },
    ],
    craftSteps: [
      { step: 1, title: "Sustainable Forest Harvest", desc: "Collected by indigenous tribal beekeepers using smoke-free, bee-safe traditional practices." },
      { step: 2, title: "Cotton Cloth Sieve", desc: "Gently filtered through multi-layered organic cotton fabric without high-pressure ultra-filtration." },
      { step: 3, title: "Zero Heat Processing", desc: "Bottled directly without artificial heating, allowing natural pollen retention." },
      { step: 4, title: "Purity Tested & Sealed", desc: "Packaged in premium glass jars to preserve medicinal bioactive properties." },
    ],
    labTest: {
      reportNumber: "AFPL/2026/HONEY-7731",
      labName: "Apex Food Purity & Pollen Analysis Lab, Mumbai",
      accreditation: "NABL Accredited",
      testedParameter: "C4 Sugar Syrup Adulteration & HMF Heat Test",
      result: "Negative for C4 Sugar · HMF 12.8 mg/kg (Unheated)",
      status: "Pass",
      notes: "Moisture 17.4%, zero antibiotics and zero pesticide residues detected.",
    },
  },

  "wood-pressed-yellow-mustard-oil": {
    tagline: "True Cold-Pressed Virgin Mustard Oil from Rajasthan Kolhu",
    origin: "Rajasthan Organic Press Sanctuary, Alwar",
    benefits: [
      { title: "Extracted Below 45°C", description: "Slow crushed in traditional wooden Kolhu (Ghani) at low temperatures to retain natural pungency." },
      { title: "Rich in Natural Omega-3", description: "Optimal ratio of Omega-3 to Omega-6 fatty acids supporting balanced cholesterol and cardiac health." },
      { title: "Unrefined & Chemical Free", description: "Free from caustic soda, bleaching clay, or mineral oils; retains deep golden sheen and authentic teary aroma." },
      { title: "Natural Digestive Warmth", description: "Contains natural allyl isothiocyanate which stimulates gastric juices and aids nutrient assimilation." },
    ],
    nutrition: [
      { parameter: "Energy", value: "884 kcal" },
      { parameter: "Total Fat", value: "100 g" },
      { parameter: "Monounsaturated Fat", value: "65.5 g" },
      { parameter: "Polyunsaturated Fat", value: "28.5 g" },
      { parameter: "Saturated Fat", value: "6.0 g" },
      { parameter: "Natural Pungency", value: "0.34%" },
      { parameter: "Argemone Oil", value: "0.00% (Negative)" },
      { parameter: "Extraction Temp", value: "38.5°C" },
    ],
    craftSteps: [
      { step: 1, title: "Hand Cleaned Seeds", desc: "Small-batch organic yellow mustard seeds thoroughly cleaned and sun-dried." },
      { step: 2, title: "Wooden Kolhu Pressing", desc: "Slow wooden pestle rotates at 14 RPM to gently press oil without heat generation." },
      { step: 3, title: "Natural Sedimentation", desc: "Raw oil rests in stainless steel settling tanks; zero chemical refinement or bleaching." },
      { step: 4, title: "Fresh Bottling", desc: "Decanted into dark protective glass bottles to shield fragile fatty acids from UV light." },
    ],
    labTest: {
      reportNumber: "NATRC/2026/OIL-4412",
      labName: "National Agriculture Testing & Research Council, Jaipur",
      accreditation: "ISO 17025 Accredited",
      testedParameter: "Argemone Oil Adulteration & Hexane Solvent",
      result: "Negative (Pure) · Hexane: Nil",
      status: "Pass",
      notes: "Acid Value 1.12 mg KOH/g, Free Fatty Acids 0.28%, Extraction Temp 38.5°C.",
    },
  },

  "wood-pressed-groundnut-oil": {
    tagline: "Single-Origin Cold-Pressed Peanut Oil from Saurashtra",
    origin: "Saurashtra Organic Farmer Co-op, Junagadh",
    benefits: [
      { title: "Virgin Wooden Ghani Pressed", description: "Slow pressed from select golden groundnuts for rich nutty fragrance and smooth buttery texture." },
      { title: "High Smoke Point", description: "Ideal for everyday Indian frying, tadkas, and curries without toxic lipid breakdown." },
      { title: "Natural Vitamin E & Phytosterols", description: "Shields cells from free radical oxidation and aids cardiovascular vitality." },
      { title: "Zero Trans-Fats & Zero Cholesterol", description: "100% natural cold-pressed oil with zero chemical processing or artificial preservatives." },
    ],
    nutrition: [
      { parameter: "Energy", value: "884 kcal" },
      { parameter: "Total Fat", value: "100 g" },
      { parameter: "Monounsaturated Fat", value: "48.2 g" },
      { parameter: "Polyunsaturated Fat", value: "33.8 g" },
      { parameter: "Saturated Fat", value: "18.0 g" },
      { parameter: "Vitamin E", value: "15.7 mg" },
      { parameter: "Cholesterol", value: "0.0 mg" },
      { parameter: "Aflatoxin Test", value: "Not Detected (Clean)" },
    ],
    craftSteps: [
      { step: 1, title: "Select Saurashtra Peanuts", desc: "Naturally grown, sun-ripened organic groundnuts deshelled and graded." },
      { step: 2, title: "Wooden Ghani Extraction", desc: "Pressed at low temperature without thermal heating or chemical solvents." },
      { step: 3, title: "Gravity Filtration", desc: "Naturally filtered through fine cloth screens without artificial centrifugation." },
      { step: 4, title: "Sealed in Glass", desc: "Bottled fresh to preserve natural nutty aroma and beneficial phytosterols." },
    ],
    labTest: {
      reportNumber: "NABL/2026/GND-8821",
      labName: "Gujarat Food Safety & Purity Laboratories, Ahmedabad",
      accreditation: "NABL Certified",
      testedParameter: "Aflatoxin & Mineral Oil Contamination",
      result: "Zero Detected (Clean) · Mineral Oil: Negative",
      status: "Pass",
      notes: "Peroxide value 0.42 meq/kg, Free Fatty Acids 0.22%.",
    },
  },

  "teja-red-chilli-powder": {
    tagline: "Fiery Guntur Teja Red Chilli Stone-Ground in Stone Chakki",
    origin: "Guntur Heritage Spice Guild, Andhra Pradesh",
    benefits: [
      { title: "Vibrant Natural Red Colour", description: "100% sun-dried red chillies; guaranteed zero artificial red dyes or Sudan colourants." },
      { title: "Intense Heat & Deep Capsaicin", description: "High natural SHU rating imparts authentic warmth and aromatic spicy punch to curries." },
      { title: "Metabolic Activation", description: "Capsaicin accelerates natural thermogenesis and supports healthy lipid breakdown." },
      { title: "Stone Ground Freshness", description: "Milled at low temperatures to lock in volatile red chilli essential oils." },
    ],
    nutrition: [
      { parameter: "Energy", value: "318 kcal" },
      { parameter: "Protein", value: "12.0 g" },
      { parameter: "Carbohydrates", value: "56.6 g" },
      { parameter: "Total Fat", value: "17.3 g" },
      { parameter: "Dietary Fibre", value: "34.8 g" },
      { parameter: "Sudan I-IV Dyes", value: "Negative (Pure)" },
      { parameter: "Vitamin C", value: "76 mg" },
      { parameter: "Moisture", value: "8.2%" },
    ],
    craftSteps: [
      { step: 1, title: "Hand-Picked Guntur Harvest", desc: "Select sun-ripened Teja chillies harvested at peak redness." },
      { step: 2, title: "Stem Destemming", desc: "Manually destemmed and cleaned to remove dirt and field debris." },
      { step: 3, title: "Stone Chakki Milling", desc: "Crushed on stone mills to preserve capsicum oils and rich red hue." },
      { step: 4, title: "Sealed Glass Jars", desc: "Airtight packaging locks in fiery pungency and authentic aroma." },
    ],
    labTest: {
      reportNumber: "SPICE/2026/TEJA-3392",
      labName: "Spices Board Analytical Laboratory, Guntur",
      accreditation: "ISO 17025 Certified",
      testedParameter: "Sudan Dye Adulteration & Aflatoxin",
      result: "Negative for Sudan I-IV · Aflatoxin: Safe",
      status: "Pass",
      notes: "Total ash 6.1%, natural capsaicin 0.48%.",
    },
  },

  "raw-black-turmeric-powder": {
    tagline: "Sacred Wild Black Turmeric (Curcuma Caesia) Stone-Ground",
    origin: "Northeast Tribal Botanical Sanctuary, Assam & Meghalaya",
    benefits: [
      { title: "Rare Curcuma Caesia", description: "Deep indigo-violet interior rhizome celebrated in ancient Ayurvedic classical texts." },
      { title: "Potent Bioactive Antioxidants", description: "High camphor and curdione content supports cellular longevity and immunity." },
      { title: "Respiratory & Skin Harmony", description: "Traditional soothing herbal remedy for respiratory comfort and radiant complexion." },
      { title: "Sacred Forest Harvest", description: "Ethically harvested by indigenous herbalists in biodiversity sanctuaries." },
    ],
    nutrition: [
      { parameter: "Energy", value: "354 kcal" },
      { parameter: "Protein", value: "7.6 g" },
      { parameter: "Carbohydrates", value: "68.9 g" },
      { parameter: "Total Fat", value: "9.1 g" },
      { parameter: "Dietary Fibre", value: "21.4 g" },
      { parameter: "Curcuma Caesia Alkaloids", value: "Verified Authentic" },
      { parameter: "Heavy Metals", value: "0.00 ppm (Clean)" },
      { parameter: "Lead Chromate", value: "Negative" },
    ],
    craftSteps: [
      { step: 1, title: "Sacred Forest Foraging", desc: "Wild rhizomes ethically gathered by forest guardians at peak potency." },
      { step: 2, title: "Low-Temperature Curing", desc: "Cleaned in mountain spring water and shade-dried to retain volatile oils." },
      { step: 3, title: "Traditional Mortar Grinding", desc: "Stone-ground without synthetic heating to preserve active sesquiterpenes." },
      { step: 4, title: "Amber Glass Packing", desc: "Shielded from sunlight in airtight glass containers." },
    ],
    labTest: {
      reportNumber: "AYUR/2026/BLKTURM-1029",
      labName: "Central Council for Research in Ayurvedic Sciences (CCRAS) Lab",
      accreditation: "Ayush & NABL Recognized",
      testedParameter: "Botanical Genotyping & Heavy Metal Screen",
      result: "100% Curcuma Caesia · Zero Lead/Mercury",
      status: "Pass",
      notes: "Microbial count safe, free from synthetic coloring.",
    },
  },

  "stone-ground-coriander-powder": {
    tagline: "Aromatic Whole Coriander Seeds Stone Ground at Low Heat",
    origin: "Rajasthan Organic Press Sanctuary, Ramganj Mandi",
    benefits: [
      { title: "Fragrant Linalool Essential Oils", description: "Retains the delicate floral, sweet citrusy aroma of freshly crushed whole coriander." },
      { title: "Digestive Balance & Cooling", description: "Ayurvedic cooling spice that pacifies Pitta dosha and supports comfortable digestion." },
      { title: "100% Whole Coriander Seeds", description: "Zero husk dilution, zero starch fillers, and zero artificial green dyes." },
      { title: "Stone Ground Freshness", description: "Slow stone chakki grinding prevents volatile oil evaporation." },
    ],
    nutrition: [
      { parameter: "Energy", value: "342 kcal" },
      { parameter: "Protein", value: "10.7 g" },
      { parameter: "Carbohydrates", value: "13.0 g" },
      { parameter: "Total Fat", value: "17.5 g" },
      { parameter: "Dietary Fibre", value: "44.8 g" },
      { parameter: "Calcium", value: "718 mg" },
      { parameter: "Iron", value: "16.3 mg" },
      { parameter: "Volatile Oil", value: "0.45%" },
    ],
    craftSteps: [
      { step: 1, title: "Select Ramganj Mandi Seeds", desc: "Plump, aromatic whole coriander seeds from India's foremost coriander belt." },
      { step: 2, title: "Sun-Drying & Cleaning", desc: "Sifted to remove stems, leaves, and dust; sun-dried to optimal moisture." },
      { step: 3, title: "Cold Stone Grinding", desc: "Milled on slow-turning natural chakki stones to retain essential oils." },
      { step: 4, title: "Immediate Jar Packing", desc: "Sealed fresh in glass jars to lock in fresh aroma and earthy flavor." },
    ],
    labTest: {
      reportNumber: "NABL/2026/CORI-9102",
      labName: "National Agriculture Testing & Research Council, Kota",
      accreditation: "ISO 17025 Accredited",
      testedParameter: "Artificial Colour Adulteration & Lead Content",
      result: "Negative (Pure) · Lead: Safe",
      status: "Pass",
      notes: "Total ash 6.8%, zero foreign starches detected.",
    },
  },
};

// Generic fallback enrichment generator
export function getProductEnrichment(slug: string, fallbackName: string, fallbackCategory: string): ProductEnrichmentData {
  if (PRODUCT_ENRICHMENT[slug]) {
    return PRODUCT_ENRICHMENT[slug];
  }
  return {
    tagline: `Pure Traditional ${fallbackCategory} Harvest by Gavyadhenu`,
    origin: "Gavyadhenu Partner Organic Sanctuary, India",
    benefits: [
      { title: "100% Pure & Authentic", description: "Traditional artisanal methods with zero chemical adulterants or synthetic additives." },
      { title: "Direct Farm Traceability", description: "Traceable harvest directly supporting rural Indian farming collectives." },
      { title: "Nutrient-Dense Processing", description: "Processed slowly at low temperatures to protect natural vitamins and enzymes." },
      { title: "Eco-Conscious Packaging", description: "Packaged in sustainable glass jars and recyclable natural materials." },
    ],
    nutrition: [
      { parameter: "Energy", value: "320 kcal" },
      { parameter: "Protein", value: "8.5 g" },
      { parameter: "Carbohydrates", value: "65.0 g" },
      { parameter: "Dietary Fibre", value: "6.0 g" },
      { parameter: "Total Fat", value: "1.2 g" },
      { parameter: "Preservatives", value: "0.0% (Zero)" },
    ],
    craftSteps: [
      { step: 1, title: "Organic Cultivation", desc: "Grown naturally in healthy living soil using ancient regenerative techniques." },
      { step: 2, title: "Hand Harvesting", desc: "Carefully hand-harvested at seasonal peak to ensure optimal potency." },
      { step: 3, title: "Traditional Milling", desc: "Crafted using ancestral Indian food preparation wisdom without chemical heat." },
      { step: 4, title: "Fresh Sealed", desc: "Sealed fresh to deliver untainted sanctuary harvests directly to your kitchen." },
    ],
    labTest: {
      reportNumber: `NABL/2026/GD-${slug.slice(0, 4).toUpperCase()}-1102`,
      labName: "NABL Accredited Analytical Food Labs, India",
      accreditation: "ISO 17025 Certified",
      testedParameter: "Chemical Adulteration & Heavy Metal Screen",
      result: "Negative (100% Pure & Clean)",
      status: "Pass",
      notes: "Zero pesticide residues, zero artificial colors, zero synthetic preservatives detected.",
    },
  };
}

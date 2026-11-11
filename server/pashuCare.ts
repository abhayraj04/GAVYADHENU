import { desc, eq, and } from "drizzle-orm";
import { livestockRecords, livestockHealthLogs, LivestockRecord, LivestockHealthLog } from "../drizzle/schema";
import { getDb } from "./db";

// ==========================================
// 1. LIVESTOCK BREEDS DATA (ICAR / NDRI benchmark)
// ==========================================

export type BreedProfile = {
  breed: string;
  species: "cow" | "buffalo" | "goat";
  origin: string;
  avgMilkYieldPerDay: string;
  lactationLengthDays: number;
  fatPercentage: string;
  climateSuitability: string;
  distinctFeatures: string;
  husbandryTips: string;
};

export const LIVESTOCK_BREEDS_CATALOG: BreedProfile[] = [
  {
    breed: "Gir",
    species: "cow",
    origin: "Gir Hills & Kathiawar, Gujarat",
    avgMilkYieldPerDay: "12 - 18 Liters (elite cows reach 20-25 L)",
    lactationLengthDays: 300,
    fatPercentage: "4.5% - 5.0% (Rich A2 Beta-Casein)",
    climateSuitability: "Hot & semi-arid tropical climates; outstanding heat and tick resistance.",
    distinctFeatures: "Prominent convex rounded forehead ('shield'), long pendulous half-curled ears, red/speckled coat.",
    husbandryTips: "Feed adequate dry roughage (Bhusa) along with leguminous green fodder (Berseem, Lucerne). Benefit greatly from loose housing systems."
  },
  {
    breed: "Sahiwal",
    species: "cow",
    origin: "Montgomery district (Punjab / Indo-Pak border region)",
    avgMilkYieldPerDay: "14 - 20 Liters",
    lactationLengthDays: 305,
    fatPercentage: "4.8% - 5.2%",
    climateSuitability: "Subtropical plains; highly tolerant to extreme North Indian summer heat and humidity.",
    distinctFeatures: "Reddish-dun coat, heavy dewlap and loose skin (earning the colloquial name 'Lola'), small horns.",
    husbandryTips: "High responsiveness to balanced concentrate feeds. Keep well hydrated with 80-100 L clean fresh water daily."
  },
  {
    breed: "Red Sindhi",
    species: "cow",
    origin: "Sindh region, well-adapted across UP, Bihar, Tamil Nadu & Karnataka",
    avgMilkYieldPerDay: "10 - 16 Liters",
    lactationLengthDays: 290,
    fatPercentage: "4.5% - 4.9%",
    climateSuitability: "Adaptable to diverse agro-climatic zones, from humid coastal to dry interior plains.",
    distinctFeatures: "Deep red to dun color, compact body, sturdy dark hooves, docile temperament.",
    husbandryTips: "Excellent roughage converter; highly resilient against common tick-borne haemoprotozoan ailments."
  },
  {
    breed: "Tharparkar",
    species: "cow",
    origin: "Thar Desert, Rajasthan & Kutch",
    avgMilkYieldPerDay: "10 - 15 Liters",
    lactationLengthDays: 290,
    fatPercentage: "4.4% - 4.8%",
    climateSuitability: "Hyper-arid desert conditions, thrives in temperatures from 2°C to 48°C.",
    distinctFeatures: "White or light grey coat (darkens during winter), lyre-shaped horns, medium build.",
    husbandryTips: "Can graze efficiently on sparse arid shrubs like Sewan grass; requires mineral mixture to optimize fertility."
  },
  {
    breed: "Kankrej",
    species: "cow",
    origin: "Rann of Kutch & Banaskantha, Gujarat",
    avgMilkYieldPerDay: "9 - 14 Liters (Heavy dual-purpose draft & milk)",
    lactationLengthDays: 280,
    fatPercentage: "4.6% - 5.1%",
    climateSuitability: "Hot arid & semi-arid tracts.",
    distinctFeatures: "Majestic crescent-shaped lyre horns, powerful hump, 'Sawai Chaal' brisk gait.",
    husbandryTips: "Requires spacious corrals and sturdy bull/cow shelters; very protective mothers."
  },
  {
    breed: "Rathi",
    species: "cow",
    origin: "Bikaner, Ganganagar & Jaisalmer, Rajasthan",
    avgMilkYieldPerDay: "10 - 15 Liters",
    lactationLengthDays: 285,
    fatPercentage: "4.3% - 4.7%",
    climateSuitability: "Arid desert environments with minimal natural water sources.",
    distinctFeatures: "Brownish-red coat with white irregular patches, medium build, placid nature.",
    husbandryTips: "Thrives on pearl millet (Bajra) stover and locally sourced guar/cottonseed concentrates."
  },
  {
    breed: "Murrah",
    species: "buffalo",
    origin: "Rohtak, Hisar, Jind, Haryana (World Famous 'Black Gold')",
    avgMilkYieldPerDay: "14 - 22 Liters",
    lactationLengthDays: 305,
    fatPercentage: "7.0% - 8.5% (High Butterfat)",
    climateSuitability: "Temperate to subtropical; requires wallowing ponds or sprinkler misting in hot weather.",
    distinctFeatures: "Jet black color, tightly curled spiral horns ('spirally coiled'), wedge-shaped dairy form.",
    husbandryTips: "Very sensitive to direct midday solar radiation; provide tree shade, shower twice daily in summer, and 20% higher concentrate ration per liter compared to cattle."
  },
  {
    breed: "Mehsana",
    species: "buffalo",
    origin: "Mehsana, Sabarkantha & Banaskantha, Gujarat",
    avgMilkYieldPerDay: "12 - 18 Liters",
    lactationLengthDays: 310,
    fatPercentage: "6.8% - 7.5%",
    climateSuitability: "Semi-arid western India.",
    distinctFeatures: "Cross of Murrah and Surti; medium black to steel grey body with sickle/loosely curled horns.",
    husbandryTips: "Renowned for consistent persistency of lactation and short inter-calving interval."
  },
  {
    breed: "Jamnapari",
    species: "goat",
    origin: "Chambal ravines, Etawah, Uttar Pradesh",
    avgMilkYieldPerDay: "2.0 - 3.5 Liters",
    lactationLengthDays: 210,
    fatPercentage: "4.0% - 4.5%",
    climateSuitability: "Subtropical dry plains and semi-arid terrain.",
    distinctFeatures: "Large body size, convex roman nose ('parrot mouth'), very long drooping flat ears.",
    husbandryTips: "Primarily a browsing browser rather than grazer; provide tree loppings (Subabul, Neem, Ber, Peepal)."
  },
  {
    breed: "Sirohi",
    species: "goat",
    origin: "Sirohi, Ajmer & Jaipur districts, Rajasthan",
    avgMilkYieldPerDay: "1.2 - 2.0 Liters (Dual purpose milk & meat)",
    lactationLengthDays: 180,
    fatPercentage: "3.8% - 4.2%",
    climateSuitability: "Extremely hardy in dry and rocky regions.",
    distinctFeatures: "Brown coat with light/dark brown patches, flat drooping leaf-like ears, upward curving horns.",
    husbandryTips: "Tolerates high thermal stress; great stall-fed or semi-intensive farm animal."
  }
];

// ==========================================
// 2. SCIENTIFIC NUTRITION & FEED CALCULATOR
// ==========================================

export type FeedPlanInput = {
  animalType: "cow" | "buffalo" | "goat";
  breed?: string;
  bodyWeightKg?: number;
  lactationStage: "dry" | "early_lactation" | "peak" | "mid" | "late" | "pregnant_dry";
  dailyMilkYieldLiters: number;
  isPregnant?: boolean;
};

export type FeedPlanOutput = {
  estimatedBodyWeightKg: number;
  totalDryMatterKg: number;
  greenFodderKg: number;
  dryRoughageKg: number;
  concentrateMixKg: number;
  mineralMixtureGrams: number;
  saltGrams: number;
  cleanWaterLiters: number;
  rationSchedule: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  nutritionalTips: string[];
  rationFormula: {
    energyPercentage: number;
    proteinPercentage: number;
    roughageRatio: string;
  };
};

export function calculateFeedPlan(input: FeedPlanInput): FeedPlanOutput {
  const { animalType, lactationStage, dailyMilkYieldLiters, isPregnant } = input;

  // Determine realistic default body weights if not supplied
  let weight = input.bodyWeightKg && input.bodyWeightKg > 0 ? input.bodyWeightKg : 420;
  if (!input.bodyWeightKg) {
    if (animalType === "buffalo") weight = 520;
    else if (animalType === "goat") weight = 48;
    else weight = 420; // Indigenous cow default
  }

  // Dry Matter (DM) requirement percentage based on species & lactation
  // Cows: 2.5 - 3.0% of Body Weight
  // Buffaloes: 2.8 - 3.2% of Body Weight
  // Goats: 3.5 - 4.0% of Body Weight
  let dmRate = 0.026;
  if (animalType === "buffalo") dmRate = 0.029;
  else if (animalType === "goat") dmRate = 0.038;

  if (lactationStage === "peak" || lactationStage === "early_lactation") {
    dmRate += 0.003;
  }

  const baseDryMatter = Number((weight * dmRate).toFixed(2));

  // Concentrate calculations
  // Maintenance concentrate: ~1.2 to 1.5 kg for cows, 1.8 kg for buffaloes, 0.25 kg for goats
  let maintenanceConc = animalType === "goat" ? 0.25 : animalType === "buffalo" ? 1.8 : 1.4;
  
  // Production concentrate:
  // Cattle: ~400g concentrate per liter of milk (4.5% fat)
  // Buffalo: ~500g concentrate per liter of milk (7.5% fat)
  // Goat: ~200g concentrate per liter of milk
  let concPerLiter = animalType === "goat" ? 0.22 : animalType === "buffalo" ? 0.50 : 0.40;
  let productionConc = dailyMilkYieldLiters * concPerLiter;

  // Pregnancy allowance (last 2-3 months)
  let pregnancyConc = 0;
  if (isPregnant || lactationStage === "pregnant_dry") {
    pregnancyConc = animalType === "goat" ? 0.25 : 1.5;
  }

  const concentrateMixKg = Number((maintenanceConc + productionConc + pregnancyConc).toFixed(2));

  // Remaining Dry Matter is divided between Green Fodder (contains ~20% DM) and Dry Roughage (contains ~90% DM)
  // Standard Dairy proportion: ~2/3 of roughage DM from green, 1/3 from dry
  const remainingRoughageDM = Math.max(0.8, baseDryMatter - (concentrateMixKg * 0.9));
  const greenDM = remainingRoughageDM * 0.65;
  const dryDM = remainingRoughageDM * 0.35;

  // Converting DM back to fresh wet feed weights
  // Green fodder is ~20-25% DM -> fresh weight = DM / 0.22
  // Dry straw/bhusa is ~90% DM -> fresh weight = DM / 0.90
  const greenFodderKg = Number(Math.max(5, (greenDM / 0.22)).toFixed(1));
  const dryRoughageKg = Number(Math.max(1.5, (dryDM / 0.90)).toFixed(1));

  // Mineral mix & salt
  const mineralMixtureGrams = animalType === "goat" ? 15 : animalType === "buffalo" ? 70 : 55;
  const saltGrams = animalType === "goat" ? 10 : animalType === "buffalo" ? 45 : 35;

  // Clean drinking water (rule of thumb: 3 to 4 liters of water per liter of milk plus 35-45L maintenance)
  let cleanWaterLiters = animalType === "goat" 
    ? Math.round(6 + (dailyMilkYieldLiters * 2))
    : Math.round(45 + (dailyMilkYieldLiters * 3.5) + (animalType === "buffalo" ? 20 : 0));

  // Tailored nutrition tips
  const tips: string[] = [
    `Ration balanced for ${weight} kg ${animalType} producing ${dailyMilkYieldLiters} L milk daily.`,
    "Split concentrate feedings equally between morning and evening milking sessions; never feed the entire daily concentrate in a single heavy meal to prevent subacute ruminal acidosis (SARA).",
    "Chop green and dry fodder to 1-2 inch size (chaffing) to improve digestibility and reduce refusal waste by up to 25%.",
    "Add 50g chelated mineral mixture daily to boost conception rates, maintain somatic cell immunity, and prevent silent heats.",
    "Ensure 24/7 access to fresh, cool drinking water. Water deprivation drops milk yield faster than feed deprivation."
  ];

  if (animalType === "buffalo") {
    tips.push("Buffaloes possess distinct rumen microflora that efficiently digest fibrous cellulosic roughages; maintain high-quality dry fodder alongside green Napier/Berseem.");
  }
  if (lactationStage === "early_lactation" || lactationStage === "peak") {
    tips.push("During early lactation, the animal is in negative energy balance. Supplement with bypass fat (100-150g/day) or high-energy grains (maize/cracked wheat) to prevent ketosis.");
  }

  return {
    estimatedBodyWeightKg: weight,
    totalDryMatterKg: baseDryMatter,
    greenFodderKg,
    dryRoughageKg,
    concentrateMixKg,
    mineralMixtureGrams,
    saltGrams,
    cleanWaterLiters,
    rationSchedule: {
      morning: `1/2 concentrate (${(concentrateMixKg / 2).toFixed(1)} kg) mixed with ${mineralMixtureGrams / 2}g mineral mix + ${(greenFodderKg * 0.4).toFixed(1)} kg chopped green fodder. Fresh water ad libitum.`,
      afternoon: `${(dryRoughageKg * 0.6).toFixed(1)} kg dry straw / bhusa moistened with dilute brine or molasses spray. Shade resting & water.`,
      evening: `1/2 concentrate (${(concentrateMixKg / 2).toFixed(1)} kg) + remaining chopped green fodder (${(greenFodderKg * 0.6).toFixed(1)} kg) + remaining dry straw.`
    },
    nutritionalTips: tips,
    rationFormula: {
      energyPercentage: 62,
      proteinPercentage: 18,
      roughageRatio: "65% Green : 35% Dry Roughage"
    }
  };
}

// ==========================================
// 3. LIVESTOCK SYMPTOM CHECKER & VET TRIAGE
// ==========================================

export type SymptomCheckInput = {
  animalType: "cow" | "buffalo" | "goat";
  symptoms: string[];
  observedDurationHours?: number;
  bodyTemperatureC?: number;
  lactationStatus?: string;
  notes?: string;
  language?: "en" | "hi";
};

export type SymptomAssessment = {
  matchedCondition: string;
  urgencyLevel: "critical" | "high" | "moderate" | "low";
  clinicalObservations: string;
  immediateFirstAid: string[];
  strictlyAvoid: string[];
  professionalCareRequired: boolean;
  emergencyHelpline: string;
  veterinaryDisclaimer: string;
  audioNarrationText?: string;
};

export const LIVESTOCK_DISORDER_PROFILES = [
  {
    condition: "Bloat / Tympany (Afara / Pet Phoolna)",
    keywords: ["bloat", "swollen left flank", "tympany", "kicking belly", "belching stopped", "gas in stomach", "distended abdomen"],
    urgencyLevel: "critical" as const,
    observations: "Distension of the left paralumbar fossa (left side behind the ribs) due to accumulation of free gas or stable frothy foam in the rumen. Can cause lethal respiratory arrest within hours if untreated.",
    firstAid: [
      "Keep the animal moving and standing with forequarters elevated on a slope.",
      "Gently place a wooden bit or gag in the mouth across the jaws to induce continuous chewing and natural eructation (belching).",
      "For frothy bloat: Administer oral vegetable oil (groundnut, mustard or linseed oil, 300-500 ml for cattle/buffalo, 50 ml for goat) mixed with 15-20 ml of oil of turpentine.",
      "Call the nearest veterinary officer immediately. If severe asphyxiation occurs, emergency puncture with a trocar and cannula by a trained vet is vital."
    ],
    strictlyAvoid: [
      "Do NOT allow the animal to lie down on its side.",
      "Do NOT administer liquids via drenching pipe if the animal is gasping; high risk of fatal lung aspiration pneumonia.",
      "Do NOT puncture the rumen with unsterilized household knives or wire."
    ],
    needsVet: true
  },
  {
    condition: "Bovine Mastitis (Thanela Rog)",
    keywords: ["mastitis", "swollen udder", "hot teat", "blood in milk", "curdled milk", "clots in milk", "flaky milk", "udder pain", "hard quarter"],
    urgencyLevel: "high" as const,
    observations: "Inflammation of mammary gland tissue caused by bacterial infiltration (Streptococcus, Staphylococcus, or coliforms) via the teat canal. Causes severe pain, curd-like secretions, and loss of milk production.",
    firstAid: [
      "Completely strip out the affected teat/quarter every 2 hours into a disinfectant container (never onto the barn floor).",
      "Apply cold water compresses or ice packs to the inflamed udder quarter for 15-20 minutes to reduce edema and inflammatory pain.",
      "Perform a simple California Mastitis Test (CMT) or test strip verification on all four quarters.",
      "Clean teats thoroughly before and after milking with 0.5% povidone-iodine teat dip cup."
    ],
    strictlyAvoid: [
      "Do NOT pinch or pull teats violently using the knuckle method ('angootha pakadna'); practice only full-hand milking ('poori mutthi').",
      "Do NOT inject intramammary antibiotics without qualified veterinary prescription and aseptic teat sterilization.",
      "Do NOT mix mastitis milk with commercial bulk tank milk for sale."
    ],
    needsVet: true
  },
  {
    condition: "Milk Fever / Hypocalcemia (Soothaka Jwar)",
    keywords: ["milk fever", "downer cow", "cannot stand", "s-shape neck", "cold ears", "recent calving", "staggering", "subnormal temperature"],
    urgencyLevel: "critical" as const,
    observations: "Metabolic deficiency of serum calcium occurring within 24 to 72 hours following calving in high-yielding dairy animals. Results in progressive flaccid paralysis, cold extremities, and sternal recumbency with head turned into the flank.",
    firstAid: [
      "Keep the recumbent animal propped up in sternal position (sitting on brisket) using dry straw bales; do NOT let her lie flat on her side to avoid bloat.",
      "Keep the animal warm with jute blankets or gunny sacks if body temperature is subnormal (ears and extremities cold to touch).",
      "Contact an emergency veterinarian immediately for intravenous administration of Calcium Borogluconate (25%). Rapid recovery often occurs within 30 minutes of proper IV calcium therapy."
    ],
    strictlyAvoid: [
      "NEVER forcefully pour oral medicine or liquid drench down the throat; the swallowing reflex is paralyzed and liquid will enter the lungs causing death.",
      "Do NOT whip or force the paralyzed downer animal to stand."
    ],
    needsVet: true
  },
  {
    condition: "Foot and Mouth Disease (FMD / Khur-pakha / Munh-pakha)",
    keywords: ["fmd", "mouth blisters", "foot sores", "drooling saliva", "stringy saliva", "frothing at mouth", "lameness", "hoof separation"],
    urgencyLevel: "critical" as const,
    observations: "Highly contagious viral disease (Aphthovirus) characterized by high fever, excessive stringy salivation, vesicle blisters on tongue, dental pad and gums, and painful erosions in interdigital clefts of hooves causing severe lameness.",
    firstAid: [
      "Isolate the affected animal immediately in a separate dry quarantine shed away from healthy herd members.",
      "Wash mouth lesions gently 2-3 times daily with a mild 1% Potassium Permanganate (KMNO4) solution or 2% sodium bicarbonate solution.",
      "Apply clean mustard oil mixed with boric acid powder or pure neem oil on hoof lesions to deter blowfly maggots.",
      "Provide soft, nutritious, easily digestible gruel (cooked broken rice, wheat porridge/dalia with jaggery) since mastication is painful.",
      "Notify the local government veterinary hospital or district animal husbandry officer immediately as FMD is a mandatory notifiable disease."
    ],
    strictlyAvoid: [
      "Do NOT allow sick animals to graze on common village pasture or share communal water troughs.",
      "Do NOT walk infected lame cattle on rough gravel or tarmac roads."
    ],
    needsVet: true
  },
  {
    condition: "Lumpy Skin Disease (LSD / Gaanthdar Rog)",
    keywords: ["lumpy skin", "skin nodules", "lsd", "nodules on body", "swollen lymph nodes", "watery eyes", "pox", "skin bumps"],
    urgencyLevel: "high" as const,
    observations: "Capripoxvirus infection transmitted primarily by blood-feeding insects (mosquitoes, stable flies, ticks). Causes distinctive firm, circumscribed 2-5 cm skin nodules over head, neck, udder and limbs, fever, and edema of limbs.",
    firstAid: [
      "Quarantine the animal in a well-ventilated stall equipped with mosquito nets or smoke repelling neem leaf smudges.",
      "Clean ruptured skin nodules with 1% potassium permanganate or mild antiseptic; apply neem oil with turmeric paste on intact nodules.",
      "Keep premises fly-free using bio-safe fly traps and herbal repellent sprays (e.g. eucalyptus, citronella).",
      "Vaccinate all unaffected animals in the village/farm with Goat Pox Vaccine as per National Veterinary Advisory."
    ],
    strictlyAvoid: [
      "Do NOT scrape or forcibly squeeze the skin nodules.",
      "Do NOT trade or transport animals from LSD-affected villages."
    ],
    needsVet: true
  },
  {
    condition: "Ketosis / Acetonemia (Keto rog)",
    keywords: ["ketosis", "sweet breath", "acetone smell", "refusal to eat grains", "weight loss after calving", "erratic walking", "chewing dry objects"],
    urgencyLevel: "moderate" as const,
    observations: "Impaired carbohydrate and volatile fatty acid metabolism in early high-lactation cows, causing high circulating ketone bodies. Manifests as sudden drop in milk yield, characteristic sweet acetone odor in breath/urine, and preferential refusal of concentrates while eating dry roughage.",
    firstAid: [
      "Administer oral energy precursors: Propylene glycol (150-200 ml twice daily for 3-4 days) or liquid jaggery (Gur) water (500g in warm water).",
      "Offer high quality green fodder and palatable wheat bran mash.",
      "Ensure veterinary evaluation for IV dextrose (20-50%) infusion and liver-supportive therapy."
    ],
    strictlyAvoid: [
      "Do NOT feed spoiled or moldy silage rich in butyric acid.",
      "Do NOT abruptly withdraw feed or starve high-producing animals."
    ],
    needsVet: true
  },
  {
    condition: "Ectoparasite Infestation & Tick-borne Fever (Chichhad / Babesiosis / Theileriosis)",
    keywords: ["ticks", "chichhad", "lice", "coffee colored urine", "red water", "pale eyes", "high fever with ticks", "bottle jaw"],
    urgencyLevel: "high" as const,
    observations: "Ticks transmit dangerous protozoan parasites (Babesia bigemina, Theileria annulata). Symptoms include persistent high fever (104-106°F), severe anemia (pale or yellowish eye mucous membranes), swollen prescapular lymph nodes, and potentially dark red/coffee-colored urine.",
    firstAid: [
      "Conduct manual tick removal using gloves or apply vet-approved herbal ectoparasite spray (neem + camphor oil).",
      "If red/coffee colored urine or very pale conjunctiva is noted, urgent veterinary intervention with specific anti-protozoals (Buparvaquone / Diminazene aceturate) is life-saving within 24 hours.",
      "Keep animal sheltered in cool shade and provide electrolytes."
    ],
    strictlyAvoid: [
      "Do NOT crush engorged ticks with bare fingers (spreads protozoa and zoonotic Crimean-Congo virus).",
      "Do NOT delay medical attention if urine turns red or brownish."
    ],
    needsVet: true
  }
];

export function triageLivestockSymptoms(input: SymptomCheckInput): SymptomAssessment {
  const queryTokens = (input.symptoms || []).concat(input.notes ? [input.notes] : [])
    .join(" ")
    .toLowerCase();

  let bestMatch = LIVESTOCK_DISORDER_PROFILES[0];
  let highestScore = 0;

  for (const profile of LIVESTOCK_DISORDER_PROFILES) {
    let score = 0;
    for (const kw of profile.keywords) {
      if (queryTokens.includes(kw.toLowerCase())) {
        score += 2;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = profile;
    }
  }

  // If temperature is high (>39.5°C or >103°F), escalate urgency
  let urgency = bestMatch.urgencyLevel;
  if (input.bodyTemperatureC && input.bodyTemperatureC >= 40.0 && urgency !== "critical") {
    urgency = "high";
  }

  const conditionName = highestScore > 0 ? bestMatch.condition : "General Livestock Indisposition / Non-Specific Signs";
  const firstAidList = highestScore > 0 ? bestMatch.firstAid : [
    "Isolate animal in a clean, quiet, dry stall with clean bedding.",
    "Ensure unlimited access to fresh, cool drinking water.",
    "Offer fresh, palatable chopped green fodder; avoid feeding heavy grain concentrates until digestion stabilizes.",
    "Record body temperature rectally using a digital clinical veterinary thermometer (Normal cattle range: 38.0°C - 39.2°C / 100.5°F - 102.5°F)."
  ];
  const avoidList = highestScore > 0 ? bestMatch.strictlyAvoid : [
    "Do NOT administer human analgesics (like paracetamol, diclofenac, or ibuprofen) which can cause lethal renal failure or abomasal ulceration in ruminants.",
    "Do NOT forcefully drench liquid if animal shows swallowing difficulties."
  ];

  const isHindi = input.language === "hi";
  const audioScript = isHindi
    ? `पशु में ${conditionName} के संभावित लक्षण हैं। तुरंत प्राथमिक उपचार: ${firstAidList[0]}। विशेष सावधानी: ${avoidList[0]}। आपातकालीन सहायता के लिए टोल-फ्री 1962 पर कॉल करें।`
    : `Assessment indicates potential ${conditionName}. Immediate first aid: ${firstAidList[0]}. Caution: ${avoidList[0]}. For emergency assistance, call 1962.`;

  return {
    matchedCondition: conditionName,
    urgencyLevel: highestScore > 0 ? urgency : "moderate",
    clinicalObservations: highestScore > 0 
      ? bestMatch.observations 
      : `Reported symptoms: [${input.symptoms.join(", ")}]. The animal is exhibiting signs of reduced vigor or discomfort. Temperature: ${input.bodyTemperatureC ? `${input.bodyTemperatureC}°C` : "Not recorded"}.`,
    immediateFirstAid: firstAidList,
    strictlyAvoid: avoidList,
    professionalCareRequired: highestScore > 0 ? bestMatch.needsVet : true,
    emergencyHelpline: "National Emergency Animal Helpline: 1962 (Toll Free) | Local Pashu Chikitsalaya / KVK",
    veterinaryDisclaimer: "CRITICAL VETERINARY SAFETY NOTICE: Gavyadhenu AI provides educational first-aid and scientific husbandry triage only. It is NOT a clinical prescription and cannot replace physical diagnosis by a registered Veterinary Assistant Surgeon (VAS) or qualified B.V.Sc & A.H. practitioner. In case of acute distress, immediately summon your local government veterinary dispensary.",
    audioNarrationText: audioScript,
  };
}

// ==========================================
// 4. VACCINATION & DEWORMING PROTOCOL ENGINE
// ==========================================

export type ImmunizationEvent = {
  id: string;
  name: string;
  diseaseTarget: string;
  recommendedSeason: string;
  targetAge: string;
  repeatFrequency: string;
  precautions: string;
};

export const STANDARD_IMMUNIZATION_PROTOCOL: ImmunizationEvent[] = [
  {
    id: "fmd_pre_monsoon",
    name: "FMD (Foot & Mouth Disease) Primary",
    diseaseTarget: "Foot & Mouth Viral Disease",
    recommendedSeason: "April - May (Pre-Monsoon)",
    targetAge: "Calves > 4 months, all adult cattle & buffaloes",
    repeatFrequency: "Every 6 months (Biannual)",
    precautions: "Do not vaccinate heavily pregnant animals in the last 15 days before calving."
  },
  {
    id: "hs_pre_monsoon",
    name: "HS (Hemorrhagic Septicemia / Galghontu)",
    diseaseTarget: "Pasteurella multocida bacterial infection",
    recommendedSeason: "May - June (Before onset of rains)",
    targetAge: "Animals > 6 months of age",
    repeatFrequency: "Annual (Yearly booster)",
    precautions: "Subcutaneous injection by certified paravet; store vaccine cold at 2-8°C."
  },
  {
    id: "bq_pre_monsoon",
    name: "BQ (Black Quarter / Langdi Rog)",
    diseaseTarget: "Clostridium chauvoei bacterial spores",
    recommendedSeason: "May - June (Before monsoon)",
    targetAge: "Young stock 6 months to 2 years (most susceptible)",
    repeatFrequency: "Annual",
    precautions: "Often administered as combined HS + BQ vaccine in endemic regions."
  },
  {
    id: "deworming_pre_monsoon",
    name: "Broad-Spectrum Deworming (Pre-Monsoon)",
    diseaseTarget: "Nematodes, Roundworms, Liver Flukes (Fasciola)",
    recommendedSeason: "June (At first drizzle)",
    targetAge: "All age groups",
    repeatFrequency: "Every 3-4 months (Quarterly rotation)",
    precautions: "Rotate anthelmintic classes: Albendazole -> Fenbendazole -> Ivermectin to prevent parasite drug resistance."
  },
  {
    id: "fmd_post_monsoon",
    name: "FMD (Foot & Mouth Disease) Booster",
    diseaseTarget: "Foot & Mouth Viral Disease",
    recommendedSeason: "October - November (Post-Monsoon)",
    targetAge: "All herd stock",
    repeatFrequency: "Every 6 months",
    precautions: "Mandatory under National Animal Disease Control Programme (NADCP)."
  },
  {
    id: "deworming_post_monsoon",
    name: "Liver Fluke & Tapeworm Deworming (Post-Monsoon)",
    diseaseTarget: "Amphistomes and Liver flukes in waterlogged pastures",
    recommendedSeason: "November",
    targetAge: "All herd stock",
    repeatFrequency: "Every 4 months",
    precautions: "Use Oxyclozanide + Levamisole or Triclabendazole after veterinary fecal egg count check."
  },
  {
    id: "brucellosis_calfhood",
    name: "Brucellosis Strain 19 Calfhood Vaccine",
    diseaseTarget: "Brucella abortus (Contagious abortion & human undulant fever)",
    recommendedSeason: "Year-round based on calf age",
    targetAge: "Female calves strictly between 4 to 8 months of age ONLY",
    repeatFrequency: "Once in lifetime (Never vaccinate adult bulls or adult cows)",
    precautions: "Zoonotic vaccine strain; must be handled by trained veterinary doctors only."
  }
];

// ==========================================
// 5. IN-MEMORY STORE (Fallback for offline/dev)
// ==========================================

let inMemoryLivestock: LivestockRecord[] = [
  {
    id: 1,
    ownerId: 1,
    tagId: "GD-GIR-001",
    animalType: "cow",
    breed: "Gir",
    name: "Kamadhenu",
    ageMonths: 48,
    gender: "female",
    lactationStage: "peak",
    dailyMilkYieldLiters: "16.50",
    healthStatus: "healthy",
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-10-20"),
  },
  {
    id: 2,
    ownerId: 1,
    tagId: "GD-MUR-002",
    animalType: "buffalo",
    breed: "Murrah",
    name: "Shyamali",
    ageMonths: 60,
    gender: "female",
    lactationStage: "mid",
    dailyMilkYieldLiters: "18.00",
    healthStatus: "healthy",
    createdAt: new Date("2026-02-10"),
    updatedAt: new Date("2026-10-18"),
  },
  {
    id: 3,
    ownerId: 1,
    tagId: "GD-SAH-003",
    animalType: "cow",
    breed: "Sahiwal",
    name: "Nandini",
    ageMonths: 36,
    gender: "female",
    lactationStage: "early_lactation",
    dailyMilkYieldLiters: "14.20",
    healthStatus: "under_observation",
    createdAt: new Date("2026-05-04"),
    updatedAt: new Date("2026-10-25"),
  }
];

let inMemoryHealthLogs: LivestockHealthLog[] = [
  {
    id: 1,
    animalId: 1,
    logType: "vaccination",
    title: "FMD Pre-Monsoon Vaccination",
    description: "NADCP program bi-annual vaccination administered smoothly with no adverse swelling.",
    medication: "FMD Inactivated Oil Adjuvant Vaccine (3ml S/C)",
    nextDueDate: new Date(Date.now() + 86400000 * 45), // 45 days later
    createdAt: new Date(Date.now() - 86400000 * 135),
  },
  {
    id: 2,
    animalId: 1,
    logType: "deworming",
    title: "Quarterly Broad-Spectrum Deworming",
    description: "Administered Fenbendazole 3g bolus early morning before roughage feeding.",
    medication: "Fenbendazole Bolus 3000mg",
    nextDueDate: new Date(Date.now() + 86400000 * 14), // 14 days later
    createdAt: new Date(Date.now() - 86400000 * 76),
  },
  {
    id: 3,
    animalId: 3,
    logType: "symptom_check",
    title: "Mild Left Teat Swelling Checked",
    description: "California Mastitis Test showed faint gel reaction; cold water compress initiated.",
    medication: "Povidone Iodine 0.5% post-milking dip",
    nextDueDate: new Date(Date.now() + 86400000 * 3),
    createdAt: new Date(Date.now() - 86400000 * 2),
  }
];

// ==========================================
// 6. DATABASE / REPOSITORY HELPERS
// ==========================================

export async function getLivestockRecords(ownerId: number): Promise<LivestockRecord[]> {
  const db = await getDb();
  if (!db) {
    return inMemoryLivestock.filter(r => r.ownerId === ownerId);
  }
  return db
    .select()
    .from(livestockRecords)
    .where(eq(livestockRecords.ownerId, ownerId))
    .orderBy(desc(livestockRecords.updatedAt));
}

export async function getLivestockRecordById(ownerId: number, animalId: number): Promise<LivestockRecord | null> {
  const db = await getDb();
  if (!db) {
    const found = inMemoryLivestock.find(r => r.id === animalId && r.ownerId === ownerId);
    return found || null;
  }
  const rows = await db
    .select()
    .from(livestockRecords)
    .where(and(eq(livestockRecords.id, animalId), eq(livestockRecords.ownerId, ownerId)))
    .limit(1);
  return rows[0] || null;
}

export async function createLivestockRecord(
  ownerId: number,
  data: {
    tagId: string;
    animalType: string;
    breed?: string;
    name?: string;
    ageMonths?: number;
    gender?: "female" | "male";
    lactationStage?: string;
    dailyMilkYieldLiters?: string;
    healthStatus?: "healthy" | "under_observation" | "sick" | "recovering";
  }
): Promise<LivestockRecord> {
  const db = await getDb();

  const record: Omit<LivestockRecord, "id"> = {
    ownerId,
    tagId: data.tagId.trim().toUpperCase(),
    animalType: data.animalType,
    breed: data.breed || null,
    name: data.name || null,
    ageMonths: data.ageMonths || null,
    gender: data.gender || "female",
    lactationStage: data.lactationStage || "dry",
    dailyMilkYieldLiters: data.dailyMilkYieldLiters || "0.00",
    healthStatus: data.healthStatus || "healthy",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (!db) {
    const newId = inMemoryLivestock.length > 0 ? Math.max(...inMemoryLivestock.map(l => l.id)) + 1 : 1;
    const fullRecord: LivestockRecord = { id: newId, ...record };
    inMemoryLivestock.push(fullRecord);
    return fullRecord;
  }

  const result = await db.insert(livestockRecords).values(record);
  const insertId = Number(result[0].insertId);
  return { id: insertId, ...record };
}

export async function updateLivestockRecord(
  ownerId: number,
  animalId: number,
  data: Partial<Omit<LivestockRecord, "id" | "ownerId" | "createdAt">>
): Promise<LivestockRecord | null> {
  const db = await getDb();

  if (!db) {
    const idx = inMemoryLivestock.findIndex(r => r.id === animalId && r.ownerId === ownerId);
    if (idx === -1) return null;
    inMemoryLivestock[idx] = {
      ...inMemoryLivestock[idx],
      ...data,
      updatedAt: new Date(),
    };
    return inMemoryLivestock[idx];
  }

  await db
    .update(livestockRecords)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(livestockRecords.id, animalId), eq(livestockRecords.ownerId, ownerId)));

  return getLivestockRecordById(ownerId, animalId);
}

export async function deleteLivestockRecord(ownerId: number, animalId: number): Promise<boolean> {
  const db = await getDb();

  if (!db) {
    inMemoryLivestock = inMemoryLivestock.filter(r => !(r.id === animalId && r.ownerId === ownerId));
    inMemoryHealthLogs = inMemoryHealthLogs.filter(l => l.animalId !== animalId);
    return true;
  }

  await db.delete(livestockHealthLogs).where(eq(livestockHealthLogs.animalId, animalId));
  await db.delete(livestockRecords).where(and(eq(livestockRecords.id, animalId), eq(livestockRecords.ownerId, ownerId)));
  return true;
}

export async function getHealthLogsForAnimal(animalId: number): Promise<LivestockHealthLog[]> {
  const db = await getDb();
  if (!db) {
    return inMemoryHealthLogs
      .filter(l => l.animalId === animalId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  return db
    .select()
    .from(livestockHealthLogs)
    .where(eq(livestockHealthLogs.animalId, animalId))
    .orderBy(desc(livestockHealthLogs.createdAt));
}

export async function createHealthLog(
  ownerId: number,
  animalId: number,
  data: {
    logType: "vaccination" | "deworming" | "symptom_check" | "treatment" | "feed_update";
    title: string;
    description?: string;
    medication?: string;
    nextDueDate?: Date | null;
  }
): Promise<LivestockHealthLog> {
  // Ensure animal belongs to owner
  const animal = await getLivestockRecordById(ownerId, animalId);
  if (!animal) {
    throw new Error("Animal record not found or does not belong to authenticated user.");
  }

  const db = await getDb();
  const logRecord: Omit<LivestockHealthLog, "id"> = {
    animalId,
    logType: data.logType,
    title: data.title,
    description: data.description || null,
    medication: data.medication || null,
    nextDueDate: data.nextDueDate || null,
    createdAt: new Date(),
  };

  if (!db) {
    const newId = inMemoryHealthLogs.length > 0 ? Math.max(...inMemoryHealthLogs.map(l => l.id)) + 1 : 1;
    const fullLog: LivestockHealthLog = { id: newId, ...logRecord };
    inMemoryHealthLogs.push(fullLog);
    return fullLog;
  }

  const result = await db.insert(livestockHealthLogs).values(logRecord);
  const insertId = Number(result[0].insertId);
  return { id: insertId, ...logRecord };
}

export async function getUpcomingPreventiveAlerts(ownerId: number): Promise<Array<{
  animalId: number;
  animalName: string;
  tagId: string;
  title: string;
  logType: string;
  dueDate: Date;
  daysRemaining: number;
}>> {
  const animals = await getLivestockRecords(ownerId);
  const alerts: Array<{
    animalId: number;
    animalName: string;
    tagId: string;
    title: string;
    logType: string;
    dueDate: Date;
    daysRemaining: number;
  }> = [];

  const now = Date.now();

  for (const animal of animals) {
    const logs = await getHealthLogsForAnimal(animal.id);
    for (const log of logs) {
      if (log.nextDueDate) {
        const diffMs = log.nextDueDate.getTime() - now;
        const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        // Include if due in the future (within next 60 days) or overdue by up to 15 days
        if (daysRemaining >= -15 && daysRemaining <= 60) {
          alerts.push({
            animalId: animal.id,
            animalName: animal.name || animal.tagId,
            tagId: animal.tagId,
            title: log.title,
            logType: log.logType,
            dueDate: log.nextDueDate,
            daysRemaining,
          });
        }
      }
    }
  }

  return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "hi";

type Translations = Record<string, { en: string; hi: string }>;

export const DICTIONARY: Translations = {
  // Navigation & Header
  nav_shop: { en: "Shop harvests", hi: "उत्पाद देखें" },
  nav_ai: { en: "AI Intelligence", hi: "AI कृषि सेवा" },
  nav_promise: { en: "Our promise", hi: "हमारा संकल्प" },
  nav_ask_dhenu: { en: "Ask Dhenu", hi: "धेनु से पूछें" },
  nav_account: { en: "My Account", hi: "मेरा खाता" },
  nav_cart: { en: "Basket", hi: "टोकरी" },
  nav_compare: { en: "Compare", hi: "तुलना" },
  search_placeholder: {
    en: "Search A2 bilona ghee, cold-pressed oils, bio-fertilizers...",
    hi: "शुद्ध A2 बिलौना घी, कच्ची घानी तेल, जैविक खाद खोजें...",
  },
  ribbon_text: {
    en: "Partner farms, honest harvests, certified regenerative origins",
    hi: "प्रमाणित प्राकृतिक खेत, शुद्ध पारंपरिक उत्पाद और सुरक्षित मूल स्रोत",
  },
  ribbon_free_delivery: {
    en: "Free delivery over ₹999 across India",
    hi: "पूरे भारत में ₹999 से अधिक पर मुफ़्त डिलीवरी",
  },

  // Hero Section
  hero_kicker: {
    en: "NEXT-GENERATION AGRICULTURAL ECOSYSTEM",
    hi: "अगली पीढ़ी का कृषि और ग्रामीण पारिस्थितिकी तंत्र",
  },
  hero_title_1: { en: "Honest harvests, powered by", hi: "प्राकृतिक संपदा, संचालित" },
  hero_title_2: { en: "intelligence.", hi: "बुद्धिमत्ता द्वारा।" },
  hero_desc: {
    en: "Discover traditional A2 dairy, cold-pressed oils, wild honey, and restorative rituals from verified partner farms — backed by AI crop diagnostics, livestock care, and transparent traceability.",
    hi: "पारंपरिक A2 वैदिक डेयरी, कच्ची घानी तेल, शुद्ध जंगली शहद और प्राकृतिक जीवन शैली के उत्पाद — AI फसल रोग निदान, पशु स्वास्थ्य और पारदर्शी शुद्धता के साथ।",
  },
  hero_btn_explore: { en: "Explore the harvest", hi: "उत्पाद संग्रह देखें" },
  hero_btn_talk_ai: { en: "Talk to Dhenu AI", hi: "धेनु AI से बात करें" },
  hero_trusted: {
    en: "4.9 trusted by 10,000+ conscious families",
    hi: "4.9 रेटिंग · 10,000+ परिवारों द्वारा विश्वसनीय",
  },
  hero_verified: {
    en: "Every item verified from soil to shelf",
    hi: "खेत की मिट्टी से आपकी रसोई तक हर उत्पाद प्रमाणित",
  },

  // Benefits
  benefit_1_title: { en: "Farm-to-Door", hi: "खेत से सीधे द्वार तक" },
  benefit_1_sub: { en: "Dispatched fresh in small batches", hi: "ताज़ा और शुद्ध छोटे बैचों में तैयार" },
  benefit_2_title: { en: "Earth-Positive", hi: "पर्यावरण-अनुकूल" },
  benefit_2_sub: { en: "Chemical-free & regenerative", hi: "100% रसायन मुक्त और प्राकृतिक" },
  benefit_3_title: { en: "Lab-Tested Quality", hi: "प्रयोगशाला प्रमाणित शुद्धता" },
  benefit_3_sub: { en: "Zero adulteration guarantee", hi: "शून्य मिलावट की गारंटी" },
  benefit_4_title: { en: "Dhenu AI Guide", hi: "धेनु AI मार्गदर्शक" },
  benefit_4_sub: { en: "Intelligent rural commerce", hi: "बुद्धिमान कृषि व ग्रामीण परामर्श" },

  // AI Ecosystem
  eco_kicker: { en: "INTELLIGENT ECOSYSTEM", hi: "बुद्धिमान कृषि तकनीक" },
  eco_title_1: { en: "AI built for", hi: "ग्रामीण कल्याण के लिए" },
  eco_title_2: { en: "rural care.", hi: "समर्पित AI।" },
  eco_desc: {
    en: "Gavyadhenu unites conscious commerce with precision agricultural intelligence for farmers, livestock guardians, and mindful homes.",
    hi: "गव्यधेनु प्राकृतिक व्यापार को किसानों, पशुपालकों और जागरूक परिवारों के लिए सटीक कृषि तकनीक से जोड़ता है।",
  },
  eco_dhenu_badge: { en: "Conversational Guide", hi: "संवादी AI सहायक" },
  eco_dhenu_title: { en: "Dhenu AI Companion", hi: "धेनु AI साथी" },
  eco_dhenu_desc: {
    en: "Natural language product matching, recipe suggestions, grounded catalogue reasoning, and live order status.",
    hi: "सहज भाषा में उत्पाद चयन, शुद्धता की जानकारी, आहार सुझाव और लाइव ऑर्डर स्थिति।",
  },
  eco_dhenu_btn: { en: "Chat with Dhenu →", hi: "धेनु से बातचीत करें →" },
  eco_crop_badge: { en: "Computer Vision", hi: "कंप्यूटर विज़न तकनीक" },
  eco_crop_title: { en: "AI Crop Doctor", hi: "AI फसल डॉक्टर" },
  eco_crop_desc: {
    en: "Instant leaf disease classification, confidence ratings, verified organic treatments, and prevention guidance.",
    hi: "पत्ती फोटो से तुरंत रोग पहचान, वैज्ञानिक विश्वास प्रतिशत, प्रमाणित जैविक उपचार व रोकथाम।",
  },
  eco_crop_btn: { en: "Scan a leaf photo →", hi: "पत्ती का फोटो जांचें →" },
  eco_pashu_badge: { en: "Cattle Wellness", hi: "गोवंश स्वास्थ्य" },
  eco_pashu_title: { en: "AI Pashu Care", hi: "AI पशु सेवा" },
  eco_pashu_desc: {
    en: "Livestock nutrition calculators, deworming and vaccination calendars, lactation health tracking, and vet advisory.",
    hi: "वैज्ञानिक पोषण कैलकुलेटर, टीकाकरण व डिवर्मिंग कैलेंडर, दुग्ध उत्पादन ट्रैकिंग और प्राथमिक पशु चिकित्सा।",
  },
  eco_pashu_btn: { en: "Open livestock care →", hi: "पशु सेवा केंद्र खोलें →" },

  // Catalog
  catalog_kicker: { en: "THE LIVING HARVEST", hi: "प्राकृतिक उत्पादों का संग्रह" },
  catalog_title_1: { en: "Choose what feels", hi: "चुनें जो आपके स्वास्थ्य के लिए" },
  catalog_title_2: { en: "right.", hi: "सर्वोत्तम हो।" },
  catalog_desc: {
    en: "Small-batch, ethically sourced harvests from certified sanctuary farms and regenerative growers across India.",
    hi: "भारत भर की प्रमाणित गोशालाओं और प्राकृतिक खेतों से सीधे प्राप्त शुद्ध उत्पाद।",
  },

  // Categories
  cat_all: { en: "All harvests", hi: "सभी उत्पाद" },
  cat_kitchen: { en: "Kitchen", hi: "रसोई (Kitchen)" },
  cat_wellness: { en: "Wellness", hi: "आरोग्य (Wellness)" },
  cat_home: { en: "Home & Living", hi: "घर और रहन-सहन" },
  cat_farm: { en: "Farm & Soil", hi: "खेत और मिट्टी" },
  cat_gifting: { en: "Gifting", hi: "उपहार (Gifting)" },

  // Filters & Sorting
  filter_all_prices: { en: "All prices", hi: "सभी मूल्य" },
  filter_under_300: { en: "Under ₹300", hi: "₹300 से कम" },
  filter_300_600: { en: "₹300 – ₹600", hi: "₹300 – ₹600" },
  filter_600_1000: { en: "₹600 – ₹1000", hi: "₹600 – ₹1000" },
  filter_1000_plus: { en: "₹1000+", hi: "₹1000 से अधिक" },
  sort_newest: { en: "Newest first", hi: "नवीनतम पहले" },
  sort_price_asc: { en: "Price: Low to High", hi: "मूल्य: कम से अधिक" },
  sort_price_desc: { en: "Price: High to Low", hi: "मूल्य: अधिक से कम" },
  sort_name_asc: { en: "Alphabetical (A-Z)", hi: "वर्णमाला (A-Z)" },

  // Cart
  cart_title: { en: "YOUR BASKET", hi: "आपकी टोकरी" },
  cart_empty_title: { en: "Your basket is ready.", hi: "आपकी टोकरी खाली है।" },
  cart_empty_desc: {
    en: "Bring something honest home — every harvest supports the farms behind it.",
    hi: "अपने घर लाएं शुद्ध प्राकृतिक उत्पाद — हर खरीद स्थानीय किसानों का समर्थन करती है।",
  },
  cart_subtotal: { en: "Subtotal", hi: "उप-योग" },
  cart_delivery: { en: "Farm-to-Door Delivery", hi: "खेत से घर तक डिलीवरी" },
  cart_free: { en: "FREE", hi: "मुफ़्त" },
  cart_total: { en: "Total", hi: "कुल राशि" },
  cart_checkout: { en: "Proceed to checkout", hi: "चेकआउट के लिए आगे बढ़ें" },
  cart_continue: { en: "Continue exploring", hi: "खरीदारी जारी रखें" },

  // Crop Doctor
  crop_doctor_title: { en: "AI Crop Doctor", hi: "AI फसल डॉक्टर" },
  crop_doctor_sub: {
    en: "Precision plant pathology, disease recognition, and dual treatment guidance.",
    hi: "सटीक पौध रोग पहचान, लक्षण विश्लेषण और जैविक व रासायनिक उपचार निर्देश।",
  },
  crop_scan_leaf: { en: "Upload Leaf Photograph", hi: "पत्ती का फोटो अपलोड करें" },
  crop_diagnose_action: { en: "Run Leaf Diagnostic Scan", hi: "रोग की वैज्ञानिक जांच करें" },
  crop_organic_treatment: { en: "Organic & Bio-Control Measures", hi: "जैविक एवं प्राकृतिक उपचार" },
  crop_chemical_treatment: { en: "Recommended Chemical Solution", hi: "अनुशंसित रासायनिक उपचार" },
  crop_prevention: { en: "Preventive Agronomic Practices", hi: "फसल बचाव के मुख्य उपाय" },
  crop_kvk_disclaimer: {
    en: "AI diagnosis provides agronomic guidance. For severe crop blight, consult your nearest Krishi Vigyan Kendra (KVK).",
    hi: "यह AI जांच कृषि मार्गदर्शन के लिए है। गंभीर रोग की स्थिति में अपने नजदीकी कृषि विज्ञान केंद्र (KVK) से संपर्क करें।",
  },

  // Pashu Care
  pashu_care_title: { en: "AI Pashu Care", hi: "AI पशु सेवा" },
  pashu_care_sub: {
    en: "Intelligent herd health, ICAR balanced nutrition, and veterinary first-aid triage.",
    hi: "उन्नत पशु स्वास्थ्य, ICAR वैज्ञानिक पोषण और प्राथमिक पशु चिकित्सा मार्गदर्शन।",
  },
  pashu_feed_tab: { en: "Feed & Nutrition Formulator", hi: "संतुलित दैनिक आहार" },
  pashu_symptom_tab: { en: "Symptom Triage & First-Aid", hi: "रोग लक्षण व प्राथमिक उपचार" },
  pashu_herd_tab: { en: "My Herd Records", hi: "पशु पंजीयन व रिकॉर्ड" },
  pashu_alerts_tab: { en: "Preventive Health Alerts", hi: "टीकाकरण व डिवर्मिंग अलर्ट" },
  pashu_helpline_banner: {
    en: "24x7 National Emergency Animal Helpline: 1962 (Toll-Free)",
    hi: "24x7 राष्ट्रीय पशु आपातकालीन हेल्पलाइन: 1962 (टोल फ्री)",
  },
  pashu_listen_first_aid: { en: "Listen to First-Aid Instructions", hi: "प्राथमिक उपचार आवाज़ में सुनें" },

  // General Actions
  btn_calculate: { en: "Calculate Balanced Ration", hi: "संतुलित आहार की गणना करें" },
  btn_listen: { en: "Listen", hi: "सुनें" },
  btn_stop_audio: { en: "Stop Audio", hi: "रोकें" },
  btn_add_to_cart: { en: "Add to basket", hi: "टोकरी में डालें" },
  btn_compare: { en: "Compare", hi: "तुलना करें" },
  btn_view_details: { en: "View details", hi: "विवरण देखें" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  speakText: (text: string, forceLang?: Language) => void;
  stopAudio: () => void;
  isSpeaking: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gavyadhenu_lang", "en");
    }
    return "en";
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  const setLanguage = (lang: Language) => {
    setLanguageState("en");
    if (typeof window !== "undefined") {
      localStorage.setItem("gavyadhenu_lang", "en");
    }
  };

  const t = (key: string): string => {
    const item = DICTIONARY[key];
    if (!item) return key;
    return item.en || key;
  };

  const stopAudio = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speakText = (text: string, forceLang?: Language) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    stopAudio();

    // Clean markdown characters, emojis, and symbols for cleaner pronunciation
    const cleanText = text
      .replace(/[*#_`~>]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[✦✓✕•]/g, "")
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLang = forceLang || language;
    utterance.lang = targetLang === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = targetLang === "hi" ? 0.95 : 1.0;
    utterance.pitch = 1.0;

    // Pick best natural regional voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const match = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(targetLang === "hi" ? "hi" : "en-in") ||
          (targetLang === "hi" && (v.name.includes("Hindi") || v.name.includes("Swara")))
      );
      if (match) {
        utterance.voice = match;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        speakText,
        stopAudio,
        isSpeaking,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

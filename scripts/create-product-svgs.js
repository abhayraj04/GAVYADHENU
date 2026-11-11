import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, "../client/public/products");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function svgWrapper(content, title, badge = "100% PURE & NATURAL") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#FCF9F3"/>
      <stop offset="70%" stop-color="#F5EFE6"/>
      <stop offset="100%" stop-color="#ECE2D3"/>
    </radialGradient>
    <radialGradient id="podiumShadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(42,34,22,0.22)"/>
      <stop offset="60%" stop-color="rgba(42,34,22,0.08)"/>
      <stop offset="100%" stop-color="rgba(42,34,22,0)"/>
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5B94F"/>
      <stop offset="50%" stop-color="#C59328"/>
      <stop offset="100%" stop-color="#9A6E14"/>
    </linearGradient>
    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3D6B42"/>
      <stop offset="100%" stop-color="#1E3821"/>
    </linearGradient>
    <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#2D2316" flood-opacity="0.18"/>
    </filter>
    <filter id="deepShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="#1F1A13" flood-opacity="0.22"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="600" height="600" fill="url(#bgGlow)"/>

  <!-- Subtle organic background ring -->
  <circle cx="300" cy="290" r="220" fill="none" stroke="#E9DFC9" stroke-width="1.5" stroke-dasharray="6,6"/>

  <!-- Podium / Ground shadow -->
  <ellipse cx="300" cy="510" rx="200" ry="28" fill="url(#podiumShadow)"/>

  <!-- Main Illustration Group -->
  <g filter="url(#softShadow)">
    ${content}
  </g>

  <!-- Top Brand Stamp -->
  <g transform="translate(300, 48)">
    <rect x="-105" y="-16" width="210" height="30" rx="15" fill="#2E4A28" opacity="0.08"/>
    <text text-anchor="middle" y="5" font-family="'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" font-size="11.5" font-weight="700" letter-spacing="3" fill="#2E4A28">GAVYADHENU FARMS</text>
  </g>

  <!-- Product badge -->
  <g transform="translate(300, 552)">
    <rect x="-95" y="-15" width="190" height="30" rx="15" fill="#FFFFFF" stroke="#E5B94F" stroke-width="1.2" filter="url(#softShadow)"/>
    <circle cx="-75" cy="0" r="5" fill="#2E7D32"/>
    <text text-anchor="middle" y="4" font-family="'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" font-size="10.5" font-weight="700" letter-spacing="1.2" fill="#2D2316">${badge}</text>
  </g>
</svg>`;
}

const products = [
  {
    name: "bilona-a2-ghee.svg",
    badge: "ANCIENT BILONA METHOD",
    content: `
      <!-- Ghee Glass Jar -->
      <defs>
        <linearGradient id="jarGlass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#F2BE3B" stop-opacity="0.95"/>
          <stop offset="30%" stop-color="#FFDE6A" stop-opacity="0.98"/>
          <stop offset="70%" stop-color="#EAA620" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#C98408" stop-opacity="0.95"/>
        </linearGradient>
        <linearGradient id="woodLid" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#8C532B"/>
          <stop offset="50%" stop-color="#B87333"/>
          <stop offset="100%" stop-color="#6F3F1F"/>
        </linearGradient>
      </defs>
      
      <!-- Jar Body -->
      <path d="M210 220 L390 220 C405 220 415 235 415 255 L405 450 C405 470 388 485 365 485 L235 485 C212 485 195 470 195 450 L185 255 C185 235 195 220 210 220 Z" fill="url(#jarGlass)"/>
      
      <!-- Glass reflection highlight -->
      <path d="M215 240 L235 240 L220 465 L205 465 Z" fill="#FFFFFF" opacity="0.35"/>
      <path d="M380 240 L388 240 L378 465 L370 465 Z" fill="#FFFFFF" opacity="0.2"/>

      <!-- Inner label -->
      <rect x="220" y="275" width="160" height="150" rx="8" fill="#FBF7EC" stroke="#C59328" stroke-width="1.5"/>
      <rect x="226" y="281" width="148" height="138" rx="6" fill="none" stroke="#D3AE56" stroke-width="0.8" stroke-dasharray="3,3"/>
      
      <circle cx="300" cy="318" r="18" fill="#2E4A28"/>
      <!-- Cow / Lotus mini crest -->
      <path d="M293 322 C293 314 300 310 300 310 C300 310 307 314 307 322 C302 324 298 324 293 322 Z" fill="#E5B94F"/>
      <circle cx="300" cy="312" r="3" fill="#FFFFFF"/>
      
      <text x="300" y="352" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="12" font-weight="800" letter-spacing="1.5" fill="#2E4A28">VEDIC BILONA</text>
      <text x="300" y="369" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="16" font-weight="900" letter-spacing="0.8" fill="#B87333">A2 COW GHEE</text>
      <line x1="250" y1="378" x2="350" y2="378" stroke="#D3AE56" stroke-width="1"/>
      <text x="300" y="394" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" letter-spacing="1" fill="#4B3D2B">CURD-CHURNED • DESI GIR</text>
      <text x="300" y="408" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="600" fill="#755E3D">Slow Fire Clay Pot • 500ml</text>

      <!-- Jar Neck & Ring -->
      <rect x="225" y="195" width="150" height="25" rx="4" fill="url(#jarGlass)"/>
      <rect x="215" y="180" width="170" height="18" rx="6" fill="#8C532B" opacity="0.3"/>
      
      <!-- Wooden Lid -->
      <rect x="205" y="145" width="190" height="38" rx="10" fill="url(#woodLid)"/>
      <ellipse cx="300" cy="145" rx="95" ry="12" fill="#B87333"/>
      
      <!-- Jute Twine around neck -->
      <path d="M210 190 Q300 200 390 190" fill="none" stroke="#D4A373" stroke-width="5"/>
      <circle cx="300" cy="195" r="7" fill="#C59328"/>
      <!-- Hanging tag -->
      <path d="M300 200 L285 240 L315 240 Z" fill="#F4E8D0" stroke="#C59328" stroke-width="1"/>
      <text x="300" y="232" text-anchor="middle" font-family="sans-serif" font-size="7.5" font-weight="800" fill="#2E4A28">A2</text>
    `
  },
  {
    name: "yellow-mustard-oil.svg",
    badge: "WOOD-PRESSED • UNFILTERED",
    content: `
      <defs>
        <linearGradient id="mustardOil" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#D49300"/>
          <stop offset="40%" stop-color="#FFBF00"/>
          <stop offset="70%" stop-color="#FDB813"/>
          <stop offset="100%" stop-color="#B87A00"/>
        </linearGradient>
      </defs>
      <!-- Sleek Oil Bottle -->
      <path d="M260 170 L340 170 L350 240 L370 280 L370 480 C370 495 355 500 340 500 L260 500 C245 500 230 495 230 480 L230 280 L250 240 Z" fill="url(#mustardOil)"/>
      
      <!-- Highlights -->
      <path d="M245 285 L255 285 L250 485 L240 485 Z" fill="#FFFFFF" opacity="0.35"/>
      <path d="M355 285 L360 285 L355 485 L350 485 Z" fill="#FFFFFF" opacity="0.2"/>

      <!-- Cap -->
      <rect x="270" y="125" width="60" height="45" rx="5" fill="#3D2B1F"/>
      <line x1="270" y1="145" x2="330" y2="145" stroke="#E5B94F" stroke-width="2"/>

      <!-- Label -->
      <rect x="245" y="300" width="110" height="160" rx="6" fill="#FFFDF7" stroke="#D49300" stroke-width="1.5"/>
      <circle cx="300" cy="335" r="16" fill="#F7CA18"/>
      <!-- Mustard flower -->
      <circle cx="300" cy="330" r="4" fill="#D35400"/>
      <circle cx="295" cy="335" r="4" fill="#D35400"/>
      <circle cx="305" cy="335" r="4" fill="#D35400"/>
      <circle cx="300" cy="340" r="4" fill="#D35400"/>

      <text x="300" y="372" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="10" font-weight="800" letter-spacing="1" fill="#2E4A28">COLD PRESSED</text>
      <text x="300" y="388" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="13" font-weight="900" fill="#8C532B">YELLOW</text>
      <text x="300" y="403" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="13" font-weight="900" fill="#8C532B">MUSTARD</text>
      <text x="300" y="418" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="700" fill="#D49300">WOOD KOLHU OIL</text>
      <line x1="265" y1="426" x2="335" y2="426" stroke="#D3AE56" stroke-width="1"/>
      <text x="300" y="442" text-anchor="middle" font-family="sans-serif" font-size="7.5" font-weight="600" fill="#555">Natural Pungency • 1L</text>
    `
  },
  {
    name: "groundnut-oil.svg",
    badge: "WOOD-PRESSED • ZERO TRANS-FAT",
    content: `
      <defs>
        <linearGradient id="peanutOil" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#E29B12"/>
          <stop offset="40%" stop-color="#FCD561"/>
          <stop offset="70%" stop-color="#EAA620"/>
          <stop offset="100%" stop-color="#BD7A05"/>
        </linearGradient>
      </defs>
      <!-- Bottle -->
      <path d="M260 170 L340 170 L350 240 L370 280 L370 480 C370 495 355 500 340 500 L260 500 C245 500 230 495 230 480 L230 280 L250 240 Z" fill="url(#peanutOil)"/>
      
      <!-- Highlights -->
      <path d="M245 285 L255 285 L250 485 L240 485 Z" fill="#FFFFFF" opacity="0.35"/>

      <!-- Wooden Cap -->
      <rect x="270" y="125" width="60" height="45" rx="5" fill="#5C381E"/>

      <!-- Label -->
      <rect x="245" y="300" width="110" height="160" rx="6" fill="#FDFBF4" stroke="#B87333" stroke-width="1.5"/>
      <circle cx="300" cy="335" r="16" fill="#E8D5B5"/>
      <!-- Peanut silhouette -->
      <path d="M294 330 C294 325 306 325 306 330 C306 335 303 335 303 338 C303 341 307 342 307 346 C307 350 293 350 293 346 C293 342 297 341 297 338 C297 335 294 335 294 330 Z" fill="#9E6838"/>

      <text x="300" y="372" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="10" font-weight="800" letter-spacing="1" fill="#2E4A28">WOOD PRESSED</text>
      <text x="300" y="390" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="14" font-weight="900" fill="#8C532B">GROUNDNUT</text>
      <text x="300" y="405" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#B87333">ORGANIC OIL</text>
      <line x1="265" y1="416" x2="335" y2="416" stroke="#B87333" stroke-width="1"/>
      <text x="300" y="432" text-anchor="middle" font-family="sans-serif" font-size="7.5" font-weight="600" fill="#555">Saurashtra Peanuts</text>
      <text x="300" y="445" text-anchor="middle" font-family="sans-serif" font-size="7.5" font-weight="600" fill="#555">Cold Extracted • 1L</text>
    `
  },
  {
    name: "wildflower-honey.svg",
    badge: "RAW • UNPASTEURIZED • UNFILTERED",
    content: `
      <defs>
        <linearGradient id="honeyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#C67D0A"/>
          <stop offset="40%" stop-color="#F2A900"/>
          <stop offset="70%" stop-color="#E59400"/>
          <stop offset="100%" stop-color="#9C5B00"/>
        </linearGradient>
      </defs>
      <!-- Hexagonal Honey Jar -->
      <path d="M225 240 L375 240 L400 330 L380 470 C380 485 365 490 350 490 L250 490 C235 490 220 485 220 470 L200 330 Z" fill="url(#honeyGrad)"/>

      <!-- Reflection -->
      <path d="M225 255 L240 255 L230 465 L220 465 Z" fill="#FFFFFF" opacity="0.3"/>

      <!-- Wooden Jar Lid -->
      <rect x="220" y="195" width="160" height="45" rx="10" fill="#6B4423"/>
      <ellipse cx="300" cy="195" rx="80" ry="10" fill="#8C5A2B"/>

      <!-- Dipper sticking out -->
      <line x1="360" y1="140" x2="440" y2="280" stroke="#8C5A2B" stroke-width="8" stroke-linecap="round"/>
      <ellipse cx="420" cy="245" rx="15" ry="20" fill="#8C5A2B" transform="rotate(30 420 245)"/>
      <path d="M425 260 Q430 290 425 310" fill="none" stroke="#F2A900" stroke-width="4" stroke-linecap="round"/>

      <!-- Label -->
      <polygon points="250,290 350,290 370,350 350,430 250,430 230,350" fill="#FFFDF8" stroke="#D3AE56" stroke-width="1.5"/>
      <circle cx="300" cy="330" r="16" fill="#FBEAA8"/>
      <!-- Bee symbol -->
      <ellipse cx="300" cy="330" rx="9" ry="6" fill="#3D2B1F"/>
      <line x1="295" y1="326" x2="295" y2="334" stroke="#F2A900" stroke-width="2"/>
      <line x1="302" y1="326" x2="302" y2="334" stroke="#F2A900" stroke-width="2"/>

      <text x="300" y="362" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="10" font-weight="800" fill="#2E4A28">RAW &amp; WILD</text>
      <text x="300" y="378" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="13" font-weight="900" fill="#9C5B00">FOREST HONEY</text>
      <text x="300" y="394" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="700" fill="#555">MULTI-FLORA NECTAR</text>
      <text x="300" y="408" text-anchor="middle" font-family="sans-serif" font-size="7.5" font-weight="600" fill="#777">Pure Unfiltered • 250g</text>
    `
  },
  {
    name: "golden-haldi-ritual.svg",
    badge: "7.8% CURCUMIN • LAB VERIFIED",
    content: `
      <defs>
        <linearGradient id="pouchHaldi" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#EAA620"/>
          <stop offset="50%" stop-color="#D48806"/>
          <stop offset="100%" stop-color="#9C5B00"/>
        </linearGradient>
      </defs>
      <!-- Standup Kraft Pouch -->
      <path d="M220 190 L380 190 L400 460 C400 480 375 490 350 490 L250 490 C225 490 200 480 200 460 Z" fill="#DDB872"/>
      <path d="M225 190 L375 190 L390 455 C390 475 370 485 345 485 L255 485 C230 485 210 475 210 455 Z" fill="#ECC98A"/>

      <!-- Pouch notch and seal line -->
      <line x1="215" y1="225" x2="385" y2="225" stroke="#B87333" stroke-width="1.5" stroke-dasharray="4,3"/>
      <circle cx="215" cy="225" r="3" fill="#B87333"/>
      <circle cx="385" cy="225" r="3" fill="#B87333"/>

      <!-- Center Gold Label -->
      <rect x="235" y="255" width="130" height="185" rx="8" fill="#FFFDF8" stroke="#C59328" stroke-width="1.5"/>
      <circle cx="300" cy="295" r="18" fill="#F8B800"/>
      <!-- Turmeric rhizome -->
      <ellipse cx="300" cy="295" rx="12" ry="7" fill="#C67D0A" transform="rotate(-15 300 295)"/>
      
      <text x="300" y="332" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="10" font-weight="800" fill="#2E4A28">HIGH CURCUMIN</text>
      <text x="300" y="350" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="14" font-weight="900" fill="#B87333">LAKADONG</text>
      <text x="300" y="366" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="14" font-weight="900" fill="#B87333">TURMERIC</text>
      <rect x="255" y="375" width="90" height="18" rx="4" fill="#E5B94F"/>
      <text x="300" y="388" text-anchor="middle" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#2D2316">7.8% CURCUMIN</text>
      <text x="300" y="410" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="600" fill="#666">Jaintia Hills Origin</text>
      <text x="300" y="424" text-anchor="middle" font-family="sans-serif" font-size="7.5" font-weight="600" fill="#888">Net Wt. 100g</text>
    `
  },
  {
    name: "farmstead-makhana.svg",
    badge: "NATURALLY GROWN • ROASTED",
    content: `
      <!-- Snack Pouch -->
      <path d="M220 180 L380 180 L400 460 C400 480 375 490 350 490 L250 490 C225 490 200 480 200 460 Z" fill="#264653"/>
      <path d="M225 180 L375 180 L392 455 C392 475 370 485 345 485 L255 485 C230 485 208 475 208 455 Z" fill="#2A9D8F"/>

      <!-- Seal top -->
      <line x1="215" y1="215" x2="385" y2="215" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="2"/>

      <!-- Front Window / Label -->
      <rect x="235" y="240" width="130" height="205" rx="10" fill="#FFFFFF"/>
      <circle cx="300" cy="285" r="22" fill="#E76F51" opacity="0.15"/>
      <text x="300" y="275" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="800" fill="#E76F51" letter-spacing="1">SLOW ROASTED</text>
      <text x="300" y="295" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="14" font-weight="900" fill="#264653">FARMSTEAD</text>
      <text x="300" y="312" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="15" font-weight="900" fill="#E76F51">MAKHANA</text>

      <!-- Makhana illustration balls -->
      <g transform="translate(300, 360)">
        <circle cx="-25" cy="5" r="14" fill="#F8F5EE" stroke="#E2DCCE" stroke-width="1.5"/>
        <circle cx="20" cy="0" r="16" fill="#FFFFFF" stroke="#E2DCCE" stroke-width="1.5"/>
        <circle cx="0" cy="-12" r="15" fill="#FAF7F0" stroke="#E2DCCE" stroke-width="1.5"/>
        <!-- roasted spots -->
        <circle cx="2" cy="-10" r="2" fill="#B58348"/>
        <circle cx="22" cy="2" r="2.5" fill="#B58348"/>
        <circle cx="-24" cy="7" r="2" fill="#B58348"/>
      </g>
      <text x="300" y="405" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="700" fill="#264653">HIGH PROTEIN • JUMBO</text>
      <text x="300" y="420" text-anchor="middle" font-family="sans-serif" font-size="7.5" font-weight="600" fill="#888">Mithila Wetlands • 250g</text>
    `
  },
  {
    name: "mp-sharbati-wheat-flour.svg",
    badge: "SLOW CHAKKI STONE-GROUND",
    content: `
      <!-- Jute Flour Sack -->
      <path d="M210 230 C210 210 230 200 300 200 C370 200 390 210 390 230 L405 450 C405 480 375 490 300 490 C225 490 195 480 195 450 Z" fill="#D4AF77"/>
      <path d="M215 235 C215 215 235 205 300 205 C365 205 385 215 385 235 L398 445 C398 475 370 485 300 485 C230 485 202 475 202 445 Z" fill="#E2C496"/>

      <!-- Sack tied mouth -->
      <path d="M250 170 Q300 195 350 170 Q360 210 350 215 Q300 205 250 215 Z" fill="#C59B63"/>
      <ellipse cx="300" cy="180" rx="45" ry="12" fill="#A87F4A"/>
      <!-- Rope tie -->
      <line x1="260" y1="210" x2="340" y2="210" stroke="#7A5229" stroke-width="4"/>

      <!-- Label Stamped on Bag -->
      <rect x="235" y="260" width="130" height="175" rx="6" fill="#FDFBF7" stroke="#A87F4A" stroke-width="1.2"/>
      
      <!-- Wheat stalk -->
      <g transform="translate(300, 295)">
        <line x1="0" y1="-15" x2="0" y2="15" stroke="#C59328" stroke-width="2"/>
        <ellipse cx="-4" cy="-10" rx="3" ry="6" fill="#D4AF37" transform="rotate(-30 -4 -10)"/>
        <ellipse cx="4" cy="-6" rx="3" ry="6" fill="#D4AF37" transform="rotate(30 4 -6)"/>
        <ellipse cx="-4" cy="-2" rx="3" ry="6" fill="#D4AF37" transform="rotate(-30 -4 -2)"/>
        <ellipse cx="4" cy="2" rx="3" ry="6" fill="#D4AF37" transform="rotate(30 4 2)"/>
      </g>

      <text x="300" y="335" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="10" font-weight="800" fill="#2E4A28">MP SEHORE</text>
      <text x="300" y="355" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="14" font-weight="900" fill="#7A5229">SHARBATI</text>
      <text x="300" y="372" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="12" font-weight="800" fill="#C59328">WHEAT FLOUR</text>
      <line x1="260" y1="382" x2="340" y2="382" stroke="#E2C496" stroke-width="1"/>
      <text x="300" y="398" text-anchor="middle" font-family="sans-serif" font-size="7.5" font-weight="700" fill="#444">100% WHOLE GRAIN CHAKKI</text>
      <text x="300" y="412" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="600" fill="#888">Rich In Fibre • 5 kg</text>
    `
  },
  {
    name: "sattu-powder.svg",
    badge: "100% DESI CHANA • STONE-GROUND",
    content: `
      <!-- Pouch -->
      <path d="M220 190 L380 190 L400 460 C400 480 375 490 350 490 L250 490 C225 490 200 480 200 460 Z" fill="#C87D55"/>
      <path d="M225 190 L375 190 L390 455 C390 475 370 485 345 485 L255 485 C230 485 210 475 210 455 Z" fill="#D8926C"/>

      <line x1="215" y1="225" x2="385" y2="225" stroke="#9E5632" stroke-width="1.5" stroke-dasharray="4,3"/>

      <!-- Label -->
      <rect x="235" y="255" width="130" height="185" rx="8" fill="#FFFDF8" stroke="#9E5632" stroke-width="1.5"/>
      <circle cx="300" cy="295" r="18" fill="#E8A766"/>
      <circle cx="295" cy="295" r="5" fill="#7A4322"/>
      <circle cx="305" cy="295" r="5" fill="#7A4322"/>

      <text x="300" y="332" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="10" font-weight="800" fill="#2E4A28">BIHAR TRADITIONAL</text>
      <text x="300" y="352" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="15" font-weight="900" fill="#9E5632">ROASTED</text>
      <text x="300" y="370" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="15" font-weight="900" fill="#9E5632">CHANA SATTU</text>
      <rect x="255" y="380" width="90" height="18" rx="4" fill="#E8A766"/>
      <text x="300" y="393" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="800" fill="#4B2713">HIGH PLANT PROTEIN</text>
      <text x="300" y="415" text-anchor="middle" font-family="sans-serif" font-size="7.5" font-weight="600" fill="#666">Instant Energy Drink</text>
      <text x="300" y="428" text-anchor="middle" font-family="sans-serif" font-size="7.5" font-weight="600" fill="#888">Net Wt. 1 kg</text>
    `
  },
  {
    name: "earthen-candle.svg",
    badge: "SOY WAX • PURE ESSENTIAL OILS",
    content: `
      <!-- Terracotta Pot Bowl -->
      <path d="M190 320 C190 440 230 480 300 480 C370 480 410 440 410 320 Z" fill="#B2533E"/>
      <ellipse cx="300" cy="320" rx="110" ry="25" fill="#CD6E58"/>

      <!-- Wax inside -->
      <ellipse cx="300" cy="322" rx="98" ry="20" fill="#FBF6EA"/>

      <!-- Candle Wick & Flame -->
      <line x1="300" y1="320" x2="300" y2="280" stroke="#3D2B1F" stroke-width="3"/>
      
      <!-- Flame -->
      <path d="M300 240 C312 265 315 285 300 295 C285 285 288 265 300 240 Z" fill="#FFA500"/>
      <path d="M300 255 C306 270 308 282 300 290 C292 282 294 270 300 255 Z" fill="#FFEAA7"/>

      <!-- Pot details -->
      <ellipse cx="300" cy="355" rx="85" ry="12" fill="none" stroke="#8A3423" stroke-width="2"/>

      <!-- Mini Crest Tag on terracotta -->
      <rect x="250" y="380" width="100" height="45" rx="6" fill="#FDF8EE" stroke="#CD6E58" stroke-width="1"/>
      <text x="300" y="398" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="9" font-weight="800" fill="#2E4A28">EARTHEN SOY</text>
      <text x="300" y="412" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="700" fill="#B2533E">CEDAR &amp; VETIVER</text>
    `
  },
  {
    name: "pashu-starter-pack.svg",
    badge: "AYURVEDIC CATTLE CARE",
    content: `
      <!-- Box Kit -->
      <rect x="180" y="220" width="240" height="250" rx="12" fill="#2E4A28"/>
      <rect x="190" y="230" width="220" height="230" rx="8" fill="#3D6435"/>

      <!-- Spray Bottle sticking up on right -->
      <rect x="330" y="160" width="45" height="110" rx="6" fill="#E5B94F"/>
      <rect x="340" y="140" width="25" height="22" fill="#2E4A28"/>
      <path d="M340 140 L315 130 L315 145 Z" fill="#2E4A28"/>

      <!-- Salt lick rock -->
      <polygon points="215,220 255,180 285,200 265,240" fill="#E89B88"/>

      <!-- Front Kit Label -->
      <rect x="210" y="280" width="180" height="150" rx="8" fill="#FBF7EC"/>
      <circle cx="300" cy="315" r="16" fill="#2E4A28"/>
      <path d="M293 318 C293 310 300 308 300 308 C300 308 307 310 307 318 Z" fill="#E5B94F"/>

      <text x="300" y="350" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="12" font-weight="900" fill="#2E4A28">PASHU RAKSHA</text>
      <text x="300" y="366" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#B87333">HERBAL LIVESTOCK PACK</text>
      <line x1="230" y1="375" x2="370" y2="375" stroke="#D3AE56" stroke-width="1"/>
      <text x="300" y="392" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="600" fill="#444">Herbal Spray • Mineral Lick</text>
      <text x="300" y="406" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="600" fill="#444">Neem Antiseptic Balm</text>
    `
  },
  {
    name: "quiet-morning-brew.svg",
    badge: "TRIPLE TULSI • CAFFEINE FREE",
    content: `
      <!-- Botanical Tea Tin -->
      <rect x="220" y="210" width="160" height="260" rx="14" fill="#3A5A40"/>
      <rect x="210" y="170" width="180" height="42" rx="8" fill="#588157"/>

      <!-- Label -->
      <rect x="235" y="235" width="130" height="210" rx="8" fill="#FAF5E9" stroke="#C59328" stroke-width="1.2"/>
      
      <!-- Tulsi Leaf -->
      <g transform="translate(300, 280)">
        <ellipse cx="-8" cy="-5" rx="8" ry="14" fill="#588157" transform="rotate(-30 -8 -5)"/>
        <ellipse cx="8" cy="-5" rx="8" ry="14" fill="#3A5A40" transform="rotate(30 8 -5)"/>
        <ellipse cx="0" cy="-14" rx="7" ry="12" fill="#588157"/>
        <line x1="0" y1="0" x2="0" y2="15" stroke="#3A5A40" stroke-width="2"/>
      </g>

      <text x="300" y="325" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="10" font-weight="800" fill="#C59328">AYURVEDIC WELLNESS</text>
      <text x="300" y="345" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="14" font-weight="900" fill="#3A5A40">QUIET MORNING</text>
      <text x="300" y="362" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="13" font-weight="800" fill="#588157">TULSI BREW</text>
      <line x1="255" y1="372" x2="345" y2="372" stroke="#E2C496" stroke-width="1"/>
      <text x="300" y="390" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="700" fill="#444">Krishna • Rama • Vana Tulsi</text>
      <text x="300" y="405" text-anchor="middle" font-family="sans-serif" font-size="7.5" font-weight="600" fill="#777">Green Cardamom Blend</text>
      <text x="300" y="420" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="700" fill="#3A5A40">40 Pyramid Bags</text>
    `
  },
  {
    name: "the-living-gift-box.svg",
    badge: "FESTIVE HARVEST EDITION",
    content: `
      <!-- Luxury Hamper Box -->
      <rect x="170" y="250" width="260" height="220" rx="10" fill="#78350F"/>
      <!-- Wooden Lid Rim -->
      <rect x="160" y="215" width="280" height="40" rx="6" fill="#92400E"/>

      <!-- Festive Golden Ribbon -->
      <rect x="285" y="215" width="30" height="255" fill="#E5B94F"/>
      <!-- Ribbon Bow -->
      <ellipse cx="280" cy="205" rx="20" ry="12" fill="#FBBF24" transform="rotate(-20 280 205)"/>
      <ellipse cx="320" cy="205" rx="20" ry="12" fill="#FBBF24" transform="rotate(20 320 205)"/>
      <circle cx="300" cy="205" r="9" fill="#D97706"/>

      <!-- Brass Latch -->
      <rect x="290" y="250" width="20" height="25" rx="3" fill="#D97706" stroke="#FEF3C7" stroke-width="1"/>

      <!-- Hamper Emblem Plaque -->
      <rect x="200" y="315" width="200" height="110" rx="8" fill="#FFFDF8" stroke="#D97706" stroke-width="1.5"/>
      <text x="300" y="345" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="11" font-weight="800" fill="#2E4A28">THE LIVING FARM</text>
      <text x="300" y="365" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="15" font-weight="900" fill="#92400E">GIFT HAMPER</text>
      <line x1="240" y1="375" x2="360" y2="375" stroke="#D97706" stroke-width="1"/>
      <text x="300" y="392" text-anchor="middle" font-family="sans-serif" font-size="8.5" font-weight="700" fill="#555">Bilona Ghee • Honey • Haldi • Clay Diya</text>
      <text x="300" y="408" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="600" fill="#78350F">Handcrafted Teak Finish</text>
    `
  },
  {
    name: "wood-ash-cleaner.svg",
    badge: "100% NATURAL • ZERO CHEMICALS",
    content: `
      <!-- Ash Canister -->
      <path d="M225 210 L375 210 L385 460 C385 480 370 490 350 490 L250 490 C230 490 215 480 215 460 Z" fill="#6B7280"/>
      <path d="M230 210 L370 210 L380 455 C380 475 365 485 345 485 L255 485 C235 485 220 475 220 455 Z" fill="#9CA3AF"/>

      <!-- Shaker Cap -->
      <rect x="235" y="165" width="130" height="45" rx="6" fill="#4B5563"/>
      <circle cx="270" cy="185" r="4" fill="#374151"/>
      <circle cx="300" cy="185" r="4" fill="#374151"/>
      <circle cx="330" cy="185" r="4" fill="#374151"/>

      <!-- Label -->
      <rect x="240" y="245" width="120" height="185" rx="8" fill="#F9FAFB" stroke="#4B5563" stroke-width="1.2"/>
      <circle cx="300" cy="285" r="18" fill="#E5E7EB"/>
      <circle cx="300" cy="285" r="10" fill="#FBBF24"/>
      <!-- Lemon slice icon -->
      <path d="M300 275 A10 10 0 0 1 300 295 Z" fill="#F59E0B"/>

      <text x="300" y="325" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="10" font-weight="800" fill="#2E4A28">SACRED COW DUNG</text>
      <text x="300" y="342" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="13" font-weight="900" fill="#1F2937">WOOD ASH</text>
      <text x="300" y="358" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="12" font-weight="800" fill="#4B5563">DISH CLEANER</text>
      <line x1="255" y1="368" x2="345" y2="368" stroke="#D1D5DB" stroke-width="1"/>
      <text x="300" y="386" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="700" fill="#059669">Neem &amp; Lemon Oil Infused</text>
      <text x="300" y="400" text-anchor="middle" font-family="sans-serif" font-size="7.5" font-weight="600" fill="#6B7280">Sparkling Brass &amp; Copper</text>
      <text x="300" y="415" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="700" fill="#111827">250g Shaker Pack</text>
    `
  },
  {
    name: "coconut-scrubber.svg",
    badge: "100% BIODEGRADABLE COIR",
    content: `
      <!-- Coir Scrubbers Stack -->
      <g transform="translate(300, 360)">
        <!-- Bottom pad -->
        <ellipse cx="0" cy="60" rx="110" ry="35" fill="#8D5B28" stroke="#6F4217" stroke-width="3"/>
        <ellipse cx="0" cy="55" rx="105" ry="30" fill="#A86E35"/>

        <!-- Middle pad -->
        <ellipse cx="-10" cy="15" rx="110" ry="35" fill="#8D5B28" stroke="#6F4217" stroke-width="3"/>
        <ellipse cx="-10" cy="10" rx="105" ry="30" fill="#B97E43"/>

        <!-- Top pad -->
        <ellipse cx="10" cy="-35" rx="110" ry="35" fill="#8D5B28" stroke="#6F4217" stroke-width="3"/>
        <ellipse cx="10" cy="-40" rx="105" ry="30" fill="#C98F53"/>

        <!-- Coir fiber texture dashes -->
        <line x1="-60" y1="-45" x2="-30" y2="-40" stroke="#7A4B1F" stroke-width="2"/>
        <line x1="20" y1="-50" x2="50" y2="-45" stroke="#7A4B1F" stroke-width="2"/>
        <line x1="-20" y1="-30" x2="10" y2="-32" stroke="#7A4B1F" stroke-width="2"/>
        <line x1="50" y1="-35" x2="80" y2="-30" stroke="#7A4B1F" stroke-width="2"/>

        <!-- Jute tie rope around the pack -->
        <line x1="-30" y1="-70" x2="-30" y2="85" stroke="#523214" stroke-width="4"/>
        <line x1="30" y1="-70" x2="30" y2="85" stroke="#523214" stroke-width="4"/>
        <!-- Tie bow -->
        <circle cx="0" cy="-60" r="7" fill="#6F4217"/>
      </g>

      <!-- Hanging Eco Stamp -->
      <rect x="235" y="160" width="130" height="65" rx="8" fill="#FDFBF7" stroke="#8D5B28" stroke-width="1.2"/>
      <text x="300" y="182" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="10" font-weight="800" fill="#2E4A28">ORGANIC KERALA</text>
      <text x="300" y="198" text-anchor="middle" font-family="'Plus Jakarta Sans', serif" font-size="13" font-weight="900" fill="#8D5B28">COCONUT COIR</text>
      <text x="300" y="212" text-anchor="middle" font-family="sans-serif" font-size="7.5" font-weight="700" fill="#059669">Pack of 3 • Non-Scratch</text>
    `
  }
];

for (const p of products) {
  const filePath = path.join(outDir, p.name);
  const fullSvg = svgWrapper(p.content, p.name, p.badge);
  fs.writeFileSync(filePath, fullSvg, "utf8");
  console.log(`Generated: ${p.name}`);
}

console.log(`Successfully generated all ${products.length} product images in ${outDir}`);

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, "../client/public/products");

// Master SVG template that matches the exact photo reference:
// - Soft warm studio lighting with radial gradient
// - Brass vessel & soft leaves in the background
// - Rustic dark wooden plank table in foreground
// - Clear glass jar with cylindrical lighting & specular reflections
// - Metallic gold screw-on lid with radial highlights
// - Vintage cream parchment label with royal ornate Indian borders & GAVYADHENU crest
// - Hanging card tag tied to jar neck with twisted golden jute twine rope
// - Detailed foreground ingredients & stone chakki or wooden churner
function renderMasterProductPackaging({
  fileName,
  productTitle1,
  productTitle2,
  subtitle,
  categoryBadge,
  fillColor,
  powderTexture,
  tagLabel,
  foregroundArt,
  accentColor = "#C47D2B",
  labelColor = "#FAF5E8",
  textColor = "#193826"
}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <!-- Background studio warm lighting -->
    <radialGradient id="studioBg" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#EFE3CF"/>
      <stop offset="45%" stop-color="#DFCCA8"/>
      <stop offset="85%" stop-color="#BEA67C"/>
      <stop offset="100%" stop-color="#9E855A"/>
    </radialGradient>

    <!-- Rustic wooden table -->
    <linearGradient id="woodTable" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6F4827"/>
      <stop offset="25%" stop-color="#553419"/>
      <stop offset="65%" stop-color="#3D230E"/>
      <stop offset="100%" stop-color="#261405"/>
    </linearGradient>

    <!-- Metallic Gold Lid Gradient -->
    <linearGradient id="goldLidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C2943A"/>
      <stop offset="15%" stop-color="#E8C36A"/>
      <stop offset="35%" stop-color="#FFF3C4"/>
      <stop offset="55%" stop-color="#DFC06A"/>
      <stop offset="80%" stop-color="#AC7A28"/>
      <stop offset="100%" stop-color="#7D5213"/>
    </linearGradient>

    <!-- Metallic Gold Rim -->
    <linearGradient id="goldRim" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFF0B3"/>
      <stop offset="50%" stop-color="#D4A745"/>
      <stop offset="100%" stop-color="#8C5C12"/>
    </linearGradient>

    <!-- Glass Cylindrical Shading -->
    <linearGradient id="glassShade" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.7)"/>
      <stop offset="8%" stop-color="rgba(255,255,255,0.2)"/>
      <stop offset="20%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="75%" stop-color="rgba(0,0,0,0.08)"/>
      <stop offset="92%" stop-color="rgba(255,255,255,0.15)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.5)"/>
    </linearGradient>

    <!-- Parchment Label Texture -->
    <linearGradient id="parchmentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF7"/>
      <stop offset="50%" stop-color="${labelColor}"/>
      <stop offset="100%" stop-color="#F2E6CD"/>
    </linearGradient>

    <!-- Drop Shadows -->
    <filter id="jarShadow" x="-20%" y="-10%" width="140%" height="130%">
      <feDropShadow dx="0" dy="24" stdDeviation="20" flood-color="#1A0F05" flood-opacity="0.5"/>
    </filter>
    <filter id="tagShadow" x="-30%" y="-20%" width="160%" height="150%">
      <feDropShadow dx="4" dy="8" stdDeviation="6" flood-color="#1A0F05" flood-opacity="0.35"/>
    </filter>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- 1. Background Scene -->
  <rect width="800" height="800" fill="url(#studioBg)"/>

  <!-- Background Brass Kalash (Blurred out of focus in top left) -->
  <g opacity="0.35" transform="translate(60, 60)">
    <ellipse cx="60" cy="180" rx="45" ry="70" fill="#B8860B"/>
    <ellipse cx="60" cy="110" rx="25" ry="12" fill="#DAA520"/>
    <path d="M45 110 L75 110 L85 70 L35 70 Z" fill="#B8860B"/>
    <ellipse cx="60" cy="70" rx="35" ry="10" fill="#FFD700"/>
    <!-- Coconut & Mango leaves on kalash -->
    <circle cx="60" cy="45" r="22" fill="#6B4423"/>
    <path d="M60 45 L35 15 M60 45 L85 15 M60 45 L60 5" stroke="#2D5A27" stroke-width="6" stroke-linecap="round"/>
  </g>

  <!-- Background Green Botanical Sprig (Top Right) -->
  <g opacity="0.4" transform="translate(680, 100)">
    <path d="M0 120 Q-20 40 40 0" fill="none" stroke="#2D5A27" stroke-width="3"/>
    <ellipse cx="10" cy="80" rx="18" ry="8" fill="#3D7434" transform="rotate(-30 10 80)"/>
    <ellipse cx="-15" cy="50" rx="18" ry="8" fill="#3D7434" transform="rotate(20 -15 50)"/>
    <ellipse cx="25" cy="20" rx="16" ry="7" fill="#4B8C3E" transform="rotate(-40 25 20)"/>
  </g>

  <!-- 2. Rustic Wooden Table (Perspective Plank) -->
  <path d="M0 540 L800 540 L800 800 L0 800 Z" fill="url(#woodTable)"/>
  <!-- Table wood grain grooves -->
  <line x1="0" y1="580" x2="800" y2="580" stroke="#1D0E04" stroke-width="1.5" opacity="0.6"/>
  <line x1="0" y1="635" x2="800" y2="635" stroke="#1D0E04" stroke-width="2" opacity="0.7"/>
  <line x1="0" y1="710" x2="800" y2="710" stroke="#1D0E04" stroke-width="2.5" opacity="0.8"/>
  <ellipse cx="400" cy="545" rx="380" ry="8" fill="rgba(255,255,255,0.06)"/>

  <!-- Shadow under the Jar -->
  <ellipse cx="400" cy="695" rx="190" ry="32" fill="rgba(15,8,3,0.6)" filter="url(#glow)"/>

  <!-- 3. Glass Jar & Product Fill -->
  <g filter="url(#jarShadow)">
    <!-- Jar Body Base Fill -->
    <path d="M255 240 L545 240 C570 240 585 260 585 290 L575 660 C575 685 550 705 515 705 L285 705 C250 705 225 685 225 660 L215 290 C215 260 230 240 255 240 Z" fill="${fillColor}"/>
    
    <!-- Powder / Liquid Depth Texture Overlay -->
    ${powderTexture}

    <!-- Glass Cylindrical Reflection Overlay -->
    <path d="M255 240 L545 240 C570 240 585 260 585 290 L575 660 C575 685 550 705 515 705 L285 705 C250 705 225 685 225 660 L215 290 C215 260 230 240 255 240 Z" fill="url(#glassShade)"/>

    <!-- Sharp Glass Highlights (Left & Right) -->
    <path d="M245 270 L268 270 L252 675 L235 675 Z" fill="#FFFFFF" opacity="0.5"/>
    <path d="M555 270 L565 270 L550 675 L542 675 Z" fill="#FFFFFF" opacity="0.25"/>

    <!-- 4. Vintage Ornate Parchment Main Label -->
    <g transform="translate(260, 310)">
      <!-- Label Background -->
      <rect x="0" y="0" width="280" height="340" rx="16" fill="url(#parchmentGrad)" stroke="#B8860B" stroke-width="2.5"/>
      <!-- Inner Ornate Border -->
      <rect x="8" y="8" width="264" height="324" rx="12" fill="none" stroke="#C59328" stroke-width="1.2" stroke-dasharray="6,3"/>
      <!-- Corner Flourishes -->
      <path d="M12 28 C24 28 28 24 28 12 M268 28 C256 28 252 24 252 12 M12 312 C24 312 28 316 28 328 M268 312 C256 312 252 316 252 328" fill="none" stroke="#B8860B" stroke-width="1.8"/>

      <!-- Top Holy Cow & Sunburst Emblem -->
      <g transform="translate(140, 50)">
        <!-- Sunburst rays -->
        <circle cx="0" cy="0" r="28" fill="#FDF3D6" stroke="#D4AF37" stroke-width="1"/>
        <path d="M0 -34 L0 -29 M24 -24 L20 -20 M34 0 L29 0 M24 24 L20 20 M0 34 L0 29 M-24 24 L-20 20 M-34 0 L-29 0 M-24 -24 L-20 -20" stroke="#C47D2B" stroke-width="1.5"/>
        <!-- Kamadhenu Cow Icon -->
        <ellipse cx="0" cy="3" rx="15" ry="10" fill="#2E4A28"/>
        <circle cx="-10" cy="-3" r="6" fill="#2E4A28"/>
        <path d="M-14 -6 L-17 -12 L-11 -8 Z" fill="#D4AF37"/>
        <ellipse cx="0" cy="3" rx="11" ry="7" fill="#FBF7EE"/>
        <!-- Calf silhouette -->
        <circle cx="5" cy="5" r="4" fill="#2E4A28"/>
      </g>

      <!-- Brand Name -->
      <text x="140" y="98" text-anchor="middle" font-family="'DM Serif Display', Georgia, serif" font-size="18" font-weight="900" letter-spacing="2.5" fill="#193826">GAVYADHENU</text>
      <text x="140" y="112" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="7.5" font-weight="700" letter-spacing="1.2" fill="#8C532B">CELEBRATING BHARAT'S TIMELESS FLAVOURS</text>

      <!-- Decorative Divider -->
      <line x1="45" y1="122" x2="235" y2="122" stroke="#D4AF37" stroke-width="1"/>
      <polygon points="140,119 144,122 140,125 136,122" fill="#C47D2B"/>

      <!-- Product Calligraphy Title -->
      <text x="140" y="152" text-anchor="middle" font-family="'DM Serif Display', Georgia, serif" font-size="22" font-weight="900" font-style="italic" fill="${accentColor}">${productTitle1}</text>
      <text x="140" y="174" text-anchor="middle" font-family="'DM Serif Display', Georgia, serif" font-size="18" font-weight="800" letter-spacing="1" fill="#193826">${productTitle2}</text>

      <!-- Stone Ground / Method Pill -->
      <g transform="translate(140, 196)">
        <rect x="-80" y="-12" width="160" height="24" rx="12" fill="#193826"/>
        <text text-anchor="middle" y="4" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="8.5" font-weight="800" letter-spacing="1.2" fill="#F5EFE0">${categoryBadge}</text>
      </g>

      <!-- Vignette Traditional Scene Art inside Label -->
      <g transform="translate(140, 260)">
        <!-- Stone Chakki / Mortar Vignette -->
        <ellipse cx="0" cy="18" rx="42" ry="14" fill="#8C7A6B" stroke="#5E4E42" stroke-width="1.2"/>
        <ellipse cx="0" cy="10" rx="38" ry="12" fill="#AA9887" stroke="#5E4E42" stroke-width="1"/>
        <rect x="-4" y="-14" width="8" height="22" rx="2" fill="#4A3B32"/>
        <!-- Ground spice mound in front -->
        <ellipse cx="18" cy="22" rx="20" ry="10" fill="${fillColor}" stroke="#5E4E42" stroke-width="0.8"/>
        <path d="M4 22 Q18 8 32 22 Z" fill="${fillColor}"/>
      </g>

      <text x="140" y="318" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="7.5" font-weight="700" letter-spacing="0.8" fill="#576759">${subtitle}</text>
    </g>

    <!-- 5. Jar Neck & Thread -->
    <path d="M275 200 L525 200 L535 240 L265 240 Z" fill="${fillColor}" opacity="0.9"/>
    <rect x="270" y="210" width="260" height="8" fill="rgba(255,255,255,0.2)"/>

    <!-- 6. Metallic Gold Screw Lid -->
    <g transform="translate(400, 160)">
      <!-- Main Lid Cylinder -->
      <rect x="-160" y="0" width="320" height="48" rx="8" fill="url(#goldLidGrad)" stroke="#7D5213" stroke-width="1.5"/>
      <!-- Lid Top Oval Bevel -->
      <ellipse cx="0" cy="0" rx="160" ry="24" fill="url(#goldRim)"/>
      <ellipse cx="0" cy="-2" rx="152" ry="20" fill="url(#goldLidGrad)"/>
      
      <!-- Brand Logo on Gold Lid -->
      <g transform="translate(0, -2)">
        <ellipse cx="0" cy="0" rx="45" ry="12" fill="#FAF5E8" stroke="#7D5213" stroke-width="1"/>
        <text text-anchor="middle" y="3" font-family="'DM Serif Display', Georgia, serif" font-size="9" font-weight="900" letter-spacing="1.5" fill="#193826">GAVYADHENU</text>
      </g>

      <!-- Vertical Lid Knurl Grips -->
      <line x1="-140" y1="12" x2="-140" y2="40" stroke="#FFF" stroke-width="1" opacity="0.4"/>
      <line x1="-100" y1="12" x2="-100" y2="40" stroke="#7D5213" stroke-width="1" opacity="0.4"/>
      <line x1="-50" y1="12" x2="-50" y2="40" stroke="#FFF" stroke-width="1" opacity="0.4"/>
      <line x1="0" y1="12" x2="0" y2="40" stroke="#7D5213" stroke-width="1" opacity="0.4"/>
      <line x1="50" y1="12" x2="50" y2="40" stroke="#FFF" stroke-width="1" opacity="0.4"/>
      <line x1="100" y1="12" x2="100" y2="40" stroke="#7D5213" stroke-width="1" opacity="0.4"/>
      <line x1="140" y1="12" x2="140" y2="40" stroke="#7D5213" stroke-width="1" opacity="0.4"/>
    </g>

    <!-- 7. Hanging Tag with Rustic Jute Twine Rope -->
    <!-- Jute rope tied around jar neck -->
    <path d="M280 220 Q400 232 520 220" fill="none" stroke="#B8860B" stroke-width="4.5"/>
    <path d="M280 220 Q400 232 520 220" fill="none" stroke="#D2B48C" stroke-width="2" stroke-dasharray="4,2"/>
    
    <!-- Rope knot & dangling string -->
    <circle cx="510" cy="226" r="6" fill="#8C5C12"/>
    <path d="M510 228 C530 250 560 270 580 300" fill="none" stroke="#8C5C12" stroke-width="3"/>
    <path d="M510 228 C530 250 560 270 580 300" fill="none" stroke="#E6C280" stroke-width="1.5" stroke-dasharray="3,2"/>

    <!-- Hanging Card Tag -->
    <g transform="translate(580, 275) rotate(16)" filter="url(#tagShadow)">
      <!-- Hole & Eyelet -->
      <circle cx="50" cy="15" r="5" fill="#5A3A1A"/>
      <circle cx="50" cy="15" r="3" fill="#DFCCA8"/>

      <!-- Die-cut Ornate Tag Shape -->
      <path d="M20 25 C10 35 10 50 10 65 L10 180 C10 195 25 205 50 215 C75 205 90 195 90 180 L90 65 C90 50 90 35 80 25 L50 10 Z" fill="#FFFDF8" stroke="#B8860B" stroke-width="2"/>
      <path d="M24 30 C16 38 16 52 16 66 L16 176 C16 188 28 196 50 206 C72 196 84 188 84 176 L84 66 C84 52 84 38 76 30 L50 16 Z" fill="none" stroke="#C59328" stroke-width="1" stroke-dasharray="4,2"/>

      <!-- Tag Mini Brand Crest -->
      <circle cx="50" cy="50" r="14" fill="#FAF5E8" stroke="#C59328" stroke-width="0.8"/>
      <ellipse cx="50" cy="50" rx="8" ry="5" fill="#2E4A28"/>
      <text x="50" y="74" text-anchor="middle" font-family="'DM Serif Display', Georgia, serif" font-size="8.5" font-weight="900" letter-spacing="1" fill="#193826">GAVYADHENU</text>

      <!-- Tag Product Name -->
      <text x="50" y="105" text-anchor="middle" font-family="'DM Serif Display', Georgia, serif" font-size="12" font-weight="800" font-style="italic" fill="${accentColor}">${tagLabel}</text>
      <line x1="25" y1="114" x2="75" y2="114" stroke="#D4AF37" stroke-width="1"/>

      <!-- Tag Botanical Stamp -->
      <circle cx="50" cy="140" r="16" fill="#F8F3E5" stroke="#C47D2B" stroke-width="1"/>
      <path d="M50 128 L50 152 M40 138 L60 144 M40 144 L60 138" stroke="#193826" stroke-width="1.5"/>

      <text x="50" y="172" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="6.5" font-weight="800" letter-spacing="0.6" fill="#2E4A28">100% PURE</text>
      <text x="50" y="182" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="5.5" font-weight="600" fill="#8C532B">Bharat Origin</text>
    </g>
  </g>

  <!-- 8. Realistic Foreground Art (Spices, Lotus Seeds, Wheat, Honeycomb, Terracotta) -->
  <g transform="translate(0, 0)">
    ${foregroundArt}
  </g>
</svg>`;
}

const customProducts = [
  {
    fileName: "wildflower-honey.jpg",
    productTitle1: "Raw Wildflower",
    productTitle2: "FOREST HONEY",
    subtitle: "SINGLE ORIGIN • UNPASTEURIZED & UNHEATED • 500G",
    categoryBadge: "NATURAL MULTI-FLORA NECTAR",
    fillColor: "#C87B07",
    accentColor: "#B46300",
    tagLabel: "Raw Honey",
    powderTexture: `
      <!-- Honey liquid amber glow -->
      <radialGradient id="honeyGlow" cx="45%" cy="45%" r="60%">
        <stop offset="0%" stop-color="#FFBD38" stop-opacity="0.85"/>
        <stop offset="60%" stop-color="#D47E02" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#8F4B00" stop-opacity="0.98"/>
      </radialGradient>
      <rect x="230" y="245" width="345" height="430" rx="12" fill="url(#honeyGlow)"/>
    `,
    foregroundArt: `
      <!-- Honey Dipper with Dripping Golden Honey -->
      <g transform="translate(160, 610) rotate(-25)">
        <!-- Turned wood handle -->
        <rect x="-8" y="-120" width="16" height="150" rx="6" fill="#8C5A2B" stroke="#5E3816" stroke-width="1.5"/>
        <ellipse cx="0" cy="30" rx="22" ry="14" fill="#B27A43" stroke="#5E3816" stroke-width="1.5"/>
        <ellipse cx="0" cy="45" rx="26" ry="14" fill="#B27A43" stroke="#5E3816" stroke-width="1.5"/>
        <ellipse cx="0" cy="60" rx="22" ry="14" fill="#B27A43" stroke="#5E3816" stroke-width="1.5"/>
        <!-- Honey coated on dipper -->
        <path d="M-22 35 C-22 75 -15 90 0 95 C15 90 22 75 22 35 Z" fill="#F4A61D" opacity="0.85"/>
        <!-- Drips -->
        <path d="M0 95 Q5 125 0 135 Q-5 125 0 95" fill="#F4A61D"/>
        <circle cx="2" cy="142" r="5" fill="#F4A61D"/>
      </g>

      <!-- Raw Beeswax Honeycomb Slice -->
      <g transform="translate(620, 630)">
        <polygon points="0,0 35,-20 70,0 70,40 35,60 0,40" fill="#E8A727" stroke="#A76807" stroke-width="2"/>
        <polygon points="65,0 100,-20 135,0 135,40 100,60 65,40" fill="#F7B83B" stroke="#A76807" stroke-width="2"/>
        <polygon points="33,35 68,15 103,35 103,75 68,95 33,75" fill="#DE9718" stroke="#A76807" stroke-width="2"/>
        <circle cx="68" cy="55" r="14" fill="#8C5204" opacity="0.3"/>
        <path d="M70 70 Q75 100 70 110" stroke="#F4A61D" stroke-width="5" stroke-linecap="round"/>
      </g>
    `
  },
  {
    fileName: "farmstead-makhana.jpg",
    productTitle1: "Farmstead",
    productTitle2: "ROASTED MAKHANA",
    subtitle: "MITHILA WETLANDS • SLOW ROASTED • 250G",
    categoryBadge: "HIGH PROTEIN FOX NUTS",
    fillColor: "#FAF7EF",
    accentColor: "#264653",
    tagLabel: "Makhana",
    powderTexture: `
      <g transform="translate(240, 260)">
        <!-- Cluster of puffed makhana inside glass jar -->
        ${[
          {x:40,y:40,r:22},{x:90,y:30,r:25},{x:150,y:45,r:24},{x:210,y:35,r:22},{x:260,y:50,r:20},
          {x:50,y:100,r:24},{x:110,y:90,r:26},{x:180,y:105,r:25},{x:240,y:95,r:23},
          {x:45,y:350,r:25},{x:110,y:360,r:26},{x:175,y:355,r:24},{x:240,y:360,r:22}
        ].map(m => `
          <circle cx="${m.x}" cy="${m.y}" r="${m.r}" fill="#FAF5E8" stroke="#E2DAC7" stroke-width="2"/>
          <circle cx="${m.x+3}" cy="${m.y-2}" r="${m.r*0.3}" fill="#BA8748" opacity="0.6"/>
        `).join("")}
      </g>
    `,
    foregroundArt: `
      <!-- Engraved Wooden Bowl with Crispy Roasted Makhana -->
      <g transform="translate(180, 680)">
        <ellipse cx="0" cy="20" rx="100" ry="40" fill="#5E3816" stroke="#3D200A" stroke-width="2.5"/>
        <ellipse cx="0" cy="12" rx="90" ry="32" fill="#7D4C22"/>
        <!-- Makhana balls overflowing bowl -->
        <circle cx="-50" cy="-5" r="24" fill="#FFFDF8" stroke="#D8CEB9" stroke-width="2"/>
        <circle cx="-50" cy="-3" r="7" fill="#B58348" opacity="0.7"/>
        <circle cx="0" cy="-18" r="26" fill="#FAF6ED" stroke="#D8CEB9" stroke-width="2"/>
        <circle cx="2" cy="-17" r="8" fill="#B58348" opacity="0.7"/>
        <circle cx="45" cy="-8" r="23" fill="#FFFDF8" stroke="#D8CEB9" stroke-width="2"/>
        <circle cx="48" cy="-6" r="6" fill="#B58348" opacity="0.7"/>
        <circle cx="-25" cy="-28" r="25" fill="#FAF6EE" stroke="#D8CEB9" stroke-width="2"/>
        <circle cx="25" cy="-30" r="24" fill="#FFFDF8" stroke="#D8CEB9" stroke-width="2"/>
      </g>
      <!-- Scattered makhana on table -->
      <circle cx="620" cy="710" r="22" fill="#FAF6EE" stroke="#D8CEB9" stroke-width="1.5"/>
      <circle cx="622" cy="708" r="6" fill="#B58348" opacity="0.7"/>
      <circle cx="670" cy="735" r="19" fill="#FFFDF8" stroke="#D8CEB9" stroke-width="1.5"/>
    `
  },
  {
    fileName: "sattu-powder.jpg",
    productTitle1: "Bihar Roasted",
    productTitle2: "CHANA SATTU",
    subtitle: "STONE CHAKKI GROUND • HIGH PLANT PROTEIN • 1KG",
    categoryBadge: "DESI BENGAL GRAM FLOUR",
    fillColor: "#C98855",
    accentColor: "#93471D",
    tagLabel: "Chana Sattu",
    powderTexture: `
      <radialGradient id="sattuShade" cx="50%" cy="50%" r="65%">
        <stop offset="0%" stop-color="#E2A676"/>
        <stop offset="70%" stop-color="#C27E4B"/>
        <stop offset="100%" stop-color="#9C5929"/>
      </radialGradient>
      <rect x="230" y="245" width="345" height="430" rx="12" fill="url(#sattuShade)"/>
    `,
    foregroundArt: `
      <!-- Traditional Stone Chakki (Grinding Wheel) -->
      <g transform="translate(190, 670)">
        <ellipse cx="0" cy="25" rx="85" ry="32" fill="#786B60" stroke="#483E36" stroke-width="2"/>
        <ellipse cx="0" cy="12" rx="80" ry="28" fill="#9C8F84" stroke="#483E36" stroke-width="1.5"/>
        <ellipse cx="0" cy="-10" rx="65" ry="24" fill="#786B60" stroke="#483E36" stroke-width="2"/>
        <ellipse cx="0" cy="-18" rx="60" ry="20" fill="#9C8F84" stroke="#483E36" stroke-width="1.5"/>
        <!-- Wooden Peg Handle -->
        <rect x="25" y="-55" width="10" height="42" rx="3" fill="#4A3423" stroke="#2B1D12" stroke-width="1"/>
        <!-- Fresh sattu powder spilled from chakki -->
        <path d="M-60 25 Q-15 5 15 25 Q60 30 75 45 Q0 55 -60 25 Z" fill="#DFA372"/>
      </g>
      <!-- Roasted brown chickpeas scattered -->
      <g transform="translate(630, 680)">
        ${[
          {x:0,y:0},{x:20,y:-10},{x:40,y:5},{x:15,y:20},{x:35,y:30},{x:-15,y:15},{x:-10,y:35}
        ].map(p => `
          <circle cx="${p.x}" cy="${p.y}" r="8" fill="#7C4825" stroke="#4F2B12" stroke-width="1"/>
          <path d="M${p.x-3} ${p.y-3} Q${p.x} ${p.y-7} ${p.x+3} ${p.y-3}" stroke="#361A07" stroke-width="1.2" fill="none"/>
        `).join("")}
      </g>
    `
  },
  {
    fileName: "mp-sharbati-wheat-flour.jpg",
    productTitle1: "MP Sehore",
    productTitle2: "SHARBATI ATTA",
    subtitle: "SLOW STONE CHAKKI GROUND • HIGH FIBRE • 5KG",
    categoryBadge: "100% WHOLE GRAIN WHEAT",
    fillColor: "#EAD6B8",
    accentColor: "#8C5823",
    tagLabel: "Sharbati Atta",
    powderTexture: `
      <radialGradient id="attaShade" cx="50%" cy="50%" r="65%">
        <stop offset="0%" stop-color="#F5E8D3"/>
        <stop offset="70%" stop-color="#E2CCA8"/>
        <stop offset="100%" stop-color="#C5AC84"/>
      </radialGradient>
      <rect x="230" y="245" width="345" height="430" rx="12" fill="url(#attaShade)"/>
    `,
    foregroundArt: `
      <!-- Golden Wheat Stalks & Chakki Scoop -->
      <g transform="translate(160, 680) rotate(-20)">
        <!-- Wheat ear 1 -->
        <line x1="0" y1="40" x2="0" y2="-110" stroke="#BFA054" stroke-width="3"/>
        ${[-90,-75,-60,-45,-30,-15,0].map(y => `
          <ellipse cx="-8" cy="${y}" rx="7" ry="14" fill="#E5C778" stroke="#A68735" stroke-width="1" transform="rotate(-30 -8 ${y})"/>
          <ellipse cx="8" cy="${y}" rx="7" ry="14" fill="#E5C778" stroke="#A68735" stroke-width="1" transform="rotate(30 8 ${y})"/>
        `).join("")}
      </g>
      <!-- Wooden scoop of flour on right -->
      <g transform="translate(630, 680)">
        <ellipse cx="0" cy="15" rx="60" ry="25" fill="#754722" stroke="#482A11" stroke-width="2"/>
        <ellipse cx="0" cy="10" rx="55" ry="20" fill="#FBF4E6"/>
        <path d="M-40 10 Q0 -15 40 10 Z" fill="#F5E8D3"/>
      </g>
    `
  },
  {
    fileName: "quiet-morning-brew.jpg",
    productTitle1: "Quiet Morning",
    productTitle2: "TULSI BREW",
    subtitle: "KRISHNA & RAMA TULSI • GREEN CARDAMOM • 40 BAGS",
    categoryBadge: "AYURVEDIC WELLNESS INFUSION",
    fillColor: "#3F5E46",
    accentColor: "#2D633B",
    tagLabel: "Tulsi Brew",
    powderTexture: `
      <radialGradient id="teaShade" cx="50%" cy="50%" r="65%">
        <stop offset="0%" stop-color="#557C5E"/>
        <stop offset="70%" stop-color="#3A5A40"/>
        <stop offset="100%" stop-color="#243E29"/>
      </radialGradient>
      <rect x="230" y="245" width="345" height="430" rx="12" fill="url(#teaShade)"/>
    `,
    foregroundArt: `
      <!-- Earthen Steeping Kulhad Cup with Rising Steam -->
      <g transform="translate(180, 670)">
        <path d="M-35 -20 L-45 35 C-45 50 -25 55 0 55 C25 55 45 50 45 35 L35 -20 Z" fill="#A85738" stroke="#6F321C" stroke-width="2"/>
        <ellipse cx="0" cy="-20" rx="35" ry="10" fill="#78351D"/>
        <ellipse cx="0" cy="-20" rx="30" ry="8" fill="#5E381A"/>
        <!-- Rising Steam wisps -->
        <path d="M-10 -35 Q-20 -60 -5 -80 Q10 -100 -5 -120" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.4" stroke-linecap="round"/>
        <path d="M10 -35 Q25 -60 15 -80 Q5 -100 20 -120" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.35" stroke-linecap="round"/>
      </g>
      <!-- Fresh Tulsi holy basil leaves & Cardamom pods on table -->
      <g transform="translate(630, 690)">
        <ellipse cx="0" cy="0" rx="20" ry="10" fill="#3D7344" transform="rotate(-25 0 0)"/>
        <ellipse cx="25" cy="15" rx="18" ry="9" fill="#2E5C34" transform="rotate(20 25 15)"/>
        <!-- Green Cardamom Pod -->
        <ellipse cx="-25" cy="15" rx="12" ry="7" fill="#7BA05B" stroke="#48682F" stroke-width="1.2" transform="rotate(35 -25 15)"/>
        <line x1="-32" y1="11" x2="-18" y2="19" stroke="#375222" stroke-width="1"/>
      </g>
    `
  },
  {
    fileName: "earthen-candle.jpg",
    productTitle1: "Terracotta Soy",
    productTitle2: "EARTHEN CANDLE",
    subtitle: "PURE SOY WAX • CEDARWOOD & VETIVER • 180G",
    categoryBadge: "HANDCRAFTED AROMATHERAPY",
    fillColor: "#C26247",
    accentColor: "#A3472C",
    tagLabel: "Soy Candle",
    powderTexture: `
      <radialGradient id="candleShade" cx="50%" cy="50%" r="65%">
        <stop offset="0%" stop-color="#D97A5F"/>
        <stop offset="70%" stop-color="#B85539"/>
        <stop offset="100%" stop-color="#8A341D"/>
      </radialGradient>
      <rect x="230" y="245" width="345" height="430" rx="12" fill="url(#candleShade)"/>
    `,
    foregroundArt: `
      <!-- Burning Terracotta Mitti Bowl Candle with Warm Flame -->
      <g transform="translate(190, 660)">
        <!-- Terracotta Mitti Bowl -->
        <path d="M-70 10 C-70 50 -40 70 0 70 C40 70 70 50 70 10 Z" fill="#B85539" stroke="#78301B" stroke-width="2"/>
        <ellipse cx="0" cy="10" rx="70" ry="20" fill="#CC6B4F"/>
        <!-- Soy wax inside -->
        <ellipse cx="0" cy="12" rx="62" ry="16" fill="#FDFBF4"/>
        <!-- Wick -->
        <line x1="0" y1="12" x2="0" y2="-12" stroke="#2B1608" stroke-width="3"/>
        <!-- Flickering Flame -->
        <path d="M0 -45 C15 -25 16 -5 0 2 C-16 -5 -15 -25 0 -45 Z" fill="#FFA500" filter="url(#glow)"/>
        <path d="M0 -35 C8 -20 8 -5 0 0 C-8 -5 -8 -20 0 -35 Z" fill="#FFF2A3"/>
      </g>
      <!-- Cedar twigs and vetiver roots on table -->
      <g transform="translate(620, 690)">
        <line x1="-30" y1="20" x2="40" y2="-10" stroke="#7A522E" stroke-width="4" stroke-linecap="round"/>
        <line x1="-10" y1="10" x2="-20" y2="-5" stroke="#3E6B35" stroke-width="2"/>
        <line x1="15" y1="0" x2="10" y2="-15" stroke="#3E6B35" stroke-width="2"/>
      </g>
    `
  },
  {
    fileName: "the-living-gift-box.jpg",
    productTitle1: "The Living Farm",
    productTitle2: "GIFT HAMPER",
    subtitle: "BILONA GHEE • WILD HONEY • HALDI • CLAY DIYAS",
    categoryBadge: "FESTIVE HARVEST EDITION",
    fillColor: "#753913",
    accentColor: "#C47D2B",
    tagLabel: "Gift Box",
    powderTexture: `
      <linearGradient id="boxShade" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#914D1E"/>
        <stop offset="50%" stop-color="#6B3510"/>
        <stop offset="100%" stop-color="#4A2207"/>
      </linearGradient>
      <rect x="230" y="245" width="345" height="430" rx="12" fill="url(#boxShade)"/>
    `,
    foregroundArt: `
      <!-- Teak Wood Gift Chest with Golden Ribbon and Brass Diya -->
      <g transform="translate(190, 660)">
        <rect x="-80" y="0" width="160" height="75" rx="8" fill="#572B0C" stroke="#2D1504" stroke-width="2"/>
        <!-- Golden ribbon -->
        <rect x="-12" y="0" width="24" height="75" fill="#E5B94F"/>
        <!-- Brass Diya with lit flame -->
        <ellipse cx="60" cy="45" rx="28" ry="12" fill="#D4AF37" stroke="#8C6F12" stroke-width="1.5"/>
        <ellipse cx="60" cy="43" rx="24" ry="9" fill="#B38F1F"/>
        <path d="M78 40 Q85 30 78 20 Q72 30 78 40" fill="#FFA500"/>
      </g>
    `
  },
  {
    fileName: "wood-ash-cleaner.jpg",
    productTitle1: "Sacred Cow Dung",
    productTitle2: "WOOD ASH SCRUB",
    subtitle: "NEEM & LEMON OIL • SPARKLING COPPER & BRASS • 250G",
    categoryBadge: "100% NATURAL BIO CLEANER",
    fillColor: "#6C757D",
    accentColor: "#2F3E46",
    tagLabel: "Ash Cleaner",
    powderTexture: `
      <radialGradient id="ashShade" cx="50%" cy="50%" r="65%">
        <stop offset="0%" stop-color="#8A939A"/>
        <stop offset="70%" stop-color="#6C757D"/>
        <stop offset="100%" stop-color="#495057"/>
      </radialGradient>
      <rect x="230" y="245" width="345" height="430" rx="12" fill="url(#ashShade)"/>
    `,
    foregroundArt: `
      <!-- Fresh Lemon Slice & Sparkling Brass Utensil -->
      <g transform="translate(180, 680)">
        <!-- Fresh cut lemon half -->
        <circle cx="0" cy="10" r="32" fill="#F8CA00" stroke="#B89200" stroke-width="2"/>
        <circle cx="0" cy="10" r="26" fill="#FFF275"/>
        <!-- Lemon segments -->
        ${[0,45,90,135,180,225,270,315].map(a => `
          <line x1="0" y1="10" x2="${Math.cos(a*Math.PI/180)*24}" y2="${10+Math.sin(a*Math.PI/180)*24}" stroke="#F8CA00" stroke-width="1.5"/>
        `).join("")}
      </g>
      <!-- Fresh Green Neem Leaves on right -->
      <g transform="translate(630, 680)">
        <path d="M-20 20 Q10 0 40 -20" stroke="#387034" stroke-width="2" fill="none"/>
        <ellipse cx="0" cy="5" rx="14" ry="6" fill="#4B8C3E" transform="rotate(-30 0 5)"/>
        <ellipse cx="20" cy="-8" rx="14" ry="6" fill="#3D7333" transform="rotate(-40 20 -8)"/>
      </g>
    `
  },
  {
    fileName: "coconut-scrubber.jpg",
    productTitle1: "Biodegradable",
    productTitle2: "COCONUT COIR",
    subtitle: "TREATED COCONUT FIBRE • NON-SCRATCH • PACK OF 3",
    categoryBadge: "100% ZERO PLASTIC SCRUBBERS",
    fillColor: "#8D5B28",
    accentColor: "#663B14",
    tagLabel: "Coir Scrub",
    powderTexture: `
      <radialGradient id="coirShade" cx="50%" cy="50%" r="65%">
        <stop offset="0%" stop-color="#A8713B"/>
        <stop offset="70%" stop-color="#8D5B28"/>
        <stop offset="100%" stop-color="#5E3814"/>
      </radialGradient>
      <rect x="230" y="245" width="345" height="430" rx="12" fill="url(#coirShade)"/>
    `,
    foregroundArt: `
      <!-- Trio of Natural Round Coir Pads with Jute Tie -->
      <g transform="translate(190, 670)">
        <ellipse cx="0" cy="30" rx="75" ry="25" fill="#75471F" stroke="#482A11" stroke-width="2"/>
        <ellipse cx="-5" cy="10" rx="75" ry="25" fill="#8D5B28" stroke="#482A11" stroke-width="2"/>
        <ellipse cx="5" cy="-10" rx="75" ry="25" fill="#A8713B" stroke="#482A11" stroke-width="2"/>
        <!-- Coir fiber texture marks -->
        <line x1="-30" y1="-15" x2="-10" y2="-8" stroke="#5E3814" stroke-width="2"/>
        <line x1="10" y1="-12" x2="35" y2="-5" stroke="#5E3814" stroke-width="2"/>
      </g>
    `
  },
  {
    fileName: "pashu-starter-pack.jpg",
    productTitle1: "Pashu Raksha",
    productTitle2: "CATTLE CARE KIT",
    subtitle: "HERBAL SPRAY • HIMALAYAN SALT LICK • NEEM BALM",
    categoryBadge: "AYURVEDIC LIVESTOCK HEALTH",
    fillColor: "#2D5A27",
    accentColor: "#C47D2B",
    tagLabel: "Cattle Care",
    powderTexture: `
      <radialGradient id="pashuShade" cx="50%" cy="50%" r="65%">
        <stop offset="0%" stop-color="#45783E"/>
        <stop offset="70%" stop-color="#2D5A27"/>
        <stop offset="100%" stop-color="#1A3816"/>
      </radialGradient>
      <rect x="230" y="245" width="345" height="430" rx="12" fill="url(#pashuShade)"/>
    `,
    foregroundArt: `
      <!-- Herbal Spray Bottle & Himalayan Pink Mineral Salt Block -->
      <g transform="translate(170, 660)">
        <polygon points="-40,40 10,0 50,20 0,60" fill="#E89B88" stroke="#A85B4A" stroke-width="1.5"/>
        <polygon points="10,0 50,20 70,-10 30,-30" fill="#F4B8A8" stroke="#A85B4A" stroke-width="1.5"/>
      </g>
      <!-- Herbal spray bottle on right -->
      <g transform="translate(630, 650)">
        <rect x="-20" y="-30" width="40" height="90" rx="8" fill="#E5B94F" stroke="#9E7818" stroke-width="1.5"/>
        <rect x="-10" y="-50" width="20" height="20" fill="#2E4A28"/>
        <path d="M-10 -50 L-30 -60 L-30 -45 Z" fill="#2E4A28"/>
      </g>
    `
  }
];

for (const p of customProducts) {
  const filePath = path.join(outDir, p.fileName);
  const svgContent = renderMasterProductPackaging(p);
  fs.writeFileSync(filePath, svgContent, "utf8");
  console.log(`Generated: ${p.fileName}`);
}

console.log(`Successfully generated all ${customProducts.length} premium packaging artworks!`);
